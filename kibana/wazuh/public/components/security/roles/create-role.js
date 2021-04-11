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
exports.CreateRole = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const wz_request_1 = require("../../../react-services/wz-request");
const error_handler_1 = require("../../../react-services/error-handler");
exports.CreateRole = ({ closeFlyout }) => {
    const [policies, setPolicies] = react_1.useState([]);
    const [roleName, setRoleName] = react_1.useState('');
    const [roleNameError, setRoleNameError] = react_1.useState(false);
    const [selectedPolicies, setSelectedPolicies] = react_1.useState([]);
    const [selectedPoliciesError, setSelectedPoliciesError] = react_1.useState(false);
    async function getData() {
        const policies_request = await wz_request_1.WzRequest.apiReq('GET', '/security/policies', {});
        const policies = ((((policies_request || {}).data || {}).data || {}).affected_items || [])
            .map(x => { return { 'label': x.name, id: x.id }; });
        setPolicies(policies);
    }
    react_1.useEffect(() => {
        getData();
    }, []);
    const createUser = async () => {
        if (!roleName) {
            setRoleNameError(true);
            return;
        }
        else if (roleNameError) {
            setRoleNameError(false);
        }
        if (!selectedPolicies.length) {
            setSelectedPoliciesError(true);
            return;
        }
        else if (selectedPoliciesError) {
            setSelectedPoliciesError(false);
        }
        try {
            const result = await wz_request_1.WzRequest.apiReq('POST', '/security/roles', {
                "name": roleName
            });
            const data = (result.data || {}).data;
            if (data.failed_items && data.failed_items.length) {
                return;
            }
            let roleId = "";
            if (data.affected_items && data.affected_items) {
                roleId = data.affected_items[0].id;
            }
            const policiesId = selectedPolicies.map(policy => {
                return policy.id;
            });
            const policyResult = await wz_request_1.WzRequest.apiReq('POST', `/security/roles/${roleId}/policies`, {
                params: {
                    policy_ids: policiesId.toString()
                }
            });
            const policiesData = (policyResult.data || {}).data;
            if (policiesData.failed_items && policiesData.failed_items.length) {
                return;
            }
            error_handler_1.ErrorHandler.info('Role was successfully created with the selected policies');
        }
        catch (error) {
            error_handler_1.ErrorHandler.handle(error, "There was an error");
        }
        closeFlyout(false);
    };
    const onChangeRoleName = e => {
        setRoleName(e.target.value);
    };
    const onChangePolicies = selectedPolicies => {
        setSelectedPolicies(selectedPolicies);
    };
    return (react_1.default.createElement(eui_1.EuiFlyout, { onClose: () => closeFlyout(false) },
        react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: false },
            react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                react_1.default.createElement("h2", null, "New role"))),
        react_1.default.createElement(eui_1.EuiFlyoutBody, null,
            react_1.default.createElement(eui_1.EuiForm, { component: "form", style: { padding: 24 } },
                react_1.default.createElement(eui_1.EuiFormRow, { label: "Role name", isInvalid: roleNameError, error: 'Please provide a role name', helpText: "Introduce a name for this new role." },
                    react_1.default.createElement(eui_1.EuiFieldText, { placeholder: "", value: roleName, onChange: e => onChangeRoleName(e), "aria-label": "" })),
                react_1.default.createElement(eui_1.EuiFormRow, { label: "Policies", isInvalid: selectedPoliciesError, error: 'At least one policy must be selected.', helpText: "Assign policies to the role." },
                    react_1.default.createElement(eui_1.EuiComboBox, { placeholder: "Select policies", options: policies, selectedOptions: selectedPolicies, onChange: onChangePolicies, isClearable: true, "data-test-subj": "demoComboBox" })),
                react_1.default.createElement(eui_1.EuiSpacer, null),
                react_1.default.createElement(eui_1.EuiButton, { fill: true, onClick: createUser }, "Create role")))));
};
