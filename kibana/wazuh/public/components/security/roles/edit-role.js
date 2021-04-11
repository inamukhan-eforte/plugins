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
exports.EditRole = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const wz_request_1 = require("../../../react-services/wz-request");
const error_handler_1 = require("../../../react-services/error-handler");
const edit_role_table_1 = require("./edit-role-table");
const reservedRoles = ['administrator', 'readonly', 'users_admin', 'agents_readonly', 'agents_admin', 'cluster_readonly', 'cluster_admin'];
exports.EditRole = ({ role, closeFlyout }) => {
    const [isLoading, setIsLoading] = react_1.useState(true);
    const [currentRole, setCurrentRole] = react_1.useState({});
    const [isReserved, setIsReserved] = react_1.useState(reservedRoles.includes(role.name));
    const [policies, setPolicies] = react_1.useState([]);
    const [selectedPolicies, setSelectedPolicies] = react_1.useState([]);
    const [selectedPoliciesError, setSelectedPoliciesError] = react_1.useState(false);
    const [assignedPolicies, setAssignedPolicies] = react_1.useState([]);
    async function getData() {
        try {
            setIsLoading(true);
            const roleDataResponse = await wz_request_1.WzRequest.apiReq('GET', '/security/roles', {
                params: {
                    role_ids: role.id
                }
            });
            const roleData = (((roleDataResponse.data || {}).data || {}).affected_items || [])[0];
            setCurrentRole(roleData);
            const policies_request = await wz_request_1.WzRequest.apiReq('GET', '/security/policies', {});
            const selectedPoliciesCopy = [];
            const policies = ((((policies_request || {}).data || {}).data || {}).affected_items || [])
                .map(x => {
                const currentPolicy = { 'label': x.name, id: x.id, roles: x.roles, policy: x.policy };
                if (roleData.policies.includes(x.id)) {
                    selectedPoliciesCopy.push(currentPolicy);
                    return false;
                }
                else {
                    return currentPolicy;
                }
            });
            const filteredPolicies = policies.filter(item => item !== false);
            setAssignedPolicies(selectedPoliciesCopy);
            setPolicies(filteredPolicies);
        }
        catch (error) {
            error_handler_1.ErrorHandler.handle(error, 'Error');
        }
        setIsLoading(false);
    }
    react_1.useEffect(() => {
        getData();
    }, []);
    const addPolicy = async () => {
        if (!selectedPolicies.length) {
            setSelectedPoliciesError(true);
            return;
        }
        else if (selectedPoliciesError) {
            setSelectedPoliciesError(false);
        }
        try {
            let roleId = currentRole.id;
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
            error_handler_1.ErrorHandler.info('Role was successfully updated with the selected policies');
            setSelectedPolicies([]);
            await update();
        }
        catch (error) {
            error_handler_1.ErrorHandler.handle(error, "There was an error");
        }
    };
    const update = async () => {
        await getData();
    };
    const onChangePolicies = selectedPolicies => {
        setSelectedPolicies(selectedPolicies);
    };
    return (react_1.default.createElement(eui_1.EuiFlyout, { onClose: () => closeFlyout(false) },
        react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: false },
            react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                react_1.default.createElement("h2", null,
                    "Edit ",
                    role.name,
                    " role \u00A0",
                    isReserved &&
                        react_1.default.createElement(eui_1.EuiBadge, { color: 'primary' }, "Reserved")))),
        react_1.default.createElement(eui_1.EuiFlyoutBody, null,
            react_1.default.createElement(eui_1.EuiForm, { component: "form", style: { padding: 24 } },
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: true },
                        react_1.default.createElement(eui_1.EuiFormRow, { label: "Policies", isInvalid: selectedPoliciesError, error: 'At least one policy must be selected.', helpText: "Assign policies to the role." },
                            react_1.default.createElement(eui_1.EuiComboBox, { placeholder: "Select policies", options: policies, isDisabled: isReserved, selectedOptions: selectedPolicies, onChange: onChangePolicies, isClearable: true, "data-test-subj": "demoComboBox" }))),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: true },
                        react_1.default.createElement(eui_1.EuiButton, { style: { marginTop: 20, maxWidth: 45 }, isDisabled: isReserved, fill: true, onClick: addPolicy }, "Add policy"))),
                react_1.default.createElement(eui_1.EuiSpacer, null)),
            react_1.default.createElement("div", { style: { margin: 20 } },
                react_1.default.createElement(edit_role_table_1.EditRolesTable, { policies: assignedPolicies, role: currentRole, onChange: update, isDisabled: isReserved, loading: isLoading })))));
};
