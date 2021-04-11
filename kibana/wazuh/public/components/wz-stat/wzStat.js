"use strict";
/*
 * Wazuh app - React Component component to display simple data with title and description arranged in a row.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WzStat = exports.ALIGNMENTS = exports.isColorClass = exports.COLORS = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const common_1 = require("./common");
const classnames_1 = __importDefault(require("classnames"));
const colorToClassNameMap = {
    default: null,
    subdued: 'euiStat__title--subdued',
    primary: 'euiStat__title--primary',
    secondary: 'euiStat__title--secondary',
    danger: 'euiStat__title--danger',
    accent: 'euiStat__title--accent',
};
exports.COLORS = common_1.keysOf(colorToClassNameMap);
const textAlignToClassNameMap = {
    left: 'euiStat--leftAligned',
    center: 'euiStat--centerAligned',
    right: 'euiStat--rightAligned',
};
exports.isColorClass = (input) => {
    return colorToClassNameMap.hasOwnProperty(input);
};
exports.ALIGNMENTS = common_1.keysOf(textAlignToClassNameMap);
exports.WzStat = ({ children, className, description, isLoading = false, reverse = false, textAlign = 'left', title, titleColor = 'default', titleSize = 'l', ...rest }) => {
    const classes = classnames_1.default('euiStat', textAlignToClassNameMap[textAlign], className);
    const titleClasses = classnames_1.default('euiStat__title', exports.isColorClass(titleColor) ? colorToClassNameMap[titleColor] : null, {
        'euiStat__title-isLoading': isLoading,
    });
    const descriptionDisplay = (react_1.default.createElement(eui_1.EuiText, { size: "s", className: "euiStat__description" },
        react_1.default.createElement("span", { "aria-hidden": "true" }, description)));
    const titleDisplay = exports.isColorClass(titleColor) ? (react_1.default.createElement(eui_1.EuiTitle, { size: titleSize, className: titleClasses },
        react_1.default.createElement("span", { "aria-hidden": "true" }, isLoading ? '--' : title))) : (react_1.default.createElement(eui_1.EuiTitle, { size: titleSize, className: titleClasses },
        react_1.default.createElement("span", { "aria-hidden": "true", style: { color: `${titleColor}` } }, isLoading ? '--' : title)));
    const screenReader = (react_1.default.createElement(eui_1.EuiScreenReaderOnly, null,
        react_1.default.createElement("span", null, isLoading ? (react_1.default.createElement("span", { token: "euiStat.loadingText", default: "Statistic is loading" })) : (react_1.default.createElement(react_1.Fragment, null, reverse ? `${title} ${description}` : `${description} ${title}`)))));
    const statDisplay = (react_1.default.createElement(react_1.Fragment, null,
        !reverse && descriptionDisplay,
        titleDisplay,
        reverse && descriptionDisplay,
        screenReader));
    return (react_1.default.createElement("div", Object.assign({ className: classes }, rest),
        statDisplay,
        children));
};
