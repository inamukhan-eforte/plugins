"use strict";
/*
 * Wazuh app - Authentication service for Wazuh
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WzAuthentication = void 0;
const wz_request_1 = require("./wz-request");
const app_state_1 = require("./app-state");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const store_1 = __importDefault(require("../redux/store"));
const appStateActions_1 = require("../redux/actions/appStateActions");
const constants_1 = require("../../util/constants");
const notify_1 = require("ui/notify");
class WzAuthentication {
    static async login(force = false) {
        try {
            var idHost = JSON.parse(app_state_1.AppState.getCurrentAPI()).id;
            while (!idHost) {
                await new Promise(r => setTimeout(r, 500));
                idHost = JSON.parse(app_state_1.AppState.getCurrentAPI()).id;
            }
            const response = await wz_request_1.WzRequest.genericReq('POST', '/api/login', { idHost, force });
            const token = ((response || {}).data || {}).token;
            return token;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    static async refresh(force = false) {
        try {
            // Get user token
            const token = await WzAuthentication.login(force);
            if (!token) {
                return;
            }
            // Decode token and get expiration time
            const jwtPayload = jwt_decode_1.default(token);
            // Get user Policies
            const userPolicies = await WzAuthentication.getUserPolicies();
            // Dispatch actions to set permissions and roles
            store_1.default.dispatch(appStateActions_1.updateUserPermissions(userPolicies));
            store_1.default.dispatch(appStateActions_1.updateUserRoles(WzAuthentication.mapUserRolesIDToAdministratorRole(jwtPayload.rbac_roles || [])));
        }
        catch (error) {
            notify_1.toastNotifications.add({
                color: 'danger',
                title: 'Error getting the authorization token',
                text: error.message || error,
                toastLifeTimeMs: 300000
            });
            return Promise.reject(error);
        }
    }
    static async getUserPolicies() {
        try {
            var idHost = JSON.parse(app_state_1.AppState.getCurrentAPI()).id;
            while (!idHost) {
                await new Promise(r => setTimeout(r, 500));
                idHost = JSON.parse(app_state_1.AppState.getCurrentAPI()).id;
            }
            const response = await wz_request_1.WzRequest.apiReq('GET', '/security/users/me/policies', { idHost });
            const policies = ((response || {}).data || {}).data || {};
            return policies;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    static mapUserRolesIDToAdministratorRole(roles) {
        return roles.map((role) => role === constants_1.WAZUH_ROLE_ADMINISTRATOR_ID ? constants_1.WAZUH_ROLE_ADMINISTRATOR_NAME : role);
    }
    static logout() {
        //TODO: logout
    }
}
exports.WzAuthentication = WzAuthentication;
