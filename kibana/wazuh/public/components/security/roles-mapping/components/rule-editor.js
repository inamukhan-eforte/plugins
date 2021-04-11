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
exports.RuleEditor = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const rule_editor_helper_1 = require("../helpers/rule-editor.helper");
const constants_1 = require("../../../../../util/constants");
exports.RuleEditor = ({ save, initialRule, isLoading, isReserved, internalUsers, currentPlatform }) => {
    const [logicalOperator, setLogicalOperator] = react_1.useState('OR');
    const [isLogicalPopoverOpen, setIsLogicalPopoverOpen] = react_1.useState(false);
    const [isJsonEditor, setIsJsonEditor] = react_1.useState(false);
    const [ruleJson, setRuleJson] = react_1.useState('{\n\t\n}');
    const [hasWrongFormat, setHasWrongFormat] = react_1.useState(false);
    const [rules, setRules] = react_1.useState([]);
    const [internalUserRules, setInternalUserRules] = react_1.useState([]);
    const [internalUsersOptions, setInternalUsersOptions] = react_1.useState([]);
    const [selectedUsers, setSelectedUsers] = react_1.useState([]);
    const searchOperationOptions = [
        { value: 'FIND', text: 'FIND' },
        { value: 'FIND$', text: 'FIND$' },
        { value: 'MATCH', text: 'MATCH' },
        { value: 'MATCH$', text: 'MATCH$' },
    ];
    const default_user_field = currentPlatform === constants_1.WAZUH_SECURITY_PLUGIN_OPEN_DISTRO_FOR_ELASTICSEARCH ? 'user_name' : 'username';
    const default_rule = { user_field: default_user_field, searchOperation: 'FIND', value: 'wazuh' };
    react_1.useEffect(() => {
        if (initialRule) {
            setStateFromRule(JSON.stringify(initialRule));
        }
    }, []);
    react_1.useEffect(() => {
        if (internalUsers.length) {
            const users = internalUsers.map(user => ({ label: user.user, id: user.user }));
            setInternalUsersOptions(users);
        }
    }, [internalUsers]);
    const setStateFromRule = jsonRule => {
        const rulesResult = getRulesFromJson(jsonRule);
        if (!rulesResult.wrongFormat) {
            setRules(rulesResult.customRules);
            setInternalUserRules(rulesResult.internalUsersRules);
            const _selectedUsers = rule_editor_helper_1.getSelectedUsersFromRules(rulesResult.internalUsersRules);
            setSelectedUsers(_selectedUsers);
            setIsJsonEditor(false);
        }
        else {
            setRuleJson(JSON.stringify(JSON.parse(jsonRule), undefined, 2));
            setIsJsonEditor(true);
        }
    };
    const onButtonClick = () => setIsLogicalPopoverOpen(isLogicalPopoverOpen => !isLogicalPopoverOpen);
    const closeLogicalPopover = () => setIsLogicalPopoverOpen(false);
    const selectOperator = op => {
        setLogicalOperator(op);
        closeLogicalPopover();
    };
    const onSelectorChange = (e, idx) => {
        const rulesTmp = [...rules];
        rulesTmp[idx].searchOperation = e.target.value;
        setRules(rulesTmp);
    };
    const updateUserField = (e, idx) => {
        const rulesTmp = [...rules];
        rulesTmp[idx].user_field = e.target.value;
        setRules(rulesTmp);
    };
    const updateValueField = (e, idx) => {
        const rulesTmp = [...rules];
        rulesTmp[idx].value = e.target.value;
        setRules(rulesTmp);
    };
    const removeRule = id => {
        const rulesTmp = [...rules];
        rulesTmp.splice(id, 1);
        setRules(rulesTmp);
    };
    const getRulesFromJson = jsonRule => {
        const { customRules, internalUsersRules, wrongFormat, logicalOperator } = rule_editor_helper_1.decodeJsonRule(jsonRule, internalUsers);
        setLogicalOperator(logicalOperator);
        setHasWrongFormat(wrongFormat);
        return { customRules, internalUsersRules, wrongFormat, logicalOperator };
    };
    const printRules = () => {
        const rulesList = rules.map((item, idx) => {
            return (react_1.default.createElement(react_1.Fragment, { key: `rule_${idx}` },
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(eui_1.EuiFormRow, { label: "User field" },
                            react_1.default.createElement(eui_1.EuiFieldText, { disabled: isLoading || isReserved, placeholder: "", value: item.user_field, onChange: e => updateUserField(e, idx), "aria-label": "" }))),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiFormRow, { label: "Search operation" },
                            react_1.default.createElement(eui_1.EuiSelect, { disabled: isLoading || isReserved, id: "selectDocExample", options: searchOperationOptions, value: item.searchOperation, onChange: e => onSelectorChange(e, idx), "aria-label": "Use aria labels when no actual label is in use" }))),
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(eui_1.EuiFormRow, { label: "Value" },
                            react_1.default.createElement(eui_1.EuiFieldText, { disabled: isLoading || isReserved, placeholder: "", value: item.value, onChange: e => updateValueField(e, idx), "aria-label": "" }))),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiButtonIcon, { style: { marginTop: 25 }, onClick: () => removeRule(idx), iconType: "trash", color: "danger", "aria-label": "Remove rule" }))),
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(eui_1.EuiHorizontalRule, { margin: "xs" })))));
        });
        return react_1.default.createElement("div", null, rulesList);
    };
    const addNewRule = () => {
        const rulesTmp = [...rules];
        rulesTmp.push(default_rule);
        setRules(rulesTmp);
    };
    const openJsonEditor = () => {
        const ruleObject = rule_editor_helper_1.getJsonFromRule(internalUserRules, rules, logicalOperator);
        setRuleJson(JSON.stringify(ruleObject, undefined, 2));
        setIsJsonEditor(true);
    };
    const openVisualEditor = () => {
        setStateFromRule(ruleJson);
    };
    const onChangeRuleJson = e => {
        setRuleJson(e);
        getRulesFromJson(e); // we test format to disable button if it's incorrect
    };
    const getSwitchVisualButton = () => {
        if (hasWrongFormat) {
            return (react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: "Current rule can't be edited using visual editor" },
                react_1.default.createElement(eui_1.EuiButtonEmpty, { color: "primary", isDisabled: hasWrongFormat, onClick: () => openVisualEditor() }, "Switch to visual editor")));
        }
        else {
            return (react_1.default.createElement(eui_1.EuiButtonEmpty, { color: "primary", onClick: () => openVisualEditor() }, "Switch to visual editor"));
        }
    };
    const saveRule = () => {
        if (isJsonEditor) {
            save(JSON.parse(ruleJson));
        }
        else {
            save(rule_editor_helper_1.getJsonFromRule(internalUserRules, rules, logicalOperator));
        }
    };
    const onChangeSelectedUsers = selectedUsers => {
        setSelectedUsers(selectedUsers);
        const tmpInternalUsersRules = selectedUsers.map(user => {
            return { user_field: default_user_field, searchOperation: 'FIND', value: user.id };
        });
        setInternalUserRules(tmpInternalUsersRules);
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiPanel, null,
            react_1.default.createElement(eui_1.EuiTitle, null,
                react_1.default.createElement("h1", null, "Mapping rules")),
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiText, null,
                        react_1.default.createElement("span", null, "Assign roles to users who match these rules. "),
                        react_1.default.createElement(eui_1.EuiLink, { href: "https://documentation.wazuh.com/current/user-manual/api/rbac/auth_context.html", external: true, target: "_blank" }, "Learn more")))),
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiPanel, null, (isJsonEditor && (react_1.default.createElement(eui_1.EuiCodeEditor
                    // theme="textmate"
                    , { 
                        // theme="textmate"
                        readOnly: isLoading || isReserved, width: "100%", height: "250px", value: ruleJson, mode: "json", onChange: onChangeRuleJson, wrapEnabled: true, "aria-label": "Code Editor" }))) || (react_1.default.createElement(react_1.Fragment, null,
                        react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                            react_1.default.createElement("h2", null, "Map internal users")),
                        react_1.default.createElement(eui_1.EuiFormRow, { label: "Internal users", helpText: "Assign internal users to the selected role mapping" },
                            react_1.default.createElement(eui_1.EuiComboBox, { placeholder: "Select internal users", options: internalUsersOptions, selectedOptions: selectedUsers, isLoading: isLoading, onChange: onChangeSelectedUsers, isClearable: true, "data-test-subj": "demoComboBox" })),
                        react_1.default.createElement(eui_1.EuiSpacer, null),
                        react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                            react_1.default.createElement("h2", null, "Custom rules")),
                        react_1.default.createElement(eui_1.EuiPopover, { ownFocus: true, button: react_1.default.createElement(eui_1.EuiButtonEmpty, { disabled: isLoading || isReserved, onClick: onButtonClick, iconType: "arrowDown", iconSide: "right" }, logicalOperator === 'AND' ? 'All are true' : 'Any are true'), isOpen: isLogicalPopoverOpen, closePopover: closeLogicalPopover, anchorPosition: "downCenter" },
                            react_1.default.createElement("div", null,
                                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                                        react_1.default.createElement(eui_1.EuiButtonEmpty, { disabled: isLoading || isReserved, color: "text", onClick: () => selectOperator('AND') },
                                            logicalOperator === 'AND' && react_1.default.createElement(eui_1.EuiIcon, { type: "check" }),
                                            "All are true"))),
                                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                                        react_1.default.createElement(eui_1.EuiButtonEmpty, { disabled: isLoading || isReserved, color: "text", onClick: () => selectOperator('OR') },
                                            logicalOperator === 'OR' && react_1.default.createElement(eui_1.EuiIcon, { type: "check" }),
                                            "Any are true"))))),
                        printRules(),
                        react_1.default.createElement(eui_1.EuiButtonEmpty, { disabled: isLoading || isReserved, color: "primary", onClick: () => addNewRule() }, "Add new rule")))))),
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, (isJsonEditor && getSwitchVisualButton()) || (react_1.default.createElement(eui_1.EuiButtonEmpty, { color: "primary", onClick: () => openJsonEditor() }, "Switch to JSON editor"))))),
        react_1.default.createElement(eui_1.EuiFlexGroup, { style: { marginTop: 6 } },
            react_1.default.createElement(eui_1.EuiFlexItem, null),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButton, { disabled: isReserved, isLoading: isLoading, fill: true, onClick: () => saveRule() }, "Save role mapping")))));
};
