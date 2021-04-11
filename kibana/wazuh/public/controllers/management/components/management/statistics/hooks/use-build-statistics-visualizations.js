"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBuildStatisticsVisualizations = void 0;
/*
 * Wazuh app - React component for building Remoted dashboard
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
const react_1 = require("react");
const store_1 = __importDefault(require("../../../../../../redux/store"));
const tab_visualizations_1 = require("../../../../../../factories/tab-visualizations");
const loaded_visualizations_1 = require("../../../../../../factories/loaded-visualizations");
const discover_pending_updates_1 = require("../../../../../../factories/discover-pending-updates");
const raw_visualizations_1 = require("../../../../../../factories/raw-visualizations");
const generic_request_1 = require("../../../../../../react-services/generic-request");
const visualizationsActions_1 = require("../../../../../../redux/actions/visualizationsActions");
const app_state_1 = require("../../../../../../react-services/app-state");
const wazuh_config_js_1 = require("../../../../../../react-services/wazuh-config.js");
exports.useBuildStatisticsVisualizations = (clusterNodeSelected, refreshVisualizations) => {
    const { 'cron.prefix': indexPrefix, 'cron.statistics.index.name': indexName } = new wazuh_config_js_1.WazuhConfig().getConfig();
    react_1.useEffect(() => {
        const tabVisualizations = new tab_visualizations_1.TabVisualizations();
        const rawVisualizations = new raw_visualizations_1.RawVisualizations();
        const discoverPendingUpdates = new discover_pending_updates_1.DiscoverPendingUpdates();
        const loadedVisualizations = new loaded_visualizations_1.LoadedVisualizations();
        discoverPendingUpdates.removeAll();
        rawVisualizations.removeAll();
        tabVisualizations.removeAll();
        loadedVisualizations.removeAll();
        tabVisualizations.setTab("statistics");
        tabVisualizations.assign({
            statistics: 2,
        });
        const buildStatisticsVisualizations = async () => {
            discoverPendingUpdates.addItem({ query: "", language: "lucene" }, []);
            const visData = await generic_request_1.GenericRequest.request("POST", `/elastic/visualizations/cluster-statistics/${indexPrefix}-${indexName}-*`, { nodes: { affected_items: [{}], master_node: JSON.parse(app_state_1.AppState.getCurrentAPI()).id, name: clusterNodeSelected, } });
            await rawVisualizations.assignItems(visData.data.raw);
            store_1.default.dispatch(visualizationsActions_1.updateVis({ update: true, raw: rawVisualizations.getList() }));
        };
        buildStatisticsVisualizations();
    }, [refreshVisualizations]);
};
