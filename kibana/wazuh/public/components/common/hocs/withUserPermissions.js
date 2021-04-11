"use strict";
/*
 * Wazuh app - React HOCs to manage user permission requirements
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
exports.withUserPermissionsPrivate = exports.withUserPermissionsRequirements = exports.withUserPermissions = void 0;
const react_1 = __importDefault(require("react"));
const useUserPermissions_1 = require("../hooks/useUserPermissions");
// This HOC passes permissionsValidation to wrapped component
exports.withUserPermissions = WrappedComponent => props => {
    const userPermissions = useUserPermissions_1.useUserPermissions();
    return react_1.default.createElement(WrappedComponent, Object.assign({}, props, { userPermissions: userPermissions }));
};
// This HOC hides the wrapped component if user has not permissions
exports.withUserPermissionsRequirements = requiredUserPermissions => WrappedComponent => props => {
    const [userPermissionsValidation, userPermissions] = useUserPermissions_1.useUserPermissionsRequirements(typeof requiredUserPermissions === 'function' ? requiredUserPermissions(props) : requiredUserPermissions);
    return react_1.default.createElement(WrappedComponent, Object.assign({}, props, { userPermissionsRequirements: userPermissionsValidation, userPermissions: userPermissions }));
};
// This HOC redirects to redirectURL if user has not permissions
exports.withUserPermissionsPrivate = (requiredUserPermissions, redirectURL) => WrappedComponent => props => {
    const [userPermissionsValidation, userPermissions] = useUserPermissions_1.useUserPermissionsPrivate(requiredUserPermissions, redirectURL);
    return userPermissionsValidation ? react_1.default.createElement(WrappedComponent, Object.assign({}, props, { userPermissionsValidation: userPermissionsValidation, userPermissions: userPermissions })) : null;
};
