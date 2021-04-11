"use strict";
/*
 * Wazuh app - Component to truncate an array of components horizontally
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
exports.TruncateHorizontalComponents = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
;
exports.TruncateHorizontalComponents = ({ components, labelButtonHideComponents, renderButton, buttonProps, renderHideComponents, componentsWidthPercentage = 1 }) => {
    const [isOpen, setIsOpen] = react_1.useState(false);
    const containerRef = react_1.useRef();
    const { componentsShow, componentsHide } = groupShowOrHideComponents(components, containerRef, componentsWidthPercentage);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const buttonPopover = renderButton
        ? renderButton({ open, componentsHide })
        : react_1.default.createElement(eui_1.EuiButtonEmpty, Object.assign({}, buttonProps, { onClick: () => setIsOpen(!isOpen) }), labelButtonHideComponents(componentsHide.length));
    return (react_1.default.createElement("div", { ref: containerRef, style: { display: 'block' } },
        componentsShow,
        componentsHide.length ?
            react_1.default.createElement(eui_1.EuiPopover, { button: buttonPopover, isOpen: isOpen, closePopover: close }, renderHideComponents && renderHideComponents({ close, componentsHide }) || (react_1.default.createElement(eui_1.EuiFlexGroup, null, componentsHide)))
            : null));
};
/**
 *
 * @param components Children components
 * @param containerRef Container reference
 * @param componentsWidthPercentage Percentage which components take
 */
const groupShowOrHideComponents = (components, containerRef, componentsWidthPercentage) => {
    if (!containerRef.current || !containerRef.current.offsetWidth)
        return { componentsShow: components, componentsHide: [] };
    return components.reduce((accum, child, key) => {
        const childs = ((containerRef || {}).current || {}).childNodes;
        const currentChild = !!childs && childs[key];
        accum.width += ((currentChild || {}).offsetWidth || 0);
        if (currentChild && accum.width <= (containerRef.current.offsetWidth * componentsWidthPercentage)) {
            accum.componentsShow.push(child);
        }
        else {
            accum.componentsHide.push(child);
        }
        return accum;
    }, { componentsShow: [], componentsHide: [], width: 0 });
};
