"use strict";
/*
 * Wazuh app - Integrity monitoring table component
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
exports.Discover = void 0;
const react_1 = __importStar(require("react"));
require("./discover.less");
const public_1 = require("../../../../../../../src/plugins/data/public/");
const generic_request_1 = require("../../../../react-services/generic-request");
const app_state_1 = require("../../../../react-services/app-state");
const app_navigate_1 = require("../../../../react-services/app-navigate");
const row_details_1 = require("./row-details");
//@ts-ignore
const new_platform_1 = require("ui/new_platform");
//@ts-ignore
const kibana_services_1 = require("../../../../../../../src/plugins/discover/public/kibana_services");
const datemath_1 = __importDefault(require("@elastic/datemath"));
const notify_1 = require("ui/notify");
const wazuh_config_1 = require("../../../../react-services/wazuh-config");
const kbn_search_bar_1 = require("../../../kbn-search-bar");
const flyout_technique_1 = require("../../../../components/overview/mitre/components/techniques/components/flyout-technique");
const hocs_1 = require("../../../common/hocs");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const lodash_1 = __importDefault(require("lodash"));
const eui_1 = require("@elastic/eui");
const common_1 = require("../../../../../../../src/plugins/data/common");
require("../../../../components/agents/fim/inventory/inventory.less");
const mapStateToProps = state => ({
    currentAgentData: state.appStateReducers.currentAgentData
});
exports.Discover = redux_1.compose(hocs_1.withReduxProvider, react_redux_1.connect(mapStateToProps))(class Discover extends react_1.Component {
    constructor(props) {
        super(props);
        this.showToast = (color, title, time) => {
            notify_1.toastNotifications.add({
                color: color,
                title: title,
                toastLifeTimeMs: time,
            });
        };
        this.hideCreateCustomLabel = () => {
            try {
                const button = document.querySelector(".wz-discover #addFilterPopover > div > button > span > span");
                if (!button)
                    return setTimeout(this.hideCreateCustomLabel, 100);
                const findAndHide = () => {
                    const switcher = document.querySelector("#filterEditorCustomLabelSwitch");
                    if (!switcher)
                        return setTimeout(findAndHide, 100);
                    switcher.parentElement.style.display = "none";
                };
                button.onclick = findAndHide;
            }
            catch (error) { }
        };
        this.onFiltersChange = (filters) => {
            this.setState({ filters: this.filtersAsArray(filters) });
        };
        this.toggleDetails = item => {
            const itemIdToExpandedRowMap = { ...this.state.itemIdToExpandedRowMap };
            if (itemIdToExpandedRowMap[item._id]) {
                delete itemIdToExpandedRowMap[item._id];
                this.setState({ itemIdToExpandedRowMap });
            }
            else {
                const newItemIdToExpandedRowMap = {};
                newItemIdToExpandedRowMap[item._id] = ((react_1.default.createElement("div", { style: { width: "100%" } },
                    " ",
                    react_1.default.createElement(row_details_1.RowDetails, { item: item, addFilter: (filter) => this.addFilter(filter), addFilterOut: (filter) => this.addFilterOut(filter), toggleColumn: (id) => this.addColumn(id) }))));
                this.setState({ itemIdToExpandedRowMap: newItemIdToExpandedRowMap });
            }
        };
        this.columns = () => {
            var columnsList = [...this.state.columns];
            const columns = columnsList.map((item) => {
                if (item === "icon") {
                    return {
                        width: "25px",
                        isExpander: true,
                        render: item => {
                            return (react_1.default.createElement(eui_1.EuiIcon, { size: "s", type: this.state.itemIdToExpandedRowMap[item._id] ? "arrowDown" : "arrowRight" }));
                        },
                    };
                }
                if (item === "timestamp") {
                    return {
                        field: 'timestamp',
                        name: 'Time',
                        width: '10%',
                        sortable: true,
                        render: time => {
                            const date = time.split('.')[0];
                            return react_1.default.createElement("span", null,
                                date.split('T')[0],
                                " ",
                                date.split('T')[1]);
                        },
                    };
                }
                let width = false;
                let link = false;
                const arrayCompilance = ["rule.pci_dss", "rule.gdpr", "rule.nist_800_53", "rule.tsc", "rule.hipaa"];
                if (item === 'agent.id') {
                    link = (ev, x) => { app_navigate_1.AppNavigate.navigateToModule(ev, 'agents', { "tab": "welcome", "agent": x }); };
                    width = '8%';
                }
                if (item === 'agent.name') {
                    width = '12%';
                }
                if (item === 'rule.level') {
                    width = '7%';
                }
                if (item === 'rule.id') {
                    link = (ev, x) => app_navigate_1.AppNavigate.navigateToModule(ev, 'manager', { tab: 'rules', redirectRule: x });
                    width = '9%';
                }
                if (item === 'rule.description' && columnsList.indexOf('syscheck.event') === -1) {
                    width = '30%';
                }
                if (item === 'syscheck.event') {
                    width = '15%';
                }
                if (item === 'rule.mitre.id') {
                    link = (ev, x) => { this.setState({ showMitreFlyout: true, selectedTechnique: x }); };
                }
                if (arrayCompilance.indexOf(item) !== -1) {
                    width = '30%';
                }
                let column = {
                    field: item,
                    name: (react_1.default.createElement("span", { onMouseEnter: () => { this.setState({ hover: item }); }, onMouseLeave: () => { this.setState({ hover: "" }); }, style: { display: "inline-flex" } },
                        this.nameEquivalences[item] || item,
                        " ",
                        this.state.hover === item &&
                            react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: `Remove column` },
                                react_1.default.createElement(eui_1.EuiButtonIcon, { style: { paddingBottom: 12, marginBottom: "-10px", paddingTop: 0 }, onClick: (e) => { this.removeColumn(item); e.stopPropagation(); }, iconType: "cross", "aria-label": "Filter", iconSize: "s" })))),
                    sortable: true
                };
                if (width) {
                    column.width = width;
                }
                if (link && item !== 'rule.mitre.id' || (item === 'rule.mitre.id' && this.props.shareFilterManager)) {
                    column.render = itemValue => {
                        return react_1.default.createElement("span", null, (item === 'agent.id' && itemValue === '000') &&
                            react_1.default.createElement("span", { style: { fontSize: 14, marginLeft: 8 } }, itemValue)
                            || item === 'rule.mitre.id' && Array.isArray(itemValue) &&
                                itemValue.map(currentItem => react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: (ev) => { ev.stopPropagation(); }, onMouseDown: (ev) => { ev.stopPropagation(); link(ev, currentItem); } }, currentItem))
                            ||
                                react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: (ev) => { ev.stopPropagation(); }, onMouseDown: (ev) => { ev.stopPropagation(); link(ev, itemValue); } }, itemValue));
                    };
                }
                return column;
            });
            return columns;
        };
        this.onTableChange = ({ page = {}, sort = {} }) => {
            const { index: pageIndex, size: pageSize } = page;
            const { field: sortField, direction: sortDirection } = sort;
            this.setState({
                pageIndex,
                pageSize,
                sortField,
                sortDirection,
            });
        };
        this.onQuerySubmit = (payload) => {
            this.setState({ ...payload, tsUpdated: Date.now() });
        };
        this.onFiltersUpdated = (filters) => {
            this.setState({ searchBarFilters: filters });
        };
        this.closeMitreFlyout = () => {
            this.setState({ showMitreFlyout: false });
        };
        this.onMitreChangeFlyout = (showMitreFlyout) => {
            this.setState({ showMitreFlyout });
        };
        this.KibanaServices = kibana_services_1.getServices();
        this.filterManager = props.shareFilterManager ? this.KibanaServices.filterManager : new public_1.FilterManager(new_platform_1.npSetup.core.uiSettings);
        this.timefilter = this.KibanaServices.timefilter;
        this.state = {
            sort: {},
            selectedTechnique: "",
            showMitreFlyout: false,
            alerts: [],
            total: 0,
            pageIndex: 0,
            pageSize: 10,
            sortField: 'timestamp',
            sortDirection: 'desc',
            isLoading: false,
            requestFilters: {},
            requestSize: 500,
            requestOffset: 0,
            itemIdToExpandedRowMap: {},
            dateRange: this.timefilter.getTime(),
            query: props.query || { language: "kuery", query: "" },
            searchBarFilters: [],
            elasticQuery: {},
            filters: props.initialFilters,
            columns: [],
            hover: ""
        };
        this.wazuhConfig = new wazuh_config_1.WazuhConfig();
        this.nameEquivalences = {
            "agent.id": "Agent",
            "agent.name": "Agent name",
            "syscheck.event": "Action",
            "rule.id": "Rule ID",
            "rule.description": "Description",
            "rule.level": "Level",
            "rule.mitre.id": "Technique(s)",
            "rule.mitre.tactic": "Tactic(s)",
            "rule.pci_dss": "PCI DSS",
            "rule.gdpr": "GDPR",
            "rule.nist_800_53": "NIST 800-53",
            "rule.tsc": "TSC",
            "rule.hipaa": "HIPAA",
        };
        this.hideCreateCustomLabel.bind(this);
        this.onQuerySubmit.bind(this);
        this.onFiltersUpdated.bind(this);
        this.hideCreateCustomLabel();
    }
    async componentDidMount() {
        this._isMount = true;
        try {
            this.setState({ columns: this.getColumns(), searchBarFilters: this.props.shareFilterManager || [] }); //initial columns
            await this.getIndexPattern();
            await this.getAlerts();
        }
        catch (err) {
            console.log(err);
        }
    }
    componentWillUnmount() {
        this._isMount = false;
    }
    async componentDidUpdate(prevProps, prevState) {
        if (!this._isMount) {
            return;
        }
        if ((!prevProps.currentAgentData.id && this.props.currentAgentData.id) || (prevProps.currentAgentData.id && !this.props.currentAgentData.id)) {
            this.setState({ columns: this.getColumns() }); // Updates the columns to be rendered if you change the selected agent to none or vice versa
            return;
        }
        if (!lodash_1.default.isEqual(this.props.query, prevProps.query)) {
            this.setState({ query: { ...this.props.query } });
            return;
        }
        ;
        if ((!lodash_1.default.isEqual(this.props.shareFilterManager, prevProps.shareFilterManager))
            || (this.props.currentAgentData.id !== prevProps.currentAgentData.id)
            || (!lodash_1.default.isEqual(this.state.query, prevState.query))
            || (!lodash_1.default.isEqual(this.state.searchBarFilters, prevState.searchBarFilters))
            || (!lodash_1.default.isEqual(this.state.dateRange, prevState.dateRange))
            || (this.props.refreshAngularDiscover !== prevProps.refreshAngularDiscover)) {
            this.setState({ pageIndex: 0, tsUpdated: Date.now() });
            return;
        }
        ;
        if (['pageIndex', 'pageSize', 'sortField', 'sortDirection'].some(field => this.state[field] !== prevState[field]) || (this.state.tsUpdated !== prevState.tsUpdated)) {
            try {
                await this.getAlerts();
            }
            catch (err) {
                console.log(err);
            }
            ;
        }
        ;
    }
    getColumns() {
        if (this.props.currentAgentData.id) {
            return this.props.initialColumns.filter(column => !['agent.id', 'agent.name'].includes(column));
        }
        else {
            const columns = [...this.props.initialColumns];
            columns.splice(2, 0, 'agent.id');
            columns.splice(3, 0, 'agent.name');
            return columns;
        }
    }
    async getIndexPattern() {
        this.indexPattern = { ...await this.KibanaServices.indexPatterns.get(app_state_1.AppState.getCurrentPattern()) };
        const fields = [];
        Object.keys(this.indexPattern.fields).forEach(item => {
            if (isNaN(item)) {
                fields.push(this.indexPattern.fields[item]);
            }
            else if (this.props.includeFilters && this.indexPattern.fields[item].name.includes(this.props.includeFilters)) {
                fields.unshift(this.indexPattern.fields[item]);
            }
            else {
                fields.push(this.indexPattern.fields[item]);
            }
        });
        this.indexPattern.fields = fields;
    }
    filtersAsArray(filters) {
        const keys = Object.keys(filters);
        const result = [];
        for (var i = 0; i < keys.length; i++) {
            const item = {};
            item[keys[i]] = filters[keys[i]];
            result.push(item);
        }
        return result;
    }
    buildFilter() {
        const dateParse = ds => /\d+-\d+-\d+T\d+:\d+:\d+.\d+Z/.test(ds) ? datemath_1.default.parse(ds).toDate().getTime() : ds;
        const { searchBarFilters } = this.state;
        const { query } = this.state;
        const { hideManagerAlerts } = this.wazuhConfig.getConfig();
        const extraFilters = [];
        if (hideManagerAlerts)
            extraFilters.push({
                meta: {
                    alias: null,
                    disabled: false,
                    key: 'agent.id',
                    negate: true,
                    params: { query: '000' },
                    type: 'phrase',
                    index: this.indexPattern.title
                },
                query: { match_phrase: { 'agent.id': '000' } },
                $state: { store: 'appState' }
            });
        const shareFilterManager = this.props.shareFilterManager || [];
        const elasticQuery = common_1.buildEsQuery(undefined, query, [...searchBarFilters, ...extraFilters, ...shareFilterManager], common_1.getEsQueryConfig(new_platform_1.npSetup.core.uiSettings));
        const { sortField, sortDirection } = this.state;
        const range = {
            range: {
                timestamp: {
                    gte: dateParse(this.timefilter.getTime().from),
                    lte: dateParse(this.timefilter.getTime().to),
                    format: 'epoch_millis'
                }
            }
        };
        elasticQuery.bool.must.push(range);
        if (this.props.implicitFilters) {
            this.props.implicitFilters.map(impicitFilter => elasticQuery.bool.must.push({
                match: impicitFilter
            }));
        }
        ;
        if (this.props.currentAgentData.id) {
            elasticQuery.bool.must.push({
                match: { "agent.id": this.props.currentAgentData.id }
            });
        }
        ;
        return {
            query: elasticQuery,
            size: this.state.pageSize,
            from: this.state.pageIndex * this.state.pageSize,
            ...(sortField ? { sort: { [sortField]: { "order": sortDirection } } } : {})
        };
    }
    async getAlerts() {
        if (!this.indexPattern || this.state.isLoading)
            return;
        //compare filters so we only make a request into Elasticsearch if needed
        const newFilters = this.buildFilter();
        try {
            this.setState({ isLoading: true });
            const alerts = await generic_request_1.GenericRequest.request('POST', `/elastic/esAlerts`, {
                index: app_state_1.AppState.getCurrentPattern(),
                body: newFilters
            });
            if (this._isMount) {
                this.setState({ alerts: alerts.data.hits.hits, total: alerts.data.hits.total.value, isLoading: false, requestFilters: newFilters, filters: newFilters.filters });
                this.props.updateTotalHits(alerts.data.hits.total.value);
            }
        }
        catch (err) {
            if (this._isMount) {
                this.setState({ alerts: [], total: 0, isLoading: false, requestFilters: newFilters, filters: newFilters.filters });
                this.props.updateTotalHits(0);
            }
        }
    }
    removeColumn(id) {
        if (this.state.columns.length < 2) {
            this.showToast('warning', "At least one column must be selected", 3000);
            return;
        }
        const columns = this.state.columns;
        columns.splice(columns.findIndex(v => v === id), 1);
        this.setState(columns);
    }
    addColumn(id) {
        if (this.state.columns.length > 11) {
            this.showToast('warning', 'The maximum number of columns is 10', 3000);
            return;
        }
        if (this.state.columns.find(element => element === id)) {
            this.removeColumn(id);
            return;
        }
        const columns = this.state.columns;
        columns.push(id);
        this.setState(columns);
    }
    getFiltersAsObject(filters) {
        var result = {};
        for (var i = 0; i < filters.length; i++) {
            result = { ...result, ...filters[i] };
        }
        return result;
    }
    /**
    * Adds a new negated filter with format { "filter_key" : "filter_value" }, e.g. {"agent.id": "001"}
    * @param filter
    */
    addFilterOut(filter) {
        const key = Object.keys(filter)[0];
        const value = filter[key];
        const valuesArray = Array.isArray(value) ? [...value] : [value];
        const filters = this.state.searchBarFilters;
        valuesArray.map((item) => {
            const formattedFilter = common_1.buildPhraseFilter({ name: key, type: "string" }, item, this.indexPattern);
            formattedFilter.meta.negate = true;
            filters.push(formattedFilter);
        });
        this.filterManager.setFilters(filters);
        if (!this.props.shareFilterManager)
            this.setState({ searchBarFilters: filters });
    }
    /**
     * Adds a new filter with format { "filter_key" : "filter_value" }, e.g. {"agent.id": "001"}
     * @param filter
     */
    addFilter(filter) {
        const key = Object.keys(filter)[0];
        const value = filter[key];
        const valuesArray = Array.isArray(value) ? [...value] : [value];
        const filters = []; //this.state.searchBarFilters;
        valuesArray.map((item) => {
            const formattedFilter = common_1.buildPhraseFilter({ name: key, type: "string" }, item, this.indexPattern);
            if (formattedFilter.meta.key === 'manager.name' || formattedFilter.meta.key === 'cluster.name') {
                formattedFilter.meta["removable"] = false;
            }
            filters.push(formattedFilter);
        });
        this.filterManager.addFilters(filters);
        if (!this.props.shareFilterManager)
            this.setState({ searchBarFilters: filters });
    }
    openDiscover(e, techniqueID) {
        app_navigate_1.AppNavigate.navigateToModule(e, 'overview', { "tab": 'mitre', "tabView": "discover", filters: { 'rule.mitre.id': techniqueID } });
    }
    openDashboard(e, techniqueID) {
        app_navigate_1.AppNavigate.navigateToModule(e, 'overview', { "tab": 'mitre', "tabView": "dashboard", filters: { 'rule.mitre.id': techniqueID } });
    }
    render() {
        if (this.state.isLoading)
            return (react_1.default.createElement("div", { style: { alignSelf: "center", minHeight: 400 } },
                react_1.default.createElement(eui_1.EuiLoadingContent, { lines: 3 }),
                " "));
        const { total, itemIdToExpandedRowMap, } = this.state;
        const { query = this.state.query } = this.props;
        const getRowProps = item => {
            const { _id } = item;
            return {
                'data-test-subj': `row-${_id}`,
                className: 'customRowClass',
                onClick: () => this.toggleDetails(item),
            };
        };
        const columns = this.columns();
        const sorting = {
            sort: {
                //@ts-ignore
                field: this.state.sortField,
                direction: this.state.sortDirection,
            }
        };
        const pagination = {
            pageIndex: this.state.pageIndex,
            pageSize: this.state.pageSize,
            totalItemCount: this.state.total > 10000 ? 10000 : this.state.total,
            pageSizeOptions: [10, 25, 50],
        };
        const noResultsText = `No results match for this search criteria`;
        let flyout = this.state.showMitreFlyout ? react_1.default.createElement(eui_1.EuiOverlayMask, { headerZindexLocation: "below", onClick: this.closeMitreFlyout },
            react_1.default.createElement(flyout_technique_1.FlyoutTechnique, { openDashboard: (e, itemId) => this.openDashboard(e, itemId), openDiscover: (e, itemId) => this.openDiscover(e, itemId), onChangeFlyout: this.onMitreChangeFlyout, currentTechnique: this.state.selectedTechnique })) : react_1.default.createElement(react_1.default.Fragment, null);
        return (react_1.default.createElement("div", { className: 'wz-discover hide-filter-control' },
            !this.props.shareFilterManager && react_1.default.createElement(kbn_search_bar_1.KbnSearchBar, { indexPattern: this.indexPattern, filterManager: this.filterManager, onQuerySubmit: this.onQuerySubmit, onFiltersUpdated: this.onFiltersUpdated, query: query }),
            total
                ? react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null, this.state.alerts.length && (react_1.default.createElement(eui_1.EuiBasicTable, { items: this.state.alerts.map(alert => ({ ...alert._source, _id: alert._id })), className: "module-discover-table", itemId: "_id", itemIdToExpandedRowMap: itemIdToExpandedRowMap, isExpandable: true, columns: columns, rowProps: getRowProps, pagination: pagination, sorting: sorting, onChange: this.onTableChange }))))
                : react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                        react_1.default.createElement(eui_1.EuiCallOut, { title: noResultsText, color: "warning", iconType: "alert" }))),
            flyout));
    }
});
