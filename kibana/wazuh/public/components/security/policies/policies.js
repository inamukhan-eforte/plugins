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
exports.Policies = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const policies_table_1 = require("./policies-table");
const wz_request_1 = require("../../../react-services/wz-request");
const error_handler_1 = require("../../../react-services/error-handler");
const edit_policy_1 = require("./edit-policy");
exports.Policies = () => {
    const [isFlyoutVisible, setIsFlyoutVisible] = react_1.useState(false);
    const [resources, setResources] = react_1.useState([]);
    const [resourceValue, setResourceValue] = react_1.useState('');
    const [resourceIdentifierValue, setResourceIdentifierValue] = react_1.useState('');
    const [availableResources, setAvailableResources] = react_1.useState([]);
    const [availableActions, setAvailableActions] = react_1.useState([]);
    const [addedActions, setAddedActions] = react_1.useState([]);
    const [addedResources, setAddedResources] = react_1.useState([]);
    const [actions, setActions] = react_1.useState([]);
    const [actionValue, setActionValue] = react_1.useState('');
    const [policyName, setPolicyName] = react_1.useState('');
    const [policies, setPolicies] = react_1.useState('');
    const [loading, setLoading] = react_1.useState(false);
    const [isEditingPolicy, setIsEditingPolicy] = react_1.useState(false);
    const [editingPolicy, setEditingPolicy] = react_1.useState('');
    react_1.useEffect(() => { loadResources(); }, [addedActions]);
    const getPolicies = async () => {
        setLoading(true);
        const request = await wz_request_1.WzRequest.apiReq('GET', '/security/policies', {});
        const policies = (((request || {}).data || {}).data || {}).affected_items || [];
        setPolicies(policies);
        setLoading(false);
    };
    react_1.useEffect(() => {
        getPolicies();
    }, []);
    const editPolicy = (item) => {
        setEditingPolicy(item);
        setIsEditingPolicy(true);
    };
    const createPolicy = async () => {
        try {
            const result = await wz_request_1.WzRequest.apiReq('POST', '/security/policies', {
                name: policyName,
                policy: {
                    actions: addedActions.map(x => x.action),
                    resources: addedResources.map(x => x.resource),
                    effect: effectValue
                }
            });
            const resultData = (result.data || {}).data;
            if (resultData.failed_items && resultData.failed_items.length) {
                return;
            }
            error_handler_1.ErrorHandler.info('Policy was successfully created', '');
            await getPolicies();
            setPolicyName("");
            setAddedActions([]);
            setAddedResources([]);
            setEffectValue(null);
        }
        catch (error) {
            error_handler_1.ErrorHandler.handle(error, 'Error creating policy');
            return;
        }
        setIsFlyoutVisible(false);
    };
    const onChangePolicyName = e => {
        setPolicyName(e.target.value);
    };
    const onChangeResourceValue = async (value) => {
        setResourceValue(value);
        setResourceIdentifierValue('');
    };
    const onChangeResourceIdentifierValue = async (e) => {
        setResourceIdentifierValue(e.target.value);
    };
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
                        react_1.default.createElement("p", { className: "euiTextColor--subdued" }, availableResources[x].description))))
            };
        });
        setResources(resources);
    };
    const onChangeActionValue = async (value) => {
        setActionValue(value);
    };
    async function getData() {
        const resources_request = await wz_request_1.WzRequest.apiReq('GET', '/security/resources', {});
        const actions_request = await wz_request_1.WzRequest.apiReq('GET', '/security/actions', {});
        const resources_data = ((resources_request || {}).data || []).data || {};
        setAvailableResources(resources_data);
        const actions_data = ((actions_request || {}).data || []).data || {};
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
    react_1.useEffect(() => {
        getData();
    }, []);
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
    const [effectValue, setEffectValue] = react_1.useState();
    const onEffectValueChange = value => {
        setEffectValue(value);
    };
    const getIdentifier = () => {
        const keys = (Object.keys(availableResources) || []);
        return (keys[resourceValue] || ':').split(':')[1];
    };
    const addResource = () => {
        if (!addedResources.filter(x => x.resource === `${resourceValue}:${resourceIdentifierValue}`).length) {
            setAddedResources(addedResources => [...addedResources,
                { resource: `${resourceValue}:${resourceIdentifierValue}` }
            ]);
        }
        setResourceIdentifierValue('');
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
    const removeResource = (resource) => {
        setAddedResources(addedResources.filter(x => x !== resource));
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
                    icon: 'trash',
                    onClick: (resource) => removeResource(resource),
                },
            ],
        }
    ];
    const closeEditingFlyout = async () => {
        setIsEditingPolicy(false);
        await getPolicies();
    };
    let editFlyout;
    if (isEditingPolicy) {
        editFlyout = (react_1.default.createElement(eui_1.EuiOverlayMask, { headerZindexLocation: "below", onClick: () => { closeEditingFlyout(); } },
            react_1.default.createElement(edit_policy_1.EditPolicyFlyout, { closeFlyout: closeEditingFlyout, policy: editingPolicy })));
    }
    let flyout;
    if (isFlyoutVisible) {
        flyout = (react_1.default.createElement(eui_1.EuiOverlayMask, { headerZindexLocation: "below", onClick: () => { setIsFlyoutVisible(false); } },
            react_1.default.createElement(eui_1.EuiFlyout, { onClose: () => setIsFlyoutVisible(false) },
                react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: false },
                    react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                        react_1.default.createElement("h2", null, "New policy"))),
                react_1.default.createElement(eui_1.EuiFlyoutBody, null,
                    react_1.default.createElement(eui_1.EuiForm, { component: "form", style: { padding: 24 } },
                        react_1.default.createElement(eui_1.EuiFormRow, { label: "Policy name", helpText: "Introduce a name for this new policy." },
                            react_1.default.createElement(eui_1.EuiFieldText, { placeholder: "", value: policyName, onChange: e => onChangePolicyName(e), "aria-label": "" })),
                        react_1.default.createElement(eui_1.EuiSpacer, null),
                        react_1.default.createElement(eui_1.EuiFlexGroup, null,
                            react_1.default.createElement(eui_1.EuiFlexItem, null,
                                react_1.default.createElement(eui_1.EuiFormRow, { label: "Action", helpText: "Set an action where the policy will be carried out." },
                                    react_1.default.createElement(eui_1.EuiSuperSelect, { options: actions, valueOfSelected: actionValue, onChange: value => onChangeActionValue(value), itemLayoutAlign: "top", hasDividers: true }))),
                            react_1.default.createElement(eui_1.EuiFlexItem, null),
                            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                react_1.default.createElement(eui_1.EuiFormRow, { hasEmptyLabelSpace: true },
                                    react_1.default.createElement(eui_1.EuiButton, { onClick: () => addAction(), iconType: "plusInCircle", disabled: !actionValue }, "Add")))),
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
                                    react_1.default.createElement(eui_1.EuiSuperSelect, { options: resources, valueOfSelected: resourceValue, onChange: value => onChangeResourceValue(value), itemLayoutAlign: "top", hasDividers: true, disabled: !addedActions.length }))),
                            react_1.default.createElement(eui_1.EuiFlexItem, null,
                                react_1.default.createElement(eui_1.EuiFormRow, { label: "Resource identifier", helpText: "Introduce the resource identifier. Type * for all." },
                                    react_1.default.createElement(eui_1.EuiFieldText, { placeholder: getIdentifier(), value: resourceIdentifierValue, onChange: e => onChangeResourceIdentifierValue(e), disabled: !resourceValue }))),
                            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                react_1.default.createElement(eui_1.EuiFormRow, { hasEmptyLabelSpace: true },
                                    react_1.default.createElement(eui_1.EuiButton, { onClick: () => addResource(), iconType: "plusInCircle", disabled: !resourceIdentifierValue }, "Add")))),
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
                        react_1.default.createElement(eui_1.EuiButton, { disabled: !policyName || !addedActions.length || !addedResources.length || !effectValue, onClick: () => createPolicy(), fill: true }, "Create policy"))))));
    }
    return (react_1.default.createElement(eui_1.EuiPageContent, null,
        react_1.default.createElement(eui_1.EuiPageContentHeader, null,
            react_1.default.createElement(eui_1.EuiPageContentHeaderSection, null,
                react_1.default.createElement(eui_1.EuiTitle, null,
                    react_1.default.createElement("h2", null, "Policies"))),
            react_1.default.createElement(eui_1.EuiPageContentHeaderSection, null,
                react_1.default.createElement("div", null,
                    react_1.default.createElement(eui_1.EuiButton, { onClick: () => setIsFlyoutVisible(true) }, "Create policy"),
                    flyout,
                    editFlyout))),
        react_1.default.createElement(eui_1.EuiPageContentBody, null,
            react_1.default.createElement(policies_table_1.PoliciesTable, { loading: loading, policies: policies, editPolicy: editPolicy, updatePolicies: getPolicies }))));
};
