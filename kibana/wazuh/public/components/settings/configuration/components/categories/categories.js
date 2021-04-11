"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categories = void 0;
/*
 * Wazuh app - React component building the configuration component.
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
const react_1 = __importDefault(require("react"));
const components_1 = require("./components");
const eui_1 = require("@elastic/eui");
exports.Categories = ({ config, updatedConfig, setUpdatedConfig }) => {
    const categories = config.reduce((acc, conf) => {
        if (!conf.category)
            return acc;
        return {
            ...acc,
            [conf.category]: [
                ...(acc[conf.category] || []),
                conf,
            ]
        };
    }, {});
    return (react_1.default.createElement(eui_1.EuiFlexGroup, { direction: 'column' }, Object.keys(categories).map((category, idx) => (react_1.default.createElement(components_1.Category, { key: idx, name: category, items: categories[category], updatedConfig: updatedConfig, setUpdatedConfig: setUpdatedConfig })))));
};
