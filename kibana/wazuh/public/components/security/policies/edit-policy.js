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
exports.EditPolicyFlyout = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const wz_request_1 = require("../../../react-services/wz-request");
const error_handler_1 = require("../../../react-services/error-handler");
const wz_api_utils_1 = require("../../../react-services/wz-api-utils");
exports.EditPolicyFlyout = ({ policy, closeFlyout }) => {
    const isReserved = wz_api_utils_1.WzAPIUtils.isReservedID(policy.id);
    const [actionValue, setActionValue] = react_1.useState('');
    const [addedActions, setAddedActions] = react_1.useState([]);
    const [availableResources, setAvailableResources] = react_1.useState([]);
    const [availableActions, setAvailableActions] = react_1.useState([]);
    const [actions, setActions] = react_1.useState([]);
    const [addedResources, setAddedResources] = react_1.useState([]);
    const [resources, setResources] = react_1.useState([]);
    const [resourceValue, setResourceValue] = react_1.useState('');
    const [resourceIdentifierValue, setResourceIdentifierValue] = react_1.useState('');
    const [effectValue, setEffectValue] = react_1.useState();
    react_1.useEffect(() => {
        getData();
        initData();
    }, []);
    react_1.useEffect(() => { loadResources(); }, [addedActions, availableActions]);
    const updatePolicy = async () => {
        try {
            const actions = addedActions.map(item => item.action);
            const resources = addedResources.map(item => item.resource);
            const response = await wz_request_1.WzRequest.apiReq('PUT', `/security/policies/${policy.id}`, {
                "policy": {
                    "actions": actions,
                    "resources": resources,
                    "effect": effectValue
                }
            });
            const data = (response.data || {}).data;
            if (data.failed_items && data.failed_items.length) {
                return;
            }
            error_handler_1.ErrorHandler.info('Role was successfully updated with the selected policies');
            closeFlyout();
        }
        catch (error) {
            error_handler_1.ErrorHandler.handle(error, 'Unexpected error');
        }
    };
    async function getData() {
        const resources_request = await wz_request_1.WzRequest.apiReq('GET', '/security/resources', {});
        const actions_request = await wz_request_1.WzRequest.apiReq('GET', '/security/actions', {});
        const resources_data = ((resources_request || {}).data || {}).data || {};
        setAvailableResources(resources_data);
        const actions_data = ((actions_request || {}).data || {}).data || {};
        setAvailableActions(actions_data);
        const actions = Object.keys(actions_data)
            .map((x, idx) => {
            return {
                id: idx,
                value: x,
                inputDisplay: x,
                dropdownDisplay: (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("strong", null, x),
                    react_1.default.createElement(eui_1.EuiText, { size: "s", color: "subdued" },
                        react_1.default.createElement("p", { className: "euiTextColor--subdued" }, actions_data[x].description))))
            };
        });
        setActions(actions);
    }
    const loadResources = () => {
        let allResources = [];
        addedActions.forEach(x => {
            const res = (availableActions[x.action] || {})['resources'];
            allResources = allResources.concat(res);
        });
        const allResourcesSet = new Set(allResources);
        const resources = Array.from(allResourcesSet).map((x, idx) => {
            return {
                id: idx,
                value: x,
                inputDisplay: x,
                dropdownDisplay: (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("strong", null, x),
                    react_1.default.createElement(eui_1.EuiText, { size: "s", color: "subdued" },
                        react_1.default.createElement("p", { className: "euiTextColor--subdued" }, (availableResources[x] || {}).description))))
            };
        });
        setResources(resources);
    };
    const initData = () => {
        const policies = ((policy || {}).policy || {}).actions || [];
        const initPolicies = policies.map(item => {
            return { action: item };
        });
        setAddedActions(initPolicies);
        const resources = ((policy || {}).policy || {}).resources || [];
        const initResources = resources.map(item => {
            return { resource: item };
        });
        setAddedResources(initResources);
        setEffectValue(policy.policy.effect);
    };
    const onEffectValueChange = value => {
        setEffectValue(value);
    };
    const effectOptions = [
        {
            value: 'allow',
            inputDisplay: 'Allow'
        },
        {
            value: 'deny',
            inputDisplay: 'Deny'
        },
    ];
    const onChangeActionValue = async (value) => {
        setActionValue(value);
    };
    const addAction = () => {
        if (!addedActions.filter(x => x.action === actionValue).length) {
            setAddedActions(addedActions => [...addedActions,
                { action: actionValue }
            ]);
        }
        setActionValue('');
    };
    const removeAction = (action) => {
        setAddedActions(addedActions.filter(x => x !== action));
    };
    const actions_columns = [
        {
            field: 'action',
            name: 'Actions',
            sortable: true,
            truncateText: true,
        },
        {
            name: '',
            actions: [
                {
                    name: 'Remove',
                    description: 'Remove this action',
                    type: 'icon',
                    enabled: () => !isReserved,
                    color: 'danger',
                    icon: 'trash',
                    onClick: (action) => removeAction(action),
                },
            ],
        }
    ];
    const resources_columns = [
        {
            field: 'resource',
            name: 'Resources',
            sortable: true,
            truncateText: true,
        },
        {
            name: '',
            actions: [
                {
                    name: 'Remove',
                    description: 'Remove this resource',
                    type: 'icon',
                    color: 'danger',
                    enabled: () => !isReserved,
                    icon: 'trash',
                    onClick: (resource) => removeResource(resource),
                },
            ],
        }
    ];
    const onChangeResourceValue = async (value) => {
        setResourceValue(value);
        setResourceIdentifierValue('');
    };
    const getIdentifier = () => {
        const keys = (Object.keys(availableResources) || []);
        return (keys[resourceValue] || ':').split(':')[1];
    };
    const onChangeResourceIdentifierValue = async (e) => {
        setResourceIdentifierValue(e.target.value);
    };
    const removeResource = (resource) => {
        setAddedResources(addedResources.filter(x => x !== resource));
    };
    const addResource = () => {
        if (!addedResources.filter(x => x.resource === `${resourceValue}:${resourceIdentifierValue}`).length) {
            setAddedResources(addedResources => [...addedResources,
                { resource: `${resourceValue}:${resourceIdentifierValue}` }
            ]);
        }
        setResourceIdentifierValue('');
    };
    return (react_1.default.createElement(eui_1.EuiFlyout, { onClose: () => closeFlyout(false) },
        react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: false },
            react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                react_1.default.createElement("h2", null,
                    "Edit policy ",
                    policy.name,
                    "\u00A0\u00A0",
                    isReserved &&
                        react_1.default.createElement(eui_1.EuiBadge, { color: 'primary' }, "Reserved")))),
        react_1.default.createElement(eui_1.EuiFlyoutBody, null,
            react_1.default.createElement(eui_1.EuiForm, { component: "form", style: { padding: 24 } },
                react_1.default.createElement(eui_1.EuiFormRow, { label: "Policy name", helpText: "Introduce a name for this new policy." },
                    react_1.default.createElement(eui_1.EuiFieldText, { placeholder: "", disabled: isReserved, value: policy.name, readOnly: true, onChange: () => { }, "aria-label": "" })),
                react_1.default.createElement(eui_1.EuiSpacer, null),
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(eui_1.EuiFormRow, { label: "Action", helpText: "Set an action where the policy will be carried out." },
                            react_1.default.createElement(eui_1.EuiSuperSelect, { options: actions, disabled: isReserved, valueOfSelected: actionValue, onChange: value => onChangeActionValue(value), itemLayoutAlign: "top", hasDividers: true }))),
                    react_1.default.createElement(eui_1.EuiFlexItem, null),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiFormRow, { hasEmptyLabelSpace: true },
                            react_1.default.createElement(eui_1.EuiButton, { onClick: () => addAction(), iconType: "plusInCircle", disabled: !actionValue || isReserved }, "Add")))),
                !!addedActions.length &&
                    react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(eui_1.EuiSpacer, { size: 's' }),
                        react_1.default.createElement(eui_1.EuiFlexGroup, null,
                            react_1.default.createElement(eui_1.EuiFlexItem, null,
                                react_1.default.createElement(eui_1.EuiInMemoryTable, { items: addedActions, columns: actions_columns })))),
                react_1.default.createElement(eui_1.EuiSpacer, null),
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(eui_1.EuiFormRow, { label: "Resource", helpText: "Select the resource to which this policy is directed." },
                            react_1.default.createElement(eui_1.EuiSuperSelect, { options: resources, valueOfSelected: resourceValue, onChange: value => onChangeResourceValue(value), itemLayoutAlign: "top", hasDividers: true, disabled: !addedActions.length || isReserved }))),
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(eui_1.EuiFormRow, { label: "Resource identifier", helpText: "Introduce the resource identifier. Type * for all." },
                            react_1.default.createElement(eui_1.EuiFieldText, { placeholder: getIdentifier(), value: resourceIdentifierValue, onChange: e => onChangeResourceIdentifierValue(e), disabled: !resourceValue || isReserved }))),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiFormRow, { hasEmptyLabelSpace: true },
                            react_1.default.createElement(eui_1.EuiButton, { onClick: () => addResource(), iconType: "plusInCircle", disabled: !resourceIdentifierValue || isReserved }, "Add")))),
                !!addedResources.length &&
                    react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(eui_1.EuiSpacer, { size: 's' }),
                        react_1.default.createElement(eui_1.EuiFlexGroup, null,
                            react_1.default.createElement(eui_1.EuiFlexItem, null,
                                react_1.default.createElement(eui_1.EuiInMemoryTable, { items: addedResources, columns: resources_columns })))),
                react_1.default.createElement(eui_1.EuiSpacer, null),
                react_1.default.createElement(eui_1.EuiFormRow, { label: "Select an effect", helpText: "Select an effect." },
                    react_1.default.createElement(eui_1.EuiSuperSelect, { options: effectOptions, valueOfSelected: effectValue, onChange: value => onEffectValueChange(value) })),
                react_1.default.createElement(eui_1.EuiSpacer, null),
                react_1.default.createElement(eui_1.EuiButton, { disabled: isReserved, onClick: updatePolicy, fill: true }, "Apply")))));
};
