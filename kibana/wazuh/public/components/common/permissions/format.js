"use strict";
/*
 * Wazuh app - React component for render user permissions requirements
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
exports.WzPermissionsFormatted = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
exports.WzPermissionsFormatted = permissions => {
    return (react_1.default.createElement("div", null, permissions.map(permission => {
        if (Array.isArray(permission)) {
            return (react_1.default.createElement("div", { key: `no-permissions-${getPermissionComponentKey(permission)}` },
                react_1.default.createElement("div", null,
                    "- One of: ",
                    permission.map(p => PermissionFormatter(p, `no-permissions-${getPermissionComponentKey(permission)}-${getPermissionComponentKey(p)}`)).reduce((prev, cur) => [prev, ', ', cur])),
                react_1.default.createElement(eui_1.EuiSpacer, { size: 's' })));
        }
        else {
            return react_1.default.createElement("div", { key: `no-permissions-${getPermissionComponentKey(permission)}` },
                "- ",
                PermissionFormatter(permission));
        }
    })));
};
const PermissionFormatter = (permission, key) => typeof permission === 'object' ? (react_1.default.createElement(react_1.Fragment, Object.assign({}, (key ? { key } : {})),
    react_1.default.createElement("strong", null, permission.action),
    " (",
    react_1.default.createElement("span", { style: { textDecoration: 'underline' } }, permission.resource),
    ")")) : (react_1.default.createElement("strong", Object.assign({}, (key ? { key } : {})), permission));
const getPermissionComponentKey = permission => Array.isArray(permission) ? permission.map(p => getPermissionComponentKey(p)).join('-')
    : typeof permission === 'object' ? permission.action
        : permission;
