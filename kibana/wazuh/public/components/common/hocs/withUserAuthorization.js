"use strict";
/*
 * Wazuh app - React HOCs to manage user authorization requirements
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
exports.withUserAuthorizationPrompt = void 0;
const react_1 = __importDefault(require("react"));
const useUserPermissions_1 = require("../hooks/useUserPermissions");
const useUserRoles_1 = require("../hooks/useUserRoles");
const prompt_1 = require("../permissions/prompt");
//
exports.withUserAuthorizationPrompt = (permissions = null, roles = null) => WrappedComponent => props => {
    const [userPermissionRequirements, userPermissions] = useUserPermissions_1.useUserPermissionsRequirements(typeof permissions === 'function' ? permissions(props) : permissions);
    const [userRolesRequirements, userRoles] = useUserRoles_1.useUserRolesRequirements(typeof roles === 'function' ? roles(props) : roles);
    return (userPermissionRequirements || userRolesRequirements) ? react_1.default.createElement(prompt_1.WzEmptyPromptNoPermissions, { permissions: userPermissionRequirements, roles: userRolesRequirements }) : react_1.default.createElement(WrappedComponent, Object.assign({}, props));
};
