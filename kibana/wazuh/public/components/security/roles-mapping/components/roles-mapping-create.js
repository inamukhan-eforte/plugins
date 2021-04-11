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
exports.RolesMappingCreate = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const error_handler_1 = require("../../../../react-services/error-handler");
const rule_editor_1 = require("./rule-editor");
const services_1 = __importDefault(require("../../rules/services"));
const services_2 = __importDefault(require("../../roles/services"));
exports.RolesMappingCreate = ({ closeFlyout, rolesEquivalences, roles, internalUsers, onSave, currentPlatform, }) => {
    const [selectedRoles, setSelectedRoles] = react_1.useState([]);
    const [ruleName, setRuleName] = react_1.useState('');
    const [isLoading, setIsLoading] = react_1.useState(false);
    const getRolesList = roles => {
        const list = roles.map(item => {
            return { label: rolesEquivalences[item.id], id: item.id };
        });
        return list;
    };
    const createRule = async (toSaveRule) => {
        try {
            setIsLoading(true);
            const formattedRoles = selectedRoles.map(item => {
                return item.id;
            });
            const newRule = await services_1.default.CreateRule({
                name: ruleName,
                rule: toSaveRule,
            });
            await Promise.all(formattedRoles.map(async (role) => await services_2.default.AddRoleRules(role, [newRule.id])));
            error_handler_1.ErrorHandler.info('Role mapping was successfully created');
        }
        catch (error) {
            error_handler_1.ErrorHandler.handle(error, 'There was an error');
        }
        onSave();
        closeFlyout(false);
    };
    return (react_1.default.createElement(eui_1.EuiFlyout, { onClose: () => closeFlyout(false) },
        react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: false },
            react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                react_1.default.createElement("h2", null, "Create new role mapping \u00A0"))),
        react_1.default.createElement(eui_1.EuiFlyoutBody, null,
            react_1.default.createElement(eui_1.EuiForm, { component: "form", style: { padding: 24 } },
                react_1.default.createElement(eui_1.EuiFormRow, { label: "Role mapping name", isInvalid: false, error: 'Please provide a role mapping name', helpText: "Introduce a name for this role mapping." },
                    react_1.default.createElement(eui_1.EuiFieldText, { placeholder: "Role name", value: ruleName, onChange: e => setRuleName(e.target.value) })),
                react_1.default.createElement(eui_1.EuiFormRow, { label: "Roles", isInvalid: false, error: 'At least one role must be selected.', helpText: "Assign roles to your users." },
                    react_1.default.createElement(eui_1.EuiComboBox, { placeholder: "Select roles", options: getRolesList(roles), isDisabled: false, selectedOptions: selectedRoles, onChange: roles => {
                            setSelectedRoles(roles);
                        }, isClearable: true, "data-test-subj": "demoComboBox" })),
                react_1.default.createElement(eui_1.EuiSpacer, null)),
            react_1.default.createElement(eui_1.EuiFlexGroup, { style: { padding: '0px 24px 24px 24px' } },
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(rule_editor_1.RuleEditor, { save: rule => createRule(rule), initialRule: false, isReserved: false, isLoading: isLoading, internalUsers: internalUsers, currentPlatform: currentPlatform }))))));
};
