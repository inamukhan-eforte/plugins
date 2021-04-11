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
exports.EditRolesTable = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const services_1 = require("@elastic/eui/lib/services");
const wz_request_1 = require("../../../react-services/wz-request");
const error_handler_1 = require("../../../react-services/error-handler");
exports.EditRolesTable = ({ policies, role, onChange, isDisabled, loading }) => {
    const [isLoading, setIsLoading] = react_1.useState(false);
    const [pageIndex, setPageIndex] = react_1.useState(0);
    const [pageSize, setPageSize] = react_1.useState(10);
    const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = react_1.useState({});
    const onTableChange = ({ page = {}, sort = {} }) => {
        const { index: pageIndex, size: pageSize } = page;
        setPageIndex(pageIndex);
        setPageSize(pageSize);
    };
    const formatPolicies = (policiesArray) => {
        return policiesArray.map(policy => {
            return policies.find(item => item.id === policy);
        });
    };
    const getItems = () => {
        if (loading)
            return { pageOfItems: [], totalItemCount: 0 };
        const items = formatPolicies(role.policies.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize));
        return { pageOfItems: items, totalItemCount: role.policies.length };
    };
    const { pageOfItems, totalItemCount } = getItems();
    const toggleDetails = item => {
        const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
        if (itemIdToExpandedRowMapValues[item.id]) {
            delete itemIdToExpandedRowMapValues[item.id];
        }
        else {
            const listItems = [
                {
                    title: 'Actions',
                    description: `${item.policy.actions}`,
                },
                {
                    title: 'Resources',
                    description: `${item.policy.resources}`,
                },
                {
                    title: 'Effect',
                    description: `${item.policy.effect}`,
                },
            ];
            itemIdToExpandedRowMapValues[item.id] = (react_1.default.createElement(eui_1.EuiDescriptionList, { listItems: listItems }));
        }
        setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
    };
    const columns = [
        {
            field: 'label',
            name: 'Policies',
            sortable: false,
            truncateText: true
        },
        {
            name: 'Actions',
            actions: [
                {
                    name: 'Remove',
                    description: 'Remove',
                    type: 'icon',
                    color: 'danger',
                    icon: 'trash',
                    enabled: () => !isDisabled && !isLoading,
                    onClick: async (item) => {
                        try {
                            setIsLoading(true);
                            const response = await wz_request_1.WzRequest.apiReq('DELETE', `/security/roles/${role.id}/policies`, {
                                params: {
                                    policy_ids: item.id
                                }
                            });
                            const removePolicy = (response.data || {}).data;
                            if (removePolicy.failed_items && removePolicy.failed_items.length) {
                                setIsLoading(false);
                                return;
                            }
                            error_handler_1.ErrorHandler.info(`Policy was successfull removed from role ${role.name}`);
                            await onChange();
                        }
                        catch (err) { }
                        setIsLoading(false);
                    },
                },
            ],
        },
        {
            align: services_1.RIGHT_ALIGNMENT,
            width: '40px',
            isExpander: true,
            render: item => (react_1.default.createElement(eui_1.EuiButtonIcon, { onClick: () => toggleDetails(item), "aria-label": itemIdToExpandedRowMap[item.id] ? 'Collapse' : 'Expand', iconType: itemIdToExpandedRowMap[item.id] ? 'arrowUp' : 'arrowDown' })),
        },
    ];
    const pagination = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalItemCount: totalItemCount,
        pageSizeOptions: [5, 10, 20],
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiBasicTable, { items: pageOfItems, itemId: "id", loading: isLoading || loading, itemIdToExpandedRowMap: itemIdToExpandedRowMap, isExpandable: true, hasActions: true, columns: columns, pagination: pagination, isSelectable: true, onChange: onTableChange })));
};
