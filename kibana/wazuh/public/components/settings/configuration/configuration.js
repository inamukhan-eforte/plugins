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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WzConfigurationSettings = void 0;
const react_1 = __importStar(require("react"));
const components_1 = require("./components");
const hooks_1 = require("../../common/hooks");
const eui_1 = require("@elastic/eui");
const config_equivalences_1 = require("../../../utils/config-equivalences");
const wz_redux_provider_1 = __importDefault(require("../../../redux/wz-redux-provider"));
const store_1 = __importDefault(require("../../../redux/store"));
const appStateActions_1 = require("../../../redux/actions/appStateActions");
const withUserAuthorization_1 = require("../../common/hocs/withUserAuthorization");
const eui_2 = require("@elastic/eui");
const constants_1 = require("../../../../util/constants");
const WzConfigurationSettingsProvider = (props) => {
    const [loading, setLoading] = hooks_1.useKbnLoadingIndicator();
    const [config, setConfig] = react_1.useState([]);
    const [query, setQuery] = react_1.useState('');
    const [updatedConfig, setUpdateConfig] = react_1.useState({});
    react_1.useEffect(() => {
        store_1.default.dispatch(appStateActions_1.updateSelectedSettingsSection('configuration'));
        const rawConfig = props.wazuhConfig.getConfig();
        const formatedConfig = Object.keys(rawConfig).reduce((acc, conf) => [
            ...acc,
            {
                setting: conf,
                value: rawConfig[conf],
                description: config_equivalences_1.configEquivalences[conf],
                category: config_equivalences_1.categoriesEquivalence[conf],
                name: config_equivalences_1.nameEquivalence[conf],
                form: config_equivalences_1.formEquivalence[conf],
            }
        ], []);
        setConfig(formatedConfig);
    }, []);
    return (react_1.default.createElement(eui_1.EuiPage, null,
        react_1.default.createElement(eui_1.EuiPageBody, { className: 'mgtPage__body', restrictWidth: true },
            react_1.default.createElement(eui_1.EuiPageHeader, null,
                react_1.default.createElement(components_1.Header, { query: query, setQuery: setQuery })),
            react_1.default.createElement(components_1.Categories, { config: eui_1.Query.execute(query.query || query, config), updatedConfig: updatedConfig, setUpdatedConfig: setUpdateConfig }),
            react_1.default.createElement(eui_2.EuiSpacer, { size: "xxl" }),
            react_1.default.createElement(components_1.BottomBar, { updatedConfig: updatedConfig, setUpdateConfig: setUpdateConfig, setLoading: setLoading, config: config }))));
};
const WzConfigurationSettingsWrapper = withUserAuthorization_1.withUserAuthorizationPrompt(null, [constants_1.WAZUH_ROLE_ADMINISTRATOR_NAME])(WzConfigurationSettingsProvider);
function WzConfigurationSettings(props) {
    return (react_1.default.createElement(wz_redux_provider_1.default, null,
        react_1.default.createElement(WzConfigurationSettingsWrapper, Object.assign({}, props))));
}
exports.WzConfigurationSettings = WzConfigurationSettings;
