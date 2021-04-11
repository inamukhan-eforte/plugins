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
exports.RolesMapping = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const roles_mapping_table_1 = require("./components/roles-mapping-table");
const roles_mapping_edit_1 = require("./components/roles-mapping-edit");
const roles_mapping_create_1 = require("./components/roles-mapping-create");
const error_handler_1 = require("../../../react-services/error-handler");
const wazuh_security_1 = require("../../../factories/wazuh-security");
const useApiService_1 = require("../../common/hooks/useApiService");
const services_1 = __importDefault(require("../roles/services"));
const services_2 = __importDefault(require("../rules/services"));
const react_redux_1 = require("react-redux");
exports.RolesMapping = () => {
    const [isEditingRule, setIsEditingRule] = react_1.useState(false);
    const [isCreatingRule, setIsCreatingRule] = react_1.useState(false);
    const [rules, setRules] = react_1.useState([]);
    const [loadingTable, setLoadingTable] = react_1.useState(true);
    const [selectedRule, setSelectedRule] = react_1.useState({});
    const [rolesEquivalences, setRolesEquivalences] = react_1.useState({});
    const [rolesLoading, roles, rolesError] = useApiService_1.useApiService(services_1.default.GetRoles, {});
    const [internalUsers, setInternalUsers] = react_1.useState([]);
    const currentPlatform = react_redux_1.useSelector((state) => state.appStateReducers.currentPlatform);
    react_1.useEffect(() => {
        initData();
    }, []);
    react_1.useEffect(() => {
        if (!rolesLoading && (roles || [])) {
            const _rolesObject = (roles || []).reduce((rolesObj, role) => ({ ...rolesObj, [role.id]: role.name }), {});
            setRolesEquivalences(_rolesObject);
        }
        if (rolesError) {
            error_handler_1.ErrorHandler.handle('There was an error loading roles');
        }
    }, [rolesLoading]);
    const getInternalUsers = async () => {
        try {
            const wazuhSecurity = new wazuh_security_1.WazuhSecurity();
            const users = await wazuhSecurity.security.getUsers();
            const _users = users.map((item, idx) => {
                return {
                    id: idx,
                    user: item.username,
                    roles: [],
                    full_name: item.full_name,
                    email: item.email,
                };
            }).sort((a, b) => (a.user > b.user) ? 1 : (a.user < b.user) ? -1 : 0);
            setInternalUsers(_users);
        }
        catch (error) {
            error_handler_1.ErrorHandler.handle('There was an error loading internal users');
        }
    };
    const getRules = async () => {
        try {
            const _rules = await services_2.default.GetRules();
            setRules(_rules);
        }
        catch (error) {
            error_handler_1.ErrorHandler.handle('There was an error loading rules');
        }
    };
    const initData = async () => {
        setLoadingTable(true);
        await getRules();
        if (currentPlatform !== "elastic") {
            await getInternalUsers();
        }
        setLoadingTable(false);
    };
    const updateRoles = async () => {
        await getRules();
    };
    let editFlyout;
    if (isEditingRule) {
        editFlyout = (react_1.default.createElement(eui_1.EuiOverlayMask, { headerZindexLocation: "below", onClick: () => {
                setIsEditingRule(false);
            } },
            react_1.default.createElement(roles_mapping_edit_1.RolesMappingEdit, { rule: selectedRule, closeFlyout: isVisible => {
                    setIsEditingRule(isVisible);
                    initData();
                }, rolesEquivalences: rolesEquivalences, roles: roles, internalUsers: internalUsers, onSave: async () => await updateRoles(), currentPlatform: currentPlatform })));
    }
    let createFlyout;
    if (isCreatingRule) {
        editFlyout = (react_1.default.createElement(eui_1.EuiOverlayMask, { headerZindexLocation: "below", onClick: () => {
                setIsCreatingRule(false);
            } },
            react_1.default.createElement(roles_mapping_create_1.RolesMappingCreate, { closeFlyout: isVisible => {
                    setIsCreatingRule(isVisible);
                    initData();
                }, rolesEquivalences: rolesEquivalences, roles: roles, internalUsers: internalUsers, onSave: async () => await updateRoles(), currentPlatform: currentPlatform })));
    }
    return (react_1.default.createElement(eui_1.EuiPageContent, null,
        react_1.default.createElement(eui_1.EuiPageContentHeader, null,
            react_1.default.createElement(eui_1.EuiPageContentHeaderSection, null,
                react_1.default.createElement(eui_1.EuiTitle, null,
                    react_1.default.createElement("h2", null, "Role mapping"))),
            react_1.default.createElement(eui_1.EuiPageContentHeaderSection, null,
                react_1.default.createElement("div", null,
                    react_1.default.createElement(eui_1.EuiButton, { onClick: () => setIsCreatingRule(true) }, "Create Role mapping"),
                    createFlyout,
                    editFlyout))),
        react_1.default.createElement(eui_1.EuiPageContentBody, null,
            react_1.default.createElement(roles_mapping_table_1.RolesMappingTable, { rolesEquivalences: rolesEquivalences, loading: loadingTable || rolesLoading, rules: rules, editRule: item => {
                    setSelectedRule(item);
                    setIsEditingRule(true);
                }, updateRules: async () => await updateRoles() }))));
};
