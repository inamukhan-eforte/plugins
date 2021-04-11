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
exports.WzSecurity = void 0;
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const eui_1 = require("@elastic/eui");
const users_1 = require("./users/users");
const roles_1 = require("./roles/roles");
const policies_1 = require("./policies/policies");
const roles_mapping_1 = require("./roles-mapping/roles-mapping");
const hocs_1 = require("../common/hocs");
const redux_1 = require("redux");
const constants_1 = require("../../../util/constants");
const securityActions_1 = require("../../redux/actions/securityActions");
const tabs = [
    {
        id: 'users',
        name: 'Users',
        disabled: false,
    },
    {
        id: 'roles',
        name: 'Roles',
        disabled: false,
    },
    {
        id: 'policies',
        name: 'Policies',
        disabled: false,
    },
    {
        id: 'roleMapping',
        name: 'Roles mapping',
        disabled: false,
    },
];
exports.WzSecurity = redux_1.compose(hocs_1.withReduxProvider, hocs_1.withGlobalBreadcrumb([{ text: '' }, { text: 'Security' }]), hocs_1.withUserAuthorizationPrompt(null, [constants_1.WAZUH_ROLE_ADMINISTRATOR_NAME]))(() => {
    const dispatch = react_redux_1.useDispatch();
    // Get the initial tab when the component is initiated
    const securityTabRegExp = new RegExp(`tab=(${tabs.map(tab => tab.id).join('|')})`);
    const tab = window.location.href.match(securityTabRegExp);
    const [selectedTabId, setSelectedTabId] = react_1.useState(tab && tab[1] || 'users');
    const listenerLocationChanged = () => {
        const tab = window.location.href.match(securityTabRegExp);
        setSelectedTabId(tab && tab[1] || 'users');
    };
    // This allows to redirect to a Security tab if you click a Security link in menu when you're already in a Security section 
    react_1.useEffect(() => {
        window.addEventListener('popstate', listenerLocationChanged);
        return () => window.removeEventListener('popstate', listenerLocationChanged);
    });
    react_1.useEffect(() => {
        dispatch(securityActions_1.updateSecuritySection(selectedTabId));
    });
    const onSelectedTabChanged = id => {
        window.location.href = window.location.href.replace(`tab=${selectedTabId}`, `tab=${id}`);
        setSelectedTabId(id);
    };
    const renderTabs = () => {
        return tabs.map((tab, index) => (react_1.default.createElement(eui_1.EuiTab, Object.assign({}, (tab.href && { href: tab.href, target: '_blank' }), { onClick: () => onSelectedTabChanged(tab.id), isSelected: tab.id === selectedTabId, disabled: tab.disabled, key: index }), tab.name)));
    };
    return (react_1.default.createElement(eui_1.EuiPage, null,
        react_1.default.createElement(eui_1.EuiFlexGroup, null,
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(eui_1.EuiTabs, null, renderTabs()),
                react_1.default.createElement(eui_1.EuiSpacer, { size: 'm' }),
                selectedTabId === 'users' &&
                    react_1.default.createElement(users_1.Users, null),
                selectedTabId === 'roles' &&
                    react_1.default.createElement(roles_1.Roles, null),
                selectedTabId === 'policies' &&
                    react_1.default.createElement(policies_1.Policies, null),
                selectedTabId === 'roleMapping' &&
                    react_1.default.createElement(roles_mapping_1.RolesMapping, null)))));
});
