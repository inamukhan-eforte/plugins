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
exports.Roles = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const roles_table_1 = require("./roles-table");
const wz_request_1 = require("../../../react-services/wz-request");
const create_role_1 = require("./create-role");
const edit_role_1 = require("./edit-role");
exports.Roles = () => {
    const [isFlyoutVisible, setIsFlyoutVisible] = react_1.useState(false);
    const [isEditFlyoutVisible, setIsEditFlyoutVisible] = react_1.useState(false);
    const [editingRole, setEditingRole] = react_1.useState(false);
    const [roles, setRoles] = react_1.useState([]);
    const [policiesData, setPoliciesData] = react_1.useState([]);
    const [loadingTable, setLoadingTable] = react_1.useState(false);
    async function getData() {
        setLoadingTable(true);
        const roles_request = await wz_request_1.WzRequest.apiReq('GET', '/security/roles', {});
        const roles = (((roles_request || {}).data || {}).data || {}).affected_items || [];
        setRoles(roles);
        const policies_request = await wz_request_1.WzRequest.apiReq('GET', '/security/policies', {});
        const policiesData = (((policies_request || {}).data || {}).data || {}).affected_items || [];
        setPoliciesData(policiesData);
        setLoadingTable(false);
    }
    react_1.useEffect(() => {
        getData();
    }, []);
    const closeFlyout = async () => {
        setIsFlyoutVisible(false);
        await getData();
    };
    let flyout;
    if (isFlyoutVisible) {
        flyout = (react_1.default.createElement(eui_1.EuiOverlayMask, { headerZindexLocation: "below", onClick: () => { setIsFlyoutVisible(false); } },
            react_1.default.createElement(create_role_1.CreateRole, { closeFlyout: closeFlyout })));
    }
    const editRole = (item) => {
        setEditingRole(item);
        setIsEditFlyoutVisible(true);
    };
    const closeEditingFlyout = async () => {
        setIsEditFlyoutVisible(false);
        await getData();
    };
    let editFlyout;
    if (isEditFlyoutVisible) {
        editFlyout = (react_1.default.createElement(eui_1.EuiOverlayMask, { headerZindexLocation: "below", onClick: async () => { await closeEditingFlyout(); } },
            react_1.default.createElement(edit_role_1.EditRole, { role: editingRole, closeFlyout: closeEditingFlyout })));
    }
    return (react_1.default.createElement(eui_1.EuiPageContent, null,
        react_1.default.createElement(eui_1.EuiPageContentHeader, null,
            react_1.default.createElement(eui_1.EuiPageContentHeaderSection, null,
                react_1.default.createElement(eui_1.EuiTitle, null,
                    react_1.default.createElement("h2", null, "Roles"))),
            react_1.default.createElement(eui_1.EuiPageContentHeaderSection, null,
                react_1.default.createElement("div", null,
                    react_1.default.createElement(eui_1.EuiButton, { onClick: () => setIsFlyoutVisible(true) }, "Create role"),
                    flyout,
                    editFlyout))),
        react_1.default.createElement(eui_1.EuiPageContentBody, null,
            react_1.default.createElement(roles_table_1.RolesTable, { loading: loadingTable, roles: roles, policiesData: policiesData, editRole: editRole, updateRoles: getData }))));
};
