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
exports.Header = void 0;
const react_1 = __importStar(require("react"));
const config_equivalences_1 = require("../../../../utils/config-equivalences");
const app_navigate_1 = require("../../../../react-services/app-navigate");
const eui_1 = require("@elastic/eui");
const eui_2 = require("@elastic/eui");
exports.Header = ({ query, setQuery }) => {
    return (react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: 'none' },
        react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: 'none', direction: 'column' },
                react_1.default.createElement(Title, null),
                react_1.default.createElement(SubTitle, null))),
        react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: 'none', direction: 'column' },
                react_1.default.createElement(SearchBar, { query: query, setQuery: setQuery })))));
};
const Title = () => {
    return (react_1.default.createElement(eui_1.EuiFlexItem, null,
        react_1.default.createElement(eui_1.EuiTitle, null,
            react_1.default.createElement("h2", null,
                "App current settings\u00A0",
                react_1.default.createElement(eui_1.EuiToolTip, { position: "right", content: "More about configuration file" },
                    react_1.default.createElement(eui_1.EuiButtonIcon, { iconType: "questionInCircle", iconSize: "l", "aria-label": "Help", target: "_blank", href: "https://documentation.wazuh.com/current/user-manual/kibana-app/reference/config-file.html" }))))));
};
const SubTitle = () => {
    return (react_1.default.createElement(eui_1.EuiFlexItem, null,
        react_1.default.createElement(eui_1.EuiText, { color: "subdued", style: { paddingBottom: '15px' } }, "Configuration file located at /usr/share/kibana/optimize/wazuh/config/wazuh.yml")));
};
const SearchBar = ({ query, setQuery }) => {
    const [categories, setCategories] = react_1.useState([]);
    const [error, setError] = react_1.useState();
    react_1.useEffect(() => {
        const cats = config_equivalences_1.categoriesNames.map(item => ({ value: item }));
        setCategories(cats);
        getDefaultCategory(setQuery);
    }, []);
    const onChange = (args) => {
        if (args.error) {
            setError(args.error);
        }
        else {
            setError(undefined);
            setQuery(args);
        }
    };
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(eui_1.EuiSearchBar, { filters: [{
                    type: 'field_value_selection',
                    field: 'category',
                    name: 'Categories',
                    multiSelect: 'or',
                    options: categories,
                }], query: query.query || query, onChange: onChange }),
        !!error &&
            react_1.default.createElement(eui_2.EuiFormErrorText, null, `${error.name}: ${error.message}`)));
};
const getDefaultCategory = (setQuery) => {
    const category = app_navigate_1.AppNavigate.getUrlParameter('category');
    category && setQuery(`category:(${category})`);
};
