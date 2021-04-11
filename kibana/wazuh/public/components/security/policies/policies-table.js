"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliciesTable = void 0;
const react_1 = __importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const wz_request_1 = require("../../../react-services/wz-request");
const error_handler_1 = require("../../../react-services/error-handler");
const wz_api_utils_1 = require("../../../react-services/wz-api-utils");
const buttons_1 = require("../../common/buttons");
exports.PoliciesTable = ({ policies, loading, editPolicy, updatePolicies }) => {
    const getRowProps = item => {
        const { id } = item;
        return {
            'data-test-subj': `row-${id}`,
            onClick: () => editPolicy(item),
        };
    };
    const columns = [
        {
            field: 'id',
            name: 'ID',
            width: 75,
            sortable: true,
            truncateText: true,
        },
        {
            field: 'name',
            name: 'Name',
            sortable: true,
            truncateText: true,
        },
        {
            field: 'policy.actions',
            name: 'Actions',
            sortable: true,
            render: actions => {
                return (actions || []).join(", ");
            },
            truncateText: true,
        },
        {
            field: 'policy.resources',
            name: 'Resources',
            sortable: true,
            truncateText: true,
        },
        {
            field: 'policy.effect',
            name: 'Effect',
            sortable: true,
            truncateText: true,
        },
        {
            field: 'id',
            name: 'Status',
            render: (item) => {
                return wz_api_utils_1.WzAPIUtils.isReservedID(item) && react_1.default.createElement(eui_1.EuiBadge, { color: "primary" }, "Reserved");
            },
            width: 150,
            sortable: false,
        },
        {
            align: 'right',
            width: '5%',
            name: 'Actions',
            render: item => (react_1.default.createElement("div", { onClick: ev => ev.stopPropagation() },
                react_1.default.createElement(buttons_1.WzButtonModalConfirm, { buttonType: 'icon', tooltip: { content: wz_api_utils_1.WzAPIUtils.isReservedID(item.id) ? "Reserved policies can't be deleted" : 'Delete policy', position: 'left' }, isDisabled: wz_api_utils_1.WzAPIUtils.isReservedID(item.id), modalTitle: `Do you want to delete the ${item.name} policy?`, onConfirm: async () => {
                        try {
                            const response = await wz_request_1.WzRequest.apiReq('DELETE', `/security/policies/`, {
                                params: {
                                    policy_ids: item.id
                                }
                            });
                            const data = (response.data || {}).data;
                            if (data.failed_items && data.failed_items.length) {
                                return;
                            }
                            error_handler_1.ErrorHandler.info('Policy was successfully deleted');
                            await updatePolicies();
                        }
                        catch (error) {
                            error_handler_1.ErrorHandler.handle(error, 'Error deleting policy');
                        }
                    }, modalProps: { buttonColor: 'danger' }, iconType: 'trash', color: 'danger', "aria-label": 'Delete policy' })))
        }
    ];
    const sorting = {
        sort: {
            field: 'id',
            direction: 'asc',
        },
    };
    const search = {
        box: {
            incremental: false,
            schema: true,
        },
    };
    return (react_1.default.createElement(eui_1.EuiInMemoryTable, { items: policies, columns: columns, search: search, rowProps: getRowProps, pagination: true, loading: loading, sorting: sorting }));
};
