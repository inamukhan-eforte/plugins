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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const users_table_1 = require("./components/users-table");
const create_user_1 = require("./components/create-user");
const edit_user_1 = require("./components/edit-user");
const services_1 = __importDefault(require("./services"));
const services_2 = __importDefault(require("../roles/services"));
const useApiService_1 = require("../../common/hooks/useApiService");
exports.Users = () => {
    const [isEditFlyoutVisible, setIsEditFlyoutVisible] = react_1.useState(false);
    const [isCreateFlyoutVisible, setIsCreateFlyoutVisible] = react_1.useState(false);
    const [editingUser, setEditingUser] = react_1.useState({});
    const [users, setUsers] = react_1.useState([]);
    const [rolesLoading, roles, rolesError] = useApiService_1.useApiService(services_2.default.GetRoles, {});
    const [securityError, setSecurityError] = react_1.useState(false);
    const [rolesObject, setRolesObject] = react_1.useState({});
    const getUsers = async () => {
        const _users = await services_1.default.GetUsers().catch(error => {
            setUsers([]);
            setSecurityError(true);
        });
        setUsers(_users);
    };
    react_1.useEffect(() => {
        if (!rolesLoading && (roles || []).length) {
            const _rolesObject = (roles || []).reduce((rolesObj, role) => ({ ...rolesObj, [role.id]: role.name }), {});
            setRolesObject(_rolesObject);
        }
        if (rolesError) {
            setSecurityError(true);
        }
    }, [rolesLoading]);
    react_1.useEffect(() => {
        getUsers();
    }, []);
    let editFlyout, createFlyout;
    const closeEditFlyout = async (refresh) => {
        if (refresh)
            await getUsers();
        setIsEditFlyoutVisible(false);
    };
    const closeCreateFlyout = async (refresh) => {
        if (refresh)
            await getUsers();
        setIsCreateFlyoutVisible(false);
    };
    if (securityError) {
        return (react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "securityApp", title: react_1.default.createElement("h2", null, "You need permission to manage users"), body: react_1.default.createElement("p", null, "Contact your system administrator.") }));
    }
    if (isEditFlyoutVisible) {
        editFlyout = (react_1.default.createElement(eui_1.EuiOverlayMask, { headerZindexLocation: "below", onClick: () => {
                setIsEditFlyoutVisible(false);
            } },
            react_1.default.createElement(edit_user_1.EditUser, { currentUser: editingUser, closeFlyout: closeEditFlyout, rolesObject: rolesObject })));
    }
    if (isCreateFlyoutVisible) {
        createFlyout = (react_1.default.createElement(eui_1.EuiOverlayMask, { headerZindexLocation: "below", onClick: () => {
                setIsCreateFlyoutVisible(false);
            } },
            react_1.default.createElement(create_user_1.CreateUser, { closeFlyout: closeCreateFlyout })));
    }
    const showEditFlyover = item => {
        setEditingUser(item);
        setIsEditFlyoutVisible(true);
    };
    return (react_1.default.createElement(eui_1.EuiPageContent, null,
        react_1.default.createElement(eui_1.EuiPageContentHeader, null,
            react_1.default.createElement(eui_1.EuiPageContentHeaderSection, null,
                react_1.default.createElement(eui_1.EuiTitle, null,
                    react_1.default.createElement("h2", null, "Users"))),
            react_1.default.createElement(eui_1.EuiPageContentHeaderSection, null,
                react_1.default.createElement("div", null,
                    react_1.default.createElement(eui_1.EuiButton, { onClick: () => setIsCreateFlyoutVisible(true) }, "Create user"),
                    createFlyout))),
        react_1.default.createElement(eui_1.EuiPageContentBody, null,
            react_1.default.createElement(users_table_1.UsersTable, { users: users, editUserFlyover: showEditFlyover, rolesLoading: rolesLoading, roles: rolesObject, onSave: async () => await getUsers() })),
        editFlyout));
};
