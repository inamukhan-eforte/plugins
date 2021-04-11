"use strict";
/*
 * Wazuh app - React hooks to manage user permission requirements
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserPermissionsPrivate = exports.useUserPermissionsRequirements = exports.useUserPermissions = void 0;
const react_redux_1 = require("react-redux");
const wz_user_permissions_1 = require("../../../react-services/wz-user-permissions");
// It retuns user permissions
exports.useUserPermissions = () => {
    const userPermissions = react_redux_1.useSelector(state => state.appStateReducers.userPermissions);
    return userPermissions;
};
// It returns user permissions validation and user permissions
exports.useUserPermissionsRequirements = (requiredPermissions) => {
    const userPermissions = exports.useUserPermissions();
    if (requiredPermissions === null) {
        return [false, userPermissions];
    }
    const requiredPermissionsArray = typeof requiredPermissions === 'function' ? requiredPermissions() : requiredPermissions;
    return [wz_user_permissions_1.WzUserPermissions.checkMissingUserPermissions(requiredPermissionsArray, userPermissions), userPermissions];
};
// It redirects to other URL if user permissions are not valid
exports.useUserPermissionsPrivate = (requiredPermissions, redirectURL) => {
    const [userPermissionsValidation, userPermissions] = exports.useUserPermissionsRequirements(requiredPermissions);
    if (userPermissionsValidation) {
        window.location.href = redirectURL;
    }
    return [userPermissionsValidation, userPermissions];
};
