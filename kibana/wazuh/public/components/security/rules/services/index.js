"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_rules_service_1 = __importDefault(require("./get-rules.service"));
const create_rule_service_1 = __importDefault(require("./create-rule.service"));
const delete_rules_service_1 = __importDefault(require("./delete-rules.service"));
const update_rule_service_1 = __importDefault(require("./update-rule.service"));
exports.default = {
    GetRules: get_rules_service_1.default,
    CreateRule: create_rule_service_1.default,
    DeleteRules: delete_rules_service_1.default,
    UpdateRule: update_rule_service_1.default,
};
