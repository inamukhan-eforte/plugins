"use strict";
/*
 * Wazuh app - Prompt when Statistics has not indices
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
exports.PromptStatisticsNoIndices = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const wazuh_config_1 = require("../../../../../react-services/wazuh-config");
exports.PromptStatisticsNoIndices = () => {
    const [indexName, setIndexName] = react_1.useState("");
    react_1.useEffect(() => {
        const wazuhConfig = new wazuh_config_1.WazuhConfig();
        const config = wazuhConfig.getConfig();
        setIndexName(`${config["cron.prefix"] || 'wazuh'}-${config["cron.statistics.index.name"] || 'stastistics'}-*`);
    }, []);
    return (react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "securitySignalDetected", title: react_1.default.createElement("h2", null,
            indexName,
            " indices were not found.") }));
};
