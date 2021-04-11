"use strict";
/*
 * Wazuh app - Prompt when an agent is not active
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
exports.PromptNoActiveAgent = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const eui_1 = require("@elastic/eui");
const appStateActions_1 = require("../../redux/actions/appStateActions");
exports.PromptNoActiveAgent = () => {
    const dispatch = react_redux_1.useDispatch();
    const openAgentSelector = () => dispatch(appStateActions_1.showExploreAgentModal(true));
    return (react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "watchesApp", title: react_1.default.createElement("h2", null, "Agent is not active"), body: react_1.default.createElement("p", null, "This section is only available for active agents."), actions: react_1.default.createElement(eui_1.EuiButton, { color: "primary", fill: true, onClick: openAgentSelector }, "Select agent") }));
};
