"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersTable = void 0;
const react_1 = __importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const buttons_1 = require("../../../common/buttons");
const services_1 = __importDefault(require("../services"));
const error_handler_1 = require("../../../../react-services/error-handler");
const wz_api_utils_1 = require("../../../../react-services/wz-api-utils");
exports.UsersTable = ({ users, editUserFlyover, rolesLoading, roles, onSave }) => {
    const getRowProps = item => {
        const { id } = item;
        return {
            'data-test-subj': `row-${id}`,
            onClick: () => editUserFlyover(item),
        };
    };
    const columns = [
        {
            field: 'username',
            name: 'User',
            sortable: true,
            truncateText: true,
        },
        {
            field: 'allow_run_as',
            name: 'Allow run as ',
            sortable: true,
            truncateText: true,
        },
        {
            field: 'roles',
            name: 'Roles',
            dataType: 'boolean',
            render: userRoles => {
                if (rolesLoading) {
                    return react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "m" });
                }
                if (!userRoles || !userRoles.length)
                    return react_1.default.createElement(react_1.default.Fragment, null);
                const tmpRoles = userRoles.map((userRole, idx) => {
                    return (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, key: idx },
                        react_1.default.createElement(eui_1.EuiBadge, { color: "secondary" }, roles[userRole])));
                });
                return (react_1.default.createElement(eui_1.EuiFlexGroup, { wrap: true, responsive: false, gutterSize: "xs" }, tmpRoles));
            },
            sortable: true,
        },
        {
            align: 'right',
            width: '5%',
            name: 'Actions',
            render: item => (react_1.default.createElement("div", { onClick: ev => ev.stopPropagation() },
                react_1.default.createElement(buttons_1.WzButtonModalConfirm, { buttonType: "icon", tooltip: {
                        content: wz_api_utils_1.WzAPIUtils.isReservedID(item.id) ? "Reserved users can't be deleted" : 'Delete user',
                        position: 'left',
                    }, isDisabled: wz_api_utils_1.WzAPIUtils.isReservedID(item.id), modalTitle: `Do you want to delete ${item.username} user?`, onConfirm: async () => {
                        try {
                            await services_1.default.DeleteUsers([item.id]);
                            error_handler_1.ErrorHandler.info('User was successfully deleted');
                            onSave();
                        }
                        catch (err) {
                            error_handler_1.ErrorHandler.handle(err, 'Error deleting the user');
                        }
                    }, modalProps: { buttonColor: 'danger' }, iconType: "trash", color: "danger", "aria-label": "Delete user", modalCancelText: "Cancel", modalConfirmText: "Confirm" }))),
        },
    ];
    const sorting = {
        sort: {
            field: 'username',
            direction: eui_1.SortDirection.ASC,
        },
    };
    const search = {
        box: {
            incremental: false,
            schema: true,
        },
    };
    return (react_1.default.createElement(eui_1.EuiInMemoryTable, { items: users, columns: columns, search: search, rowProps: getRowProps, pagination: true, sorting: sorting }));
};
