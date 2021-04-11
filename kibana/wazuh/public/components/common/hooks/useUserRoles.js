"use strict";
/*
 * Wazuh app - React hooks to manage user role requirements
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
exports.useUserRolesPrivate = exports.useUserRolesRequirements = exports.useUserRoles = void 0;
const react_redux_1 = require("react-redux");
const wz_user_permissions_1 = require("../../../react-services/wz-user-permissions");
// It retuns user Roles
exports.useUserRoles = () => {
    const userRoles = react_redux_1.useSelector(state => state.appStateReducers.userRoles);
    return userRoles;
};
// It returns user roles validation and user roles
exports.useUserRolesRequirements = (requiredRoles) => {
    const userRoles = exports.useUserRoles();
    if (requiredRoles === null) {
        return [false, userRoles];
    }
    const requiredRolesArray = typeof requiredRoles === 'function' ? requiredRoles() : requiredRoles;
    return [wz_user_permissions_1.WzUserPermissions.checkMissingUserRoles(requiredRolesArray, userRoles), userRoles];
};
// It redirects to other URL if user roles are not valid
exports.useUserRolesPrivate = (requiredRoles, redirectURL) => {
    const [userRolesValidation, userRoles] = exports.useUserRolesRequirements(requiredRoles);
    if (userRolesValidation) {
        window.location.href = redirectURL;
    }
    return [userRolesValidation, userRoles];
};
