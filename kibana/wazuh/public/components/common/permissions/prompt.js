"use strict";
/*
 * Wazuh app - Prompt component with the user required permissions and/or roles
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WzPromptPermissions = exports.WzEmptyPromptNoPermissions = void 0;
const react_1 = __importStar(require("react"));
const useUserPermissions_1 = require("../hooks/useUserPermissions");
const useUserRoles_1 = require("../hooks/useUserRoles");
const eui_1 = require("@elastic/eui");
const format_1 = require("./format");
exports.WzEmptyPromptNoPermissions = ({ permissions, roles, actions }) => {
    const prompt = (react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "securityApp", title: react_1.default.createElement("h2", null, "You have no permissions"), body: react_1.default.createElement(react_1.Fragment, null,
            permissions && (react_1.default.createElement("div", null,
                "This section requires the ",
                permissions.length > 1 ? 'permissions' : 'permission',
                ":",
                format_1.WzPermissionsFormatted(permissions))),
            permissions && roles && (react_1.default.createElement(eui_1.EuiSpacer, null)),
            roles && (react_1.default.createElement("div", null,
                "This section requires ",
                roles.map(role => (react_1.default.createElement("strong", { key: `empty-prompt-no-roles-${role}` }, role))).reduce((accum, cur) => [accum, ', ', cur]),
                " ",
                roles.length > 1 ? 'roles' : 'role'))), actions: actions }));
    return (
    // <EuiPanel>{prompt}</EuiPanel>
    prompt);
};
exports.WzPromptPermissions = ({ permissions = null, roles = null, children, ...rest }) => {
    const [userPermissionRequirements, userPermissions] = useUserPermissions_1.useUserPermissionsRequirements(typeof permissions === 'function' ? permissions(rest) : permissions);
    const [userRolesRequirements, userRoles] = useUserRoles_1.useUserRolesRequirements(typeof roles === 'function' ? roles(rest) : roles);
    return (userPermissionRequirements || userRolesRequirements) ? react_1.default.createElement(exports.WzEmptyPromptNoPermissions, { permissions: userPermissionRequirements, roles: userRolesRequirements }) : children;
};
