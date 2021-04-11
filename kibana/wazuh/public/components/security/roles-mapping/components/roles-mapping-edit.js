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
exports.RolesMappingEdit = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const error_handler_1 = require("../../../../react-services/error-handler");
const rule_editor_1 = require("./rule-editor");
const services_1 = __importDefault(require("../../rules/services"));
const services_2 = __importDefault(require("../../roles/services"));
const wz_api_utils_1 = require("../../../../react-services/wz-api-utils");
exports.RolesMappingEdit = ({ rule, closeFlyout, rolesEquivalences, roles, internalUsers, onSave, currentPlatform, }) => {
    const getEquivalences = roles => {
        const list = roles.map(item => {
            return { label: rolesEquivalences[item], id: item };
        });
        return list;
    };
    const [selectedRoles, setSelectedRoles] = react_1.useState(getEquivalences(rule.roles));
    const [ruleName, setRuleName] = react_1.useState(rule.name);
    const [isLoading, setIsLoading] = react_1.useState(false);
    const getRolesList = roles => {
        const list = roles.map(item => {
            return { label: rolesEquivalences[item.id], id: item.id };
        });
        return list;
    };
    const editRule = async (toSaveRule) => {
        try {
            setIsLoading(true);
            const formattedRoles = selectedRoles.map(item => {
                return item.id;
            });
            await services_1.default.UpdateRule(rule.id, {
                name: ruleName,
                rule: toSaveRule,
            });
            const toAdd = formattedRoles.filter(value => !rule.roles.includes(value));
            const toRemove = rule.roles.filter(value => !formattedRoles.includes(value));
            await Promise.all(toAdd.map(async (role) => {
                return services_2.default.AddRoleRules(role, [rule.id]);
            }));
            await Promise.all(toRemove.map(async (role) => {
                return services_2.default.RemoveRoleRules(role, [rule.id]);
            }));
            error_handler_1.ErrorHandler.info('Role mapping was successfully updated');
        }
        catch (error) {
            error_handler_1.ErrorHandler.handle(error, 'There was an error');
        }
        onSave();
        setIsLoading(false);
        closeFlyout(false);
    };
    return (react_1.default.createElement(eui_1.EuiFlyout, { onClose: () => closeFlyout(false) },
        react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: false },
            react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                react_1.default.createElement("h2", null,
                    "Edit ",
                    react_1.default.createElement("strong", null,
                        rule.name,
                        "\u00A0\u00A0"),
                    wz_api_utils_1.WzAPIUtils.isReservedID(rule.id) && react_1.default.createElement(eui_1.EuiBadge, { color: "primary" }, "Reserved")))),
        react_1.default.createElement(eui_1.EuiFlyoutBody, null,
            react_1.default.createElement(eui_1.EuiForm, { component: "form", style: { padding: 24 } },
                react_1.default.createElement(eui_1.EuiFormRow, { label: "Role name", isInvalid: false, error: 'Please provide a role name', helpText: "Introduce a name for this role mapping." },
                    react_1.default.createElement(eui_1.EuiFieldText, { placeholder: "", disabled: wz_api_utils_1.WzAPIUtils.isReservedID(rule.id), value: ruleName, onChange: e => setRuleName(e.target.value), "aria-label": "" })),
                react_1.default.createElement(eui_1.EuiFormRow, { label: "Roles", isInvalid: false, error: 'At least one role must be selected.', helpText: "Assign roles to your users." },
                    react_1.default.createElement(eui_1.EuiComboBox, { placeholder: "Select roles", options: getRolesList(roles), isDisabled: wz_api_utils_1.WzAPIUtils.isReservedID(rule.id), selectedOptions: selectedRoles, onChange: roles => {
                            setSelectedRoles(roles);
                        }, isClearable: true, "data-test-subj": "demoComboBox" })),
                react_1.default.createElement(eui_1.EuiSpacer, null)),
            react_1.default.createElement(eui_1.EuiFlexGroup, { style: { padding: '0px 24px 24px 24px' } },
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(rule_editor_1.RuleEditor, { save: rule => editRule(rule), initialRule: rule.rule, isLoading: isLoading, isReserved: wz_api_utils_1.WzAPIUtils.isReservedID(rule.id), internalUsers: internalUsers, currentPlatform: currentPlatform }))))));
};
