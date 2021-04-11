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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryMetrics = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const lodash_1 = __importDefault(require("lodash"));
const useGenericRequest_1 = require("../../../common/hooks/useGenericRequest");
const time_service_1 = require("../../../../react-services/time-service");
function InventoryMetrics({ agent }) {
    const [params, setParams] = react_1.useState({});
    const offsetTimestamp = (text, time) => {
        try {
            return text + time_service_1.TimeService.offset(time);
        }
        catch (error) {
            return time !== '-' ? `${text}${time} (UTC)` : time;
        }
    };
    const syscollector = useGenericRequest_1.useGenericRequest('GET', `/api/syscollector/${agent.id}`, params, (result) => { return (result || {}).data || {}; });
    if (!syscollector.isLoading &&
        (lodash_1.default.isEmpty(syscollector.data.hardware) || lodash_1.default.isEmpty(syscollector.data.os))) {
        return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s", style: { margin: 16, textAlign: 'center' } },
            react_1.default.createElement(eui_1.EuiIcon, { type: "iInCircle" }),
            " Not enough hardware or operating system information"));
    }
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s", style: { margin: 16 } },
        react_1.default.createElement(eui_1.EuiFlexGroup, null,
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiText, null,
                    "Cores: ",
                    syscollector.isLoading ? react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "s" }) : react_1.default.createElement("strong", null, syscollector.data.hardware.cpu.cores))),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiText, null,
                    "Memory: ",
                    syscollector.isLoading ? react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "s" }) : react_1.default.createElement("strong", null,
                        (syscollector.data.hardware.ram.total / 1024).toFixed(2),
                        " MB"))),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiText, null,
                    "Arch: ",
                    syscollector.isLoading ? react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "s" }) : react_1.default.createElement("strong", null, syscollector.data.os.architecture))),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiText, null,
                    "OS: ",
                    syscollector.isLoading ? react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "s" }) : react_1.default.createElement("strong", null,
                        syscollector.data.os.os.name,
                        " ",
                        syscollector.data.os.os.version))),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: true },
                react_1.default.createElement(eui_1.EuiText, null,
                    "CPU: ",
                    syscollector.isLoading ? react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "s" }) : react_1.default.createElement("strong", null, syscollector.data.hardware.cpu.name))),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiText, null,
                    "Last scan: ",
                    syscollector.isLoading ? react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "s" }) : react_1.default.createElement("strong", null, offsetTimestamp('', syscollector.data.os.scan.time)))))));
}
exports.InventoryMetrics = InventoryMetrics;
