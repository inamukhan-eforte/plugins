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
exports.BottomBar = void 0;
const react_1 = __importDefault(require("react"));
const configuration_handler_1 = __importDefault(require("../utils/configuration-handler"));
//@ts-ignore
const notify_1 = require("ui/notify");
const eui_1 = require("@elastic/eui");
const wazuh_config_1 = require("../../../../react-services/wazuh-config");
exports.BottomBar = ({ updatedConfig, setUpdateConfig, setLoading, config }) => {
    return (!!Object.keys(updatedConfig).length
        ? react_1.default.createElement(eui_1.EuiBottomBar, { paddingSize: "m" },
            react_1.default.createElement(eui_1.EuiFlexGroup, { alignItems: 'center', justifyContent: 'spaceBetween', gutterSize: 's' },
                react_1.default.createElement(SettingLabel, { updatedConfig: updatedConfig }),
                react_1.default.createElement(CancelButton, { setUpdateConfig: setUpdateConfig }),
                react_1.default.createElement(SaveButton, { updatedConfig: updatedConfig, setUpdateConfig: setUpdateConfig, setLoading: setLoading, config: config })))
        : null);
};
const SettingLabel = ({ updatedConfig }) => (react_1.default.createElement(eui_1.EuiFlexItem, { className: 'mgtAdvancedSettingsForm__unsavedCount' },
    react_1.default.createElement(eui_1.EuiText, { color: 'ghost', className: 'mgtAdvancedSettingsForm__unsavedCountMessage' }, `${Object.keys(updatedConfig).length} unsaved settings`)));
const CancelButton = ({ setUpdateConfig }) => (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
    react_1.default.createElement(eui_1.EuiButtonEmpty, { size: 's', iconSide: 'left', iconType: 'cross', color: "ghost", className: "mgtAdvancedSettingsForm__button", onClick: () => setUpdateConfig({}) }, "Cancel changes")));
const SaveButton = ({ updatedConfig, setUpdateConfig, setLoading, config }) => (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
    react_1.default.createElement(eui_1.EuiButton, { fill: true, size: 's', iconSide: 'left', iconType: 'check', color: 'secondary', className: "mgtAdvancedSettingsForm__button", onClick: () => saveSettings(updatedConfig, setUpdateConfig, setLoading, config) }, "Save changes")));
const saveSettings = async (updatedConfig, setUpdateConfig, setLoading, config) => {
    setLoading(true);
    try {
        await Promise.all(Object.keys(updatedConfig).map(async (setting) => await saveSetting(setting, updatedConfig, config)));
        successToast();
        setUpdateConfig({});
    }
    catch (error) {
        errorToast(error);
    }
    finally {
        setLoading(false);
    }
};
const saveSetting = async (setting, updatedConfig, config) => {
    try {
        (config.find(item => item.setting === setting) || { value: '' }).value = updatedConfig[setting];
        const result = await configuration_handler_1.default.editKey(setting, updatedConfig[setting]);
        // Update the app configuration frontend-cached setting in memory with the new value
        const wzConfig = new wazuh_config_1.WazuhConfig();
        wzConfig.setConfig({ ...wzConfig.getConfig(), ...{ [setting]: formatValueCachedConfiguration(updatedConfig[setting]) } });
        // Show restart and/or reload message in toast
        const response = result.data.data;
        response.needRestart && restartToast();
        response.needReload && reloadToast();
    }
    catch (error) {
        return Promise.reject(error);
    }
};
const reloadToast = () => {
    notify_1.toastNotifications.add({
        color: 'success',
        title: 'This settings require you to reload the page to take effect.',
        text: react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "flexEnd", gutterSize: "s" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButton, { onClick: () => window.location.reload(), size: "s" }, "Reload page")))
    });
};
const restartToast = () => {
    notify_1.toastNotifications.add({
        color: 'warning',
        title: 'You must restart Kibana for the changes to take effect',
    });
};
const successToast = () => {
    notify_1.toastNotifications.add({
        color: 'success',
        title: 'The configuration has been successfully updated',
    });
};
const errorToast = (error) => {
    notify_1.toastNotifications.add({
        color: 'danger',
        title: `Error saving the configuration: ${error.message || error}`,
    });
};
const formatValueCachedConfiguration = (value) => typeof value === 'string'
    ? isNaN(Number(value)) ? value : Number(value)
    : value;
