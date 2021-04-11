"use strict";
/*
 * Wazuh app - Button with Wazuh API permissions and/or roles required to be useful
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
exports.WzButtonPermissions = void 0;
const react_1 = __importStar(require("react"));
const useUserPermissions_1 = require("../hooks/useUserPermissions");
const useUserRoles_1 = require("../hooks/useUserRoles");
const eui_1 = require("@elastic/eui");
const format_1 = require("./format");
;
;
exports.WzButtonPermissions = ({ permissions = null, roles = null, buttonType = 'default', tooltip, ...rest }) => {
    const [userPermissionRequirements, userPermissions] = useUserPermissions_1.useUserPermissionsRequirements(typeof permissions === 'function' ? permissions(rest) : permissions);
    const [userRolesRequirements, userRoles] = useUserRoles_1.useUserRolesRequirements(typeof roles === 'function' ? roles(rest) : roles);
    const Button = buttonType === 'default' ? eui_1.EuiButton
        : buttonType === 'empty' ? eui_1.EuiButtonEmpty
            : buttonType === 'icon' ? eui_1.EuiButtonIcon
                : buttonType === 'link' ? eui_1.EuiLink
                    : null;
    const disabled = Boolean(userRolesRequirements || userPermissionRequirements || rest.isDisabled);
    const disabledProp = buttonType !== 'link' ? { isDisabled: disabled } : { disabled };
    const button = react_1.default.createElement(Button, Object.assign({}, rest, disabledProp, { onClick: (disabled || !rest.onClick) ? undefined : rest.onClick }));
    const buttonTextRequirements = (userRolesRequirements || userPermissionRequirements) && (react_1.default.createElement(react_1.Fragment, null,
        userPermissionRequirements && (react_1.default.createElement("div", null,
            react_1.default.createElement("div", null,
                "Require the ",
                userPermissionRequirements.length === 1 ? 'permission' : 'permissions',
                ":"),
            format_1.WzPermissionsFormatted(userPermissionRequirements))),
        (userPermissionRequirements && userRolesRequirements) && react_1.default.createElement(eui_1.EuiSpacer, { size: 's' }),
        userRolesRequirements && (react_1.default.createElement("div", null,
            "Require ",
            userRolesRequirements.map(role => react_1.default.createElement("strong", { key: `empty-prompt-no-roles-${role}` }, role)).reduce((prev, cur) => [prev, ', ', cur]),
            " ",
            userRolesRequirements.length > 1 ? 'roles' : 'role'))));
    return (userRolesRequirements || userPermissionRequirements) ?
        (react_1.default.createElement(eui_1.EuiToolTip, Object.assign({}, tooltip, { content: buttonTextRequirements }), button)) : tooltip && tooltip.content ?
        (react_1.default.createElement(eui_1.EuiToolTip, Object.assign({}, tooltip), button))
        : button;
};
