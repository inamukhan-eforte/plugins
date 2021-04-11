"use strict";
/*
 * Wazuh app - React HOCs to manage user role requirements
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
exports.withUserRolesPrivate = exports.withUserRolesRequirements = exports.withUserRoles = void 0;
const react_1 = __importDefault(require("react"));
const useUserRoles_1 = require("../hooks/useUserRoles");
// This HOC passes rolesValidation to wrapped component
exports.withUserRoles = WrappedComponent => props => {
    const userRoles = useUserRoles_1.useUserRoles();
    return react_1.default.createElement(WrappedComponent, Object.assign({}, props, { userRoles: userRoles }));
};
// This HOC hides the wrapped component if user has not permissions
exports.withUserRolesRequirements = requiredUserRoles => WrappedComponent => props => {
    const [userRolesRequirements, userRoles] = useUserRoles_1.useUserRolesRequirements(typeof requiredUserRoles === 'function' ? requiredUserRoles(props) : requiredUserRoles);
    return react_1.default.createElement(WrappedComponent, Object.assign({}, props, { userRolesRequirements: userRolesRequirements, userRoles: userRoles }));
};
// This HOC redirects to redirectURL if user has not permissions
exports.withUserRolesPrivate = (requiredUserRoles, redirectURL) => WrappedComponent => props => {
    const [userRolesRequirements, userRoles] = useUserRoles_1.useUserRolesPrivate(requiredUserRoles, redirectURL);
    return userRolesRequirements ? react_1.default.createElement(WrappedComponent, Object.assign({}, props, { userRolesRequirements: userRolesRequirements, userRoles: userRoles })) : null;
};
