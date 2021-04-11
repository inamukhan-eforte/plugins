"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleText = void 0;
const react_1 = __importDefault(require("react"));
const eui_1 = require("@elastic/eui");
exports.RuleText = ({ rulesText }) => {
    const splitRulesText = rulesText.split(' -> ');
    return (react_1.default.createElement(eui_1.EuiText, { size: "s" },
        react_1.default.createElement("ul", null, splitRulesText.map((text, idx) => react_1.default.createElement("li", { key: idx }, text)))));
};
