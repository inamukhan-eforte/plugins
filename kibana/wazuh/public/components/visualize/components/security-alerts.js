"use strict";
/*
 * Wazuh app - React component for Visualize.
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
exports.SecurityAlerts = void 0;
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../common/hooks");
const discover_1 = require("../../common/modules/discover");
exports.SecurityAlerts = () => {
    const [query] = hooks_1.useQuery();
    const filterManager = hooks_1.useFilterManager();
    const refreshAngularDiscover = hooks_1.useRefreshAngularDiscover();
    return (react_1.default.createElement(discover_1.Discover, { shareFilterManager: [...((filterManager || {}).filters) || []], query: query, initialColumns: ["icon", "timestamp", 'rule.mitre.id', 'rule.mitre.tactic', 'rule.description', 'rule.level', 'rule.id'], implicitFilters: [], initialFilters: [], updateTotalHits: (total) => { }, refreshAngularDiscover: refreshAngularDiscover }));
};
