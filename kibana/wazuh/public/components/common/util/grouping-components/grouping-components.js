"use strict";
/*
 * Wazuh app - Component to group some components within another
 *
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
exports.GroupingComponents = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const hooks_1 = require("./hooks");
const lib_1 = require("./lib");
require("./grouping-components.less");
const Direction = {
    horizontal: 'row',
    vertical: 'column',
};
exports.GroupingComponents = ({ children, buttonLabel, width = 0.5, direction = 'vertical' }) => {
    const [isOpen, setIsOpen] = react_1.useState(false);
    const { parentWidth, ref } = hooks_1.useParentWidth();
    const childrenObj = lib_1.divideChildren(children, ref, parentWidth, width);
    const label = buttonLabel(childrenObj.hide.length);
    return (react_1.default.createElement("div", { ref: ref, style: { display: 'flex' } },
        childrenObj.show,
        !!childrenObj.hide.length &&
            react_1.default.createElement(eui_1.EuiPopover, { button: react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: (e) => setIsOpen(!isOpen) }, label), isOpen: isOpen, hasArrow: false, closePopover: () => setIsOpen(false) },
                react_1.default.createElement(eui_1.EuiFlexGroup, { direction: Direction[direction] }, childrenObj.hide))));
};
