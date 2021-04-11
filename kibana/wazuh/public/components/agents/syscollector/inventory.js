"use strict";
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
exports.SyscollectorInventory = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const syscollector_metrics_1 = require("./components/syscollector-metrics");
const syscollector_table_1 = require("./components/syscollector-table");
const columns_1 = require("./columns");
function SyscollectorInventory({ agent }) {
    if (agent && agent.status === 'never_connected') {
        return (react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "securitySignalDetected", style: { marginTop: 20 }, title: react_1.default.createElement("h2", null, "Agent has never connected."), body: react_1.default.createElement(react_1.Fragment, null,
                react_1.default.createElement("p", null, "The agent has been registered but has not yet connected to the manager."),
                react_1.default.createElement("a", { href: "https://documentation.wazuh.com/current/user-manual/agents/agent-connection.html", target: "_blank" }, "https://documentation.wazuh.com/current/user-manual/agents/agent-connection.html")), actions: react_1.default.createElement(eui_1.EuiButton, { href: '#/agents-preview?', color: "primary", fill: true }, "Back") }));
    }
    let soPlatform;
    if (((agent.os || {}).uname || '').includes('Linux')) {
        soPlatform = 'linux';
    }
    else if ((agent.os || {}).platform === 'windows') {
        soPlatform = 'windows';
    }
    else if ((agent.os || {}).platform === 'darwin') {
        soPlatform = 'apple';
    }
    console.log('Probando', soPlatform);
    const netifaceColumns = [{ id: "name" }, { id: "mac" }, { id: "state", value: "State" }, { id: "mtu", value: "MTU" }, { id: "type", value: "Type" }];
    const netaddrColumns = [{ id: 'iface' }, { id: 'address' }, { id: 'netmask' }, { id: 'proto' }, { id: 'broadcast' }];
    return (react_1.default.createElement("div", { style: { overflow: 'hidden' } },
        agent && agent.status === 'disconnected' &&
            react_1.default.createElement(eui_1.EuiCallOut, { style: { margin: "8px 16px 8px 16px" }, title: "This agent is currently disconnected, the data may be outdated.", iconType: "iInCircle" }),
        react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "s" },
            react_1.default.createElement(eui_1.EuiFlexItem, { style: { marginBottom: 0 } },
                react_1.default.createElement(syscollector_metrics_1.InventoryMetrics, { agent: agent }))),
        react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "s" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: 2, style: { marginRight: 4, marginTop: 0 } },
                react_1.default.createElement(syscollector_table_1.SyscollectorTable, { tableParams: { path: `/syscollector/${agent.id}/netiface`, title: "Network interfaces", columns: netifaceColumns, icon: "indexMapping", searchBar: false, exportFormatted: false } })),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: 2, style: { marginLeft: 4, marginTop: 0 } },
                react_1.default.createElement(syscollector_table_1.SyscollectorTable, { tableParams: { path: `/syscollector/${agent.id}/ports`, title: "Network ports", columns: columns_1.portsColumns[soPlatform], icon: "inputOutput", searchBar: false, exportFormatted: false } }))),
        react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "s" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: 3, style: { marginRight: 4 } },
                react_1.default.createElement(syscollector_table_1.SyscollectorTable, { tableParams: { path: `/syscollector/${agent.id}/netaddr`, title: "Network settings", columns: netaddrColumns, icon: "controlsHorizontal", searchBar: false, exportFormatted: false } })),
            agent && agent.os && agent.os.platform === 'windows' &&
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: 1, style: { marginLeft: 4 } },
                    react_1.default.createElement(syscollector_table_1.SyscollectorTable, { tableParams: { path: `/syscollector/${agent.id}/hotfixes`, title: "Windows updates", columns: [{ id: 'hotfix' }], icon: "logoWindows", searchBar: false, exportFormatted: false } }))),
        react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "s" },
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(syscollector_table_1.SyscollectorTable, { tableParams: { path: `/syscollector/${agent.id}/packages`, hasTotal: true, title: "Packages", columns: columns_1.packagesColumns[soPlatform], icon: "apps", searchBar: true, exportFormatted: 'packages.csv' } }))),
        react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "s" },
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(syscollector_table_1.SyscollectorTable, { tableParams: { path: `/syscollector/${agent.id}/processes`, hasTotal: true, title: "Processes", columns: columns_1.processColumns[soPlatform], icon: "console", searchBar: true, exportFormatted: 'processes.csv' } })))));
}
exports.SyscollectorInventory = SyscollectorInventory;
