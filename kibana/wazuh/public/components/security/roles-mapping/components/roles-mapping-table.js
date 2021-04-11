"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesMappingTable = void 0;
const react_1 = __importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const error_handler_1 = require("../../../../react-services/error-handler");
const buttons_1 = require("../../../common/buttons");
const wz_api_utils_1 = require("../../../../react-services/wz-api-utils");
const services_1 = __importDefault(require("../../rules/services"));
exports.RolesMappingTable = ({ rolesEquivalences, rules, loading, editRule, updateRules }) => {
    const getRowProps = item => {
        const { id } = item;
        return {
            'data-test-subj': `row-${id}`,
            onClick: () => editRule(item),
        };
    };
    const columns = [
        {
            field: 'id',
            name: 'ID',
            width: '75',
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
            field: 'roles',
            name: 'Roles',
            sortable: true,
            render: item => {
                const tmpRoles = item.map((role, idx) => {
                    return (react_1.default.createElement(eui_1.EuiFlexItem, { key: `role_${idx}`, grow: false },
                        react_1.default.createElement(eui_1.EuiBadge, { color: "secondary" }, rolesEquivalences[role])));
                });
                return (react_1.default.createElement(eui_1.EuiFlexGroup, { wrap: true, responsive: false, gutterSize: "xs" }, tmpRoles));
            },
            truncateText: true,
        },
        {
            field: 'id',
            name: 'Status',
            render(item, obj) {
                if (wz_api_utils_1.WzAPIUtils.isReservedID(item)) {
                    if ((obj.id === 1 || obj.id === 2)) {
                        return (react_1.default.createElement(eui_1.EuiFlexGroup, null,
                            react_1.default.createElement(eui_1.EuiBadge, { color: "primary" }, "Reserved"),
                            react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: "wui_ rules belong to wazuh-wui API user" },
                                react_1.default.createElement(eui_1.EuiBadge, { color: "accent", title: "", style: { marginLeft: 10 } }, "wazuh-wui"))));
                    }
                    else
                        return react_1.default.createElement(eui_1.EuiBadge, { color: "primary" }, "Reserved");
                }
            },
            width: '300',
            sortable: false,
        },
        {
            align: 'right',
            width: '5%',
            name: 'Actions',
            render: item => (react_1.default.createElement("div", { onClick: ev => ev.stopPropagation() },
                react_1.default.createElement(buttons_1.WzButtonModalConfirm, { buttonType: "icon", tooltip: {
                        content: wz_api_utils_1.WzAPIUtils.isReservedID(item.id) ? "Reserved role mapping can't be deleted" : 'Delete role mapping',
                        position: 'left',
                    }, isDisabled: wz_api_utils_1.WzAPIUtils.isReservedID(item.id), modalTitle: `Do you want to delete the ${item.name} role mapping?`, onConfirm: async () => {
                        try {
                            await services_1.default.DeleteRules([item.id]);
                            error_handler_1.ErrorHandler.info('Role mapping was successfully deleted');
                            updateRules();
                        }
                        catch (err) {
                            error_handler_1.ErrorHandler.handle(err, 'Error deleting the role mapping');
                        }
                    }, modalProps: { buttonColor: 'danger' }, iconType: "trash", color: "danger", "aria-label": "Delete role mapping", modalCancelText: "Cancel", modalConfirmText: "Confirm" }))),
        },
    ];
    const sorting = {
        sort: {
            field: 'id',
            direction: eui_1.SortDirection.ASC,
        },
    };
    const search = {
        box: {
            incremental: false,
            schema: true,
        },
    };
    return (react_1.default.createElement(eui_1.EuiInMemoryTable, { items: rules || [], columns: columns, search: search, rowProps: getRowProps, pagination: true, loading: loading, sorting: sorting }));
};
