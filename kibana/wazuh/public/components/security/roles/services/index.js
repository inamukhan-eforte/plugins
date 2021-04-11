"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_roles_service_1 = __importDefault(require("./get-roles.service"));
const add_role_rules_service_1 = __importDefault(require("./add-role-rules.service"));
const remove_role_rules_service_1 = __importDefault(require("./remove-role-rules.service"));
exports.default = {
    GetRoles: get_roles_service_1.default,
    AddRoleRules: add_role_rules_service_1.default,
    RemoveRoleRules: remove_role_rules_service_1.default,
};
