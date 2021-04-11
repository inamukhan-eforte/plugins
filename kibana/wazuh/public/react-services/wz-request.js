"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WzRequest = void 0;
/*
 * Wazuh app - API request service
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
const axios_1 = __importDefault(require("axios"));
const chrome_1 = __importDefault(require("ui/chrome"));
const app_state_1 = require("./app-state");
const wz_api_check_1 = require("./wz-api-check");
const wz_authentication_1 = require("./wz-authentication");
const misc_1 = require("../factories/misc");
const wazuh_config_1 = require("./wazuh-config");
const utils_1 = require("../utils");
class WzRequest {
    /**
     * Permorn a generic request
     * @param {String} method
     * @param {String} path
     * @param {Object} payload
     */
    static async genericReq(method, path, payload = null, customTimeout = false, shouldRetry = true) {
        try {
            if (!method || !path) {
                throw new Error('Missing parameters');
            }
            this.wazuhConfig = new wazuh_config_1.WazuhConfig();
            const configuration = this.wazuhConfig.getConfig();
            const timeout = configuration ? configuration.timeout : 20000;
            const url = chrome_1.default.addBasePath(path);
            const options = {
                method: method,
                headers: { 'Content-Type': 'application/json', 'kbn-xsrf': 'kibana' },
                url: url,
                data: payload,
                timeout: customTimeout || timeout,
            };
            const data = await axios_1.default(options);
            if (data['error']) {
                throw new Error(data['error']);
            }
            return Promise.resolve(data);
        }
        catch (error) {
            utils_1.OdfeUtils.checkOdfeSessionExpired(error);
            //if the requests fails, we need to check if the API is down
            const currentApi = JSON.parse(app_state_1.AppState.getCurrentAPI() || '{}');
            if (currentApi && currentApi.id) {
                try {
                    await wz_api_check_1.ApiCheck.checkStored(currentApi.id);
                }
                catch (error) {
                    const wzMisc = new misc_1.WzMisc();
                    wzMisc.setApiIsDown(true);
                    if (!window.location.hash.includes('#/settings')) {
                        window.location.href = '/app/wazuh#/health-check';
                    }
                    return;
                }
            }
            const errorMessage = (error && error.response && error.response.data && error.response.data.message) ||
                (error || {}).message;
            if (typeof errorMessage === 'string' &&
                errorMessage.includes('status code 401') &&
                shouldRetry) {
                try {
                    await wz_authentication_1.WzAuthentication.refresh(true);
                    return this.genericReq(method, path, payload, customTimeout, false);
                }
                catch (error) {
                    return ((error || {}).data || {}).message || false
                        ? Promise.reject(error.data.message)
                        : Promise.reject(error.message || error);
                }
            }
            return errorMessage
                ? Promise.reject(errorMessage)
                : Promise.reject(error || 'Server did not respond');
        }
    }
    /**
     * Perform a request to the Wazuh API
     * @param {String} method Eg. GET, PUT, POST, DELETE
     * @param {String} path API route
     * @param {Object} body Request body
     */
    static async apiReq(method, path, body, shouldRetry = true) {
        try {
            if (!method || !path || !body) {
                throw new Error('Missing parameters');
            }
            const id = JSON.parse(app_state_1.AppState.getCurrentAPI()).id;
            const requestData = { method, path, body, id };
            const response = await this.genericReq('POST', '/api/request', requestData);
            const hasFailed = (((response || {}).data || {}).data || {}).total_failed_items || 0;
            if (hasFailed) {
                const error = ((((response.data || {}).data || {}).failed_items || [])[0] || {}).error || {};
                const failed_ids = ((((response.data || {}).data || {}).failed_items || [])[0] || {}).id || {};
                const message = (response.data || {}).message || 'Unexpected error';
                return Promise.reject(`${message} (${error.code}) - ${error.message} ${failed_ids && failed_ids.length > 1 ? ` Affected ids: ${failed_ids} ` : ''}`);
            }
            return Promise.resolve(response);
        }
        catch (error) {
            return ((error || {}).data || {}).message || false
                ? Promise.reject(error.data.message)
                : Promise.reject(error.message || error);
        }
    }
    /**
     * Perform a request to generate a CSV
     * @param {String} path
     * @param {Object} filters
     */
    static async csvReq(path, filters) {
        try {
            if (!path || !filters) {
                throw new Error('Missing parameters');
            }
            const id = JSON.parse(app_state_1.AppState.getCurrentAPI()).id;
            const requestData = { path, id, filters };
            const data = await this.genericReq('POST', '/api/csv', requestData, false);
            return Promise.resolve(data);
        }
        catch (error) {
            return ((error || {}).data || {}).message || false
                ? Promise.reject(error.data.message)
                : Promise.reject(error.message || error);
        }
    }
}
exports.WzRequest = WzRequest;
