"use strict";
/*
 * Wazuh app - Prompt when Statistics is disabled
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
exports.PromptStatisticsDisabled = void 0;
const react_1 = __importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const app_navigate_1 = require("../../../../../react-services/app-navigate");
exports.PromptStatisticsDisabled = () => {
    const goToConfigure = e => {
        app_navigate_1.AppNavigate.navigateToModule(e, 'settings', { tab: 'configuration', category: 'statistics' });
    };
    return (react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "securitySignalDetected", title: react_1.default.createElement("h2", null, "Statistics is disabled"), actions: react_1.default.createElement(eui_1.EuiButton, { color: "primary", fill: true, iconType: "gear", onMouseDown: goToConfigure }, "Go to configure") }));
};
