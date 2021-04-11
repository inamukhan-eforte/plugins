"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPluginVersion = void 0;
/*
 * Wazuh app - Tools to check the version of the plugin
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
const generic_request_1 = require("../react-services/generic-request");
const lodash_1 = __importDefault(require("lodash"));
const wazuhCookies = [
    ["currentApi", "/app/wazuh"],
    ["APISelector", "/app/wazuh"],
    ["clusterInfo", "/app/wazuh"],
    ["currentPattern", "/app/wazuh"],
    ["patternSelector", "/app/wazuh"],
];
exports.checkPluginVersion = async () => {
    try {
        const response = await generic_request_1.GenericRequest.request('GET', '/api/setup');
        const { revision, "app-version": appRevision } = response.data.data;
        return checkLocalstorageVersion({ revision, "app-version": appRevision });
    }
    catch (error) {
        console.error(`Error when getting the plugin version: ${error}`);
    }
};
const checkLocalstorageVersion = (appInfo) => {
    const storeAppInfo = localStorage.getItem('appInfo');
    if (!storeAppInfo) {
        updateAppInfo(appInfo);
        return;
    }
    !lodash_1.default.isEqual(appInfo, JSON.parse(storeAppInfo)) && clearBrowserInfo(appInfo);
};
const deleteWazuhCookies = ([name, path]) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
};
function clearBrowserInfo(appInfo) {
    wazuhCookies.forEach(deleteWazuhCookies);
    updateAppInfo(appInfo);
}
function updateAppInfo(appInfo) {
    localStorage.setItem("appInfo", JSON.stringify(appInfo));
}
