"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_USER_STATUS_RUN_AS = exports.APIUserAllowRunAs = exports.CacheInMemoryAPIUserAllowRunAs = void 0;
/*
 * Wazuh app - Service which caches the API user allow run as
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
const api_interceptor_1 = require("./api-interceptor");
const manage_hosts_1 = require("./manage-hosts");
const logger_1 = require("../logger");
// Private variable to save the cache
const _cache = {};
// Export an interface which interacts with the private cache object
exports.CacheInMemoryAPIUserAllowRunAs = {
    // Set an entry with API ID, username and allow_run_as
    set: (apiID, username, allow_run_as) => {
        if (!_cache[apiID]) {
            _cache[apiID] = {}; // Create a API ID entry if it doesn't exist in cache object
        }
        ;
        _cache[apiID][username] = allow_run_as;
    },
    // Get the value of an entry with API ID and username from cache
    get: (apiID, username) => _cache[apiID] && typeof _cache[apiID][username] !== 'undefined' ? _cache[apiID][username] : API_USER_STATUS_RUN_AS.DISABLED,
    // Check if it exists the API ID and username in the cache
    has: (apiID, username) => _cache[apiID] && typeof _cache[apiID][username] !== 'undefined' ? true : false
};
const apiInterceptor = new api_interceptor_1.ApiInterceptor();
const manageHosts = new manage_hosts_1.ManageHosts();
exports.APIUserAllowRunAs = {
    async check(apiId) {
        try {
            const api = await manageHosts.getHostById(apiId);
            logger_1.log('APIUserAllowRunAs:check', `Check if API user ${api.username} (${apiId}) has run_as`, 'debug');
            // Check if api.run_as is false or undefined, then it set to false in cache
            if (!api.run_as) {
                exports.CacheInMemoryAPIUserAllowRunAs.set(apiId, api.username, API_USER_STATUS_RUN_AS.DISABLED);
            }
            ;
            // Check if the API user is cached and returns it
            if (exports.CacheInMemoryAPIUserAllowRunAs.has(apiId, api.username)) {
                return exports.CacheInMemoryAPIUserAllowRunAs.get(apiId, api.username);
            }
            ;
            const response = await apiInterceptor.request('get', `${api.url}:${api.port}/security/users/me`, {}, { idHost: apiId });
            const APIUserAllowRunAs = response.data.data.affected_items[0].allow_run_as ? API_USER_STATUS_RUN_AS.ENABLED : API_USER_STATUS_RUN_AS.NOT_ALLOWED;
            // Cache the run_as for the API user
            exports.CacheInMemoryAPIUserAllowRunAs.set(apiId, api.username, APIUserAllowRunAs);
            return APIUserAllowRunAs;
        }
        catch (error) {
            logger_1.log('APIUserAllowRunAs:check', error.message || error);
            return API_USER_STATUS_RUN_AS.DISABLED;
        }
    },
    async canUse(apiId) {
        const ApiUserCanUseStatus = await exports.APIUserAllowRunAs.check(apiId);
        if (ApiUserCanUseStatus === API_USER_STATUS_RUN_AS.NOT_ALLOWED) {
            const api = await manageHosts.getHostById(apiId);
            throw new Error(`API with host ID [${apiId}] misconfigurated. The Wazuh API user [${api.username}] is not allowed to use [run_as]. Give it permissions or set [run_as] host setting with [false] value.`);
        }
        ;
        return ApiUserCanUseStatus;
    }
};
var API_USER_STATUS_RUN_AS;
(function (API_USER_STATUS_RUN_AS) {
    API_USER_STATUS_RUN_AS[API_USER_STATUS_RUN_AS["NOT_ALLOWED"] = -1] = "NOT_ALLOWED";
    API_USER_STATUS_RUN_AS[API_USER_STATUS_RUN_AS["DISABLED"] = 0] = "DISABLED";
    API_USER_STATUS_RUN_AS[API_USER_STATUS_RUN_AS["ENABLED"] = 1] = "ENABLED"; // Wazuh API user configurated with run_as=true and allow run_as
})(API_USER_STATUS_RUN_AS = exports.API_USER_STATUS_RUN_AS || (exports.API_USER_STATUS_RUN_AS = {}));
