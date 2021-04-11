"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WzButton = void 0;
/*
 * Wazuh app - React component for base button that wraps the EuiButton components
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
const react_1 = __importDefault(require("react"));
const eui_1 = require("@elastic/eui");
var WzButtonType;
(function (WzButtonType) {
    WzButtonType["default"] = "default";
    WzButtonType["empty"] = "empty";
    WzButtonType["icon"] = "icon";
    WzButtonType["link"] = "link";
})(WzButtonType || (WzButtonType = {}));
;
const WzButtons = {
    'default': eui_1.EuiButton,
    'empty': eui_1.EuiButtonEmpty,
    'icon': eui_1.EuiButtonIcon,
    'link': eui_1.EuiLink,
};
exports.WzButton = ({ buttonType = WzButtonType.default, tooltip, ...rest }) => {
    const Button = WzButtons[buttonType];
    const button = react_1.default.createElement(Button, Object.assign({}, rest));
    return tooltip ?
        react_1.default.createElement(eui_1.EuiToolTip, Object.assign({}, tooltip), button)
        : button;
};
