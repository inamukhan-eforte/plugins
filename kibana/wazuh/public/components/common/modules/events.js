"use strict";
/*
 * Wazuh app - Integrity monitoring components
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
exports.Events = void 0;
const react_1 = __importStar(require("react"));
const kibana_services_1 = require("../../../../../../src/plugins/discover/public/kibana_services");
const events_selected_fields_1 = require("./events-selected-fields");
const modules_helper_1 = require("./modules-helper");
const store_1 = __importDefault(require("../../../redux/store"));
const notify_1 = require("ui/notify");
const eui_1 = require("@elastic/eui");
const pattern_handler_1 = require("../../../react-services/pattern-handler");
const events_enhance_discover_fields_1 = require("./events-enhance-discover-fields");
class Events extends react_1.Component {
    constructor(props) {
        super(props);
        this.intervalCheckExistsDiscoverTableTime = 200;
        this.enhanceDiscoverTableAddObservers = (options) => {
            // Scrolling table observer, when load more events
            this.discoverTableRowsObserver = new MutationObserver((mutationsList) => {
                mutationsList.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes[0]) {
                        this.enhanceDiscoverTableScrolling(mutation.addedNodes[0], this.state.discoverRowsData, options);
                    }
                    ;
                });
            });
            const discoverTableTBody = document.querySelector('.kbn-table tbody');
            this.discoverTableRowsObserver.observe(discoverTableTBody, { childList: true });
            // Add observer when add or remove table header column
            this.discoverTableColumnsObserver = new MutationObserver((mutationsList) => {
                mutationsList.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        this.enhanceDiscoverTableCurrentRows(this.state.discoverRowsData, options);
                    }
                });
            });
            const discoverTableTHead = document.querySelector('.kbn-table thead tr');
            this.discoverTableColumnsObserver.observe(discoverTableTHead, { childList: true });
        };
        this.enhanceDiscoverTableCurrentRows = (discoverRowsData, options, addObserverDetails = false) => {
            // Get table headers
            const discoverTableHeaders = document.querySelectorAll(`.kbn-table thead th`);
            // Get table rows
            const discoverTableRows = document.querySelectorAll(`.kbn-table tbody tr.kbnDocTable__row`);
            discoverTableRows.forEach((row, rowIndex) => {
                // Enhance each cell of table rows
                discoverTableHeaders.forEach((header, headerIndex) => {
                    const cell = row.querySelector(`td:nth-child(${headerIndex + 1}) div`);
                    if (cell) {
                        events_enhance_discover_fields_1.enhanceDiscoverEventsCell(header.textContent, cell.textContent, discoverRowsData[rowIndex], cell, options);
                    }
                    ;
                });
                // Add observer to row details 
                if (addObserverDetails) {
                    const rowDetails = row.nextElementSibling;
                    this.enhanceDiscoverTableRowDetailsAddObserver(rowDetails, discoverRowsData, options);
                }
                ;
            });
        };
        this.refreshKnownFields = async () => {
            if (!this.state.hasRefreshedKnownFields) {
                try {
                    this.setState({ hasRefreshedKnownFields: true, isRefreshing: true });
                    await pattern_handler_1.PatternHandler.refreshIndexPattern();
                    this.setState({ isRefreshing: false });
                    this.reloadToast();
                }
                catch (err) {
                    this.setState({ isRefreshing: false });
                    this.errorToast(err);
                }
            }
            else if (this.state.isRefreshing) {
                await new Promise(r => setTimeout(r, 150));
                await this.refreshKnownFields();
            }
        };
        this.enhanceDiscoverTableScrolling = (mutationElement, discoverRowsData, options) => {
            // Get table headers
            const discoverTableHeaders = document.querySelectorAll(`.kbn-table thead th`);
            // Get table rows
            const discoverTableRows = document.querySelectorAll(`.kbn-table tbody tr.kbnDocTable__row`);
            try {
                const rowIndex = Array.from(discoverTableRows).indexOf(mutationElement);
                if (rowIndex !== -1) {
                    // It is a discover table row
                    discoverTableHeaders.forEach((header, headerIndex) => {
                        const cell = mutationElement.querySelector(`td:nth-child(${headerIndex + 1}) div`);
                        if (!cell) {
                            return;
                        }
                        ;
                        events_enhance_discover_fields_1.enhanceDiscoverEventsCell(header.textContent, cell.textContent, discoverRowsData[rowIndex], cell, options);
                    });
                }
                else {
                    // It is a details table row
                    this.enhanceDiscoverTableRowDetailsAddObserver(mutationElement, discoverRowsData, options);
                }
            }
            catch (error) { }
            ;
        };
        this.setFlyout = (flyout) => {
            this.setState({ flyout });
        };
        this.closeFlyout = () => {
            this.setState({ flyout: false });
        };
        this.reloadToast = () => {
            notify_1.toastNotifications.add({
                color: 'success',
                title: 'The index pattern was refreshed successfully.',
                text: react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "flexEnd", gutterSize: "s" },
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, "There were some unknown fields for the current index pattern. You need to refresh the page to apply the changes."),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiButton, { onClick: () => window.location.reload(), size: "s" }, "Reload page")))
            });
        };
        this.errorToast = (error) => {
            notify_1.toastNotifications.add({
                color: 'danger',
                title: 'The index pattern could not be refreshed.',
                text: 'There are some unknown fields for the current index pattern. The index pattern fields need to be refreshed.'
            });
        };
        this.isMount = true;
        this.state = {
            flyout: false,
            discoverRowsData: [],
            hasRefreshedKnownFields: false,
            isRefreshing: false,
        };
    }
    async componentDidMount() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        const app = kibana_services_1.getAngularModule('app/wazuh');
        this.$rootScope = app.$injector.get('$rootScope');
        this.$rootScope.showModuleEvents = this.props.section;
        const scope = await modules_helper_1.ModulesHelper.getDiscoverScope();
        if (this.isMount) {
            this.$rootScope.moduleDiscoverReady = true;
            this.$rootScope.$applyAsync();
            const fields = [...events_selected_fields_1.EventsSelectedFiles[this.props.section]];
            const index = fields.indexOf('agent.name');
            if (index > -1 && store_1.default.getState().appStateReducers.currentAgentData.id) { //if an agent is pinned we don't show the agent.name column
                fields.splice(index, 1);
            }
            if (fields) {
                scope.state.columns = fields;
                scope.addColumn(false);
                scope.removeColumn(false);
            }
            this.fetchWatch = scope.$watchCollection('fetchStatus', (fetchStatus) => {
                if (scope.fetchStatus === 'complete') {
                    setTimeout(() => {
                        modules_helper_1.ModulesHelper.cleanAvailableFields();
                    }, 1000);
                    // Check the discover table is in the DOM and enhance the initial table cells
                    this.intervalCheckExistsDiscoverTable = setInterval(() => {
                        const discoverTableTBody = document.querySelector('.kbn-table tbody');
                        if (discoverTableTBody) {
                            const options = { setFlyout: this.setFlyout, closeFlyout: this.closeFlyout };
                            this.enhanceDiscoverTableCurrentRows(this.state.discoverRowsData, options, true);
                            this.enhanceDiscoverTableAddObservers(options);
                            clearInterval(this.intervalCheckExistsDiscoverTable);
                        }
                    }, this.intervalCheckExistsDiscoverTableTime);
                }
                this.setState({ discoverRowsData: scope.rows });
            });
        }
    }
    componentWillUnmount() {
        this.isMount = false;
        if (this.fetchWatch)
            this.fetchWatch();
        this.$rootScope.showModuleEvents = false;
        this.$rootScope.moduleDiscoverReady = false;
        this.$rootScope.$applyAsync();
        this.discoverTableRowsObserver && this.discoverTableRowsObserver.disconnect();
        this.discoverTableColumnsObserver && this.discoverTableColumnsObserver.disconnect();
        this.intervalCheckExistsDiscoverTableTime && clearInterval(this.intervalCheckExistsDiscoverTable);
    }
    checkDiscoverTableDetailsMutation(element, mutation, discoverRowsData, options) {
        const rowTable = element.previousElementSibling;
        const discoverTableRows = document.querySelectorAll(`.kbn-table tbody tr.kbnDocTable__row`);
        const rowIndex = Array.from(discoverTableRows).indexOf(rowTable);
        const rowDetailsFields = mutation.addedNodes[0].querySelectorAll('.kbnDocViewer__field');
        if (rowDetailsFields) {
            rowDetailsFields.forEach((rowDetailField) => {
                this.checkUnknownFields(rowDetailField);
                const fieldName = rowDetailField.childNodes[0].childNodes[1].textContent || "";
                const fieldCell = rowDetailField.parentNode.childNodes && rowDetailField.parentNode.childNodes[2].childNodes[0];
                if (!fieldCell) {
                    return;
                }
                ;
                events_enhance_discover_fields_1.enhanceDiscoverEventsCell(fieldName, (fieldCell || {}).textContent || '', discoverRowsData[rowIndex], fieldCell, options);
            });
        }
        ;
    }
    checkUnknownFields(rowDetailField) {
        const fieldCell = rowDetailField.parentNode.childNodes && rowDetailField.parentNode.childNodes[2];
        if (fieldCell.querySelector('svg[data-test-subj="noMappingWarning"]')) {
            this.refreshKnownFields();
        }
    }
    enhanceDiscoverTableRowDetailsAddObserver(element, discoverRowsData, options) {
        // Open for first time the row details
        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes[0]) {
                    this.checkDiscoverTableDetailsMutation(element, mutation, discoverRowsData, options);
                    // Add observer when switch between the tabs of Table and JSON
                    (new MutationObserver(mutationList => {
                        if (mutation.addedNodes[0].querySelector('div[role=tabpanel]').getAttribute('aria-labelledby') === 'kbn_doc_viewer_tab_0') {
                            this.checkDiscoverTableDetailsMutation(element, mutation, discoverRowsData, options);
                        }
                    })).observe(mutation.addedNodes[0].querySelector('div[role=tabpanel]'), { attributes: true });
                }
            });
        });
        observer.observe(element, { childList: true });
    }
    render() {
        const { flyout } = this.state;
        const FlyoutComponent = (flyout || {}).component;
        return (react_1.default.createElement(react_1.Fragment, null, flyout && (react_1.default.createElement(eui_1.EuiOverlayMask, { headerZindexLocation: "below", 
            // @ts-ignore
            onClick: () => { this.closeFlyout(); } },
            react_1.default.createElement(FlyoutComponent, Object.assign({ closeFlyout: this.closeFlyout }, this.state.flyout.props, this.props))))));
    }
}
exports.Events = Events;
