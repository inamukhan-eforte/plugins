"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceText = void 0;
const react_1 = __importDefault(require("react"));
const eui_1 = require("@elastic/eui");
exports.ComplianceText = ({ complianceText }) => {
    const complianceList = complianceText.split("\n");
    //@ts-ignore
    const listItems = complianceList.map(item => /(?<title>\S+): (?<description>.+)/.exec(item)?.groups).filter(item => !!item);
    return (react_1.default.createElement(eui_1.EuiFlexGroup, { direction: "column", gutterSize: "xs" }, listItems.map((item, idx) => react_1.default.createElement(ComplianceItem, { key: idx, item: item }))));
};
const ComplianceItem = ({ item }) => {
    return (react_1.default.createElement(eui_1.EuiFlexItem, null,
        react_1.default.createElement("p", null,
            react_1.default.createElement("strong", null,
                item.title,
                ": "),
            " ",
            item.description)));
};
