"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KbnSearchBar = void 0;
/*
 * Wazuh app - React component to integrate Kibana search bar
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
const react_2 = require("@kbn/i18n/react");
//@ts-ignore
const kibana_services_1 = require("../../../../../src/plugins/discover/public/kibana_services");
const public_1 = require("../../../../../src/plugins/data/public");
const public_2 = require("../../../../../src/plugins/kibana_react/public");
const hocs_1 = require("../common/hocs");
const lib_1 = require("./lib");
//@ts-ignore
const KbnSearchBar = (props) => {
    const KibanaServices = kibana_services_1.getServices();
    const { filterManager, indexPattern, timeFilter, timeHistory, query } = props;
    const data = {
        ...KibanaServices.data,
        query: { ...KibanaServices.data.query, filterManager, },
    };
    return (react_1.default.createElement(public_2.KibanaContextProvider, { services: {
            ...KibanaServices,
            filterManager,
            data,
            storage: lib_1.storage,
            http: KibanaServices.indexPatterns.apiClient.http,
            savedObjects: KibanaServices.indexPatterns.savedObjectsClient,
            appName: props.appName,
        } },
        react_1.default.createElement(react_2.I18nProvider, null,
            react_1.default.createElement(public_1.SearchBar, Object.assign({}, props, { 
                //@ts-ignore
                indexPatterns: [indexPattern], filters: (filterManager && filterManager.filters) || [], dateRangeFrom: timeFilter.from, dateRangeTo: timeFilter.to, onQuerySubmit: (payload) => onQuerySubmit(payload, props), onFiltersUpdated: (filters) => onFiltersUpdate(filters, props), query: query, isLoading: props.isLoading, timeHistory: timeHistory })))));
};
const onQuerySubmit = (payload, props) => {
    const { setTimeFilter, setQuery, onQuerySubmit } = props;
    const { dateRange, query } = payload;
    setQuery(query);
    setTimeFilter(dateRange);
    onQuerySubmit && onQuerySubmit(payload);
};
const onFiltersUpdate = (filters, props) => {
    const { filterManager, onFiltersUpdated } = props;
    filterManager.setFilters(filters);
    onFiltersUpdated && onFiltersUpdated(filters);
};
KbnSearchBar.defaultProps = {
    appName: 'wazuh',
};
const hoc = hocs_1.withKibanaContext(KbnSearchBar);
exports.KbnSearchBar = hoc;
