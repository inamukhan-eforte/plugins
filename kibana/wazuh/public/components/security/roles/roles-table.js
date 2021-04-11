"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesTable = void 0;
const react_1 = __importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const wz_request_1 = require("../../../react-services/wz-request");
const error_handler_1 = require("../../../react-services/error-handler");
const buttons_1 = require("../../common/buttons");
const wz_api_utils_1 = require("../../../react-services/wz-api-utils");
exports.RolesTable = ({ roles, policiesData, loading, editRole, updateRoles }) => {
    const getRowProps = item => {
        const { id } = item;
        return {
            'data-test-subj': `row-${id}`,
            onClick: () => editRole(item),
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
            width: 200,
            sortable: true,
            truncateText: true,
        },
        {
            field: 'policies',
            name: 'Policies',
            render: policies => {
                return policiesData && react_1.default.createElement(eui_1.EuiFlexGroup, { wrap: true, responsive: false, gutterSize: "xs" }, policies.map(policy => {
                    const data = ((policiesData || []).find(x => x.id === policy) || {});
                    return data.name && react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, key: policy },
                        react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: react_1.default.createElement("div", null,
                                react_1.default.createElement("b", null, "Actions"),
                                react_1.default.createElement("p", null, ((data.policy || {}).actions || []).join(", ")),
                                react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                                react_1.default.createElement("b", null, "Resources"),
                                react_1.default.createElement("p", null, ((data.policy || {}).resources || []).join(", ")),
                                react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                                react_1.default.createElement("b", null, "Effect"),
                                react_1.default.createElement("p", null, (data.policy || {}).effect)) },
                            react_1.default.createElement(eui_1.EuiBadge, { color: "hollow", onClick: () => { }, onClickAriaLabel: `${data.name} policy`, title: null }, data.name)));
                })) ||
                    react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "m" });
            },
            sortable: true,
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
                react_1.default.createElement(buttons_1.WzButtonModalConfirm, { buttonType: 'icon', tooltip: { content: wz_api_utils_1.WzAPIUtils.isReservedID(item.id) ? "Reserved roles can't be deleted" : 'Delete role', position: 'left' }, isDisabled: wz_api_utils_1.WzAPIUtils.isReservedID(item.id), modalTitle: `Do you want to delete the ${item.name} role?`, onConfirm: async () => {
                        try {
                            const response = await wz_request_1.WzRequest.apiReq('DELETE', `/security/roles/`, {
                                params: {
                                    role_ids: item.id
                                }
                            });
                            const data = (response.data || {}).data;
                            if (data.failed_items && data.failed_items.length) {
                                return;
                            }
                            error_handler_1.ErrorHandler.info('Role was successfully deleted');
                            await updateRoles();
                        }
                        catch (error) { }
                    }, modalProps: { buttonColor: 'danger' }, iconType: 'trash', color: 'danger', "aria-label": 'Delete role' })))
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
    return (react_1.default.createElement(eui_1.EuiInMemoryTable, { items: roles, columns: columns, search: search, pagination: true, rowProps: getRowProps, loading: loading, sorting: sorting }));
};
