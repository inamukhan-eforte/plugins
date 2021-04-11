"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const react_1 = __importDefault(require("react"));
const components_1 = require("./components");
const eui_1 = require("@elastic/eui");
const eui_2 = require("@elastic/eui");
exports.Category = ({ name, items, updatedConfig, setUpdatedConfig }) => {
    return (react_1.default.createElement(eui_1.EuiFlexItem, null,
        react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "l" },
            react_1.default.createElement(eui_1.EuiText, null,
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement("h2", null, name)))),
            react_1.default.createElement(eui_1.EuiForm, null, items.map((item, idx) => (react_1.default.createElement(eui_1.EuiDescribedFormGroup, { fullWidth: true, key: idx, className: `mgtAdvancedSettings__field${isUpdated(updatedConfig, item) ? ' mgtAdvancedSettings__field--unsaved' : ''}`, title: react_1.default.createElement(eui_1.EuiTitle, { className: "mgtAdvancedSettings__fieldTitle", size: "s" },
                    react_1.default.createElement("span", null,
                        item.name,
                        isUpdated(updatedConfig, item)
                            && react_1.default.createElement(eui_2.EuiIconTip, { anchorClassName: "mgtAdvancedSettings__fieldTitleUnsavedIcon", type: 'dot', color: 'warning', "aria-label": item.setting, content: `${updatedConfig[item.setting]}` }))), description: item.description },
                react_1.default.createElement(eui_1.EuiFormRow, { label: item.setting, fullWidth: true },
                    react_1.default.createElement(components_1.FieldForm, { item: item, updatedConfig: updatedConfig, setUpdatedConfig: setUpdatedConfig })))))))));
};
const isUpdated = (configs, item) => typeof configs[item.setting] !== 'undefined';
