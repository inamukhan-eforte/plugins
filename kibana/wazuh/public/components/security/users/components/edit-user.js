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
exports.EditUser = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const useApiService_1 = require("../../../common/hooks/useApiService");
const services_1 = __importDefault(require("../services"));
const services_2 = __importDefault(require("../../roles/services"));
const error_handler_1 = require("../../../../react-services/error-handler");
const wz_api_utils_1 = require("../../../../react-services/wz-api-utils");
const useDebouncedEffect_1 = require("../../../common/hooks/useDebouncedEffect");
exports.EditUser = ({ currentUser, closeFlyout, rolesObject }) => {
    const userRolesFormatted = currentUser.roles && currentUser.roles.length
        ? currentUser.roles.map(item => ({ label: rolesObject[item], id: item }))
        : [];
    const [selectedRoles, setSelectedRole] = react_1.useState(userRolesFormatted);
    const [rolesLoading, roles, rolesError] = useApiService_1.useApiService(services_2.default.GetRoles, {});
    const rolesOptions = roles
        ? roles.map(item => {
            return { label: item.name, id: item.id };
        })
        : [];
    const [isLoading, setIsLoading] = react_1.useState(false);
    const [password, setPassword] = react_1.useState('');
    const [confirmPassword, setConfirmPassword] = react_1.useState('');
    const [allowRunAs, setAllowRunAs] = react_1.useState(currentUser.allow_run_as);
    const [formErrors, setFormErrors] = react_1.useState({
        password: '',
        confirmPassword: '',
    });
    const [showApply, setShowApply] = react_1.useState(false);
    const passwordRef = react_1.useRef(false);
    useDebouncedEffect_1.useDebouncedEffect(() => {
        if (passwordRef.current)
            validateFields(['password', 'confirmPassword']);
        else
            passwordRef.current = true;
    }, 300, [password]);
    const confirmPasswordRef = react_1.useRef(false);
    useDebouncedEffect_1.useDebouncedEffect(() => {
        if (confirmPasswordRef.current)
            validateFields(['confirmPassword']);
        else
            confirmPasswordRef.current = true;
    }, 300, [confirmPassword]);
    useDebouncedEffect_1.useDebouncedEffect(() => {
        let _showApply = isValidForm(false) &&
            (allowRunAs !== currentUser.allow_run_as ||
                Object.values(getRolesDiff()).some(i => i.length));
        setShowApply(_showApply);
    }, 300, [password, confirmPassword, allowRunAs, selectedRoles]);
    const validations = {
        password: [
            {
                fn: () => password !== '' &&
                    !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/)
                    ? 'The password must contain a length between 8 and 64 characters, and must contain at least one upper and lower case letter, a number and a symbol.'
                    : '',
            },
        ],
        confirmPassword: [{ fn: () => (confirmPassword !== password ? `Passwords don't match.` : '') }],
    };
    const validateFields = (fields, showErrors = true) => {
        const _formErrors = { ...formErrors };
        let isValid = true;
        fields.forEach(field => {
            const error = validations[field].reduce((currentError, validation) => {
                return !!currentError ? currentError : validation.fn();
            }, '');
            _formErrors[field] = error;
            isValid = isValid && !!!error;
        });
        if (showErrors)
            setFormErrors(_formErrors);
        return isValid;
    };
    const isValidForm = (showErrors = true) => {
        return validateFields(Object.keys(validations), showErrors);
    };
    const editUser = async () => {
        if (!isValidForm()) {
            error_handler_1.ErrorHandler.warning('Please resolve the incorrect fields.');
            return;
        }
        setIsLoading(true);
        const userData = {
            allow_run_as: allowRunAs,
        };
        if (password) {
            userData.password = password;
        }
        try {
            await Promise.all([services_1.default.UpdateUser(currentUser.id, userData), updateRoles()]);
            error_handler_1.ErrorHandler.info('User was successfully updated');
            closeFlyout(true);
        }
        catch (error) {
            error_handler_1.ErrorHandler.handle(error, 'There was an error');
            setIsLoading(false);
        }
    };
    const getRolesDiff = () => {
        const formattedRoles = selectedRoles.map(item => item.id);
        const _userRolesFormatted = userRolesFormatted.map(role => role.id);
        const toAdd = formattedRoles.filter(value => !_userRolesFormatted.includes(value));
        const toRemove = _userRolesFormatted.filter(value => !formattedRoles.includes(value));
        return { toAdd, toRemove };
    };
    const updateRoles = async () => {
        const { toAdd, toRemove } = getRolesDiff();
        if (toAdd.length)
            await services_1.default.AddUserRoles(currentUser.id, toAdd);
        if (toRemove.length)
            await services_1.default.RemoveUserRoles(currentUser.id, toRemove);
    };
    const onChangeRoles = selectedRoles => {
        setSelectedRole(selectedRoles);
    };
    const onChangePassword = e => {
        setPassword(e.target.value);
    };
    const onChangeConfirmPassword = e => {
        setConfirmPassword(e.target.value);
    };
    const onChangeAllowRunAs = e => {
        setAllowRunAs(e.target.checked);
    };
    return (react_1.default.createElement(eui_1.EuiFlyout, { onClose: () => closeFlyout() },
        react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: false },
            react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                react_1.default.createElement("h2", null,
                    "Edit ",
                    currentUser.username,
                    " user \u00A0 \u00A0",
                    wz_api_utils_1.WzAPIUtils.isReservedID(currentUser.id) && react_1.default.createElement(eui_1.EuiBadge, { color: "primary" }, "Reserved")))),
        react_1.default.createElement(eui_1.EuiFlyoutBody, null,
            react_1.default.createElement(eui_1.EuiForm, { component: "form", style: { padding: 24 } },
                react_1.default.createElement(eui_1.EuiPanel, null,
                    react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                        react_1.default.createElement("h2", null, "Run as")),
                    react_1.default.createElement(eui_1.EuiFormRow, { label: "", helpText: "Set if the user is able to use run as" },
                        react_1.default.createElement(eui_1.EuiSwitch, { label: "Allow", showLabel: true, checked: allowRunAs, onChange: e => onChangeAllowRunAs(e), "aria-label": "", disabled: wz_api_utils_1.WzAPIUtils.isReservedID(currentUser.id) }))),
                react_1.default.createElement(eui_1.EuiSpacer, null),
                react_1.default.createElement(eui_1.EuiPanel, null,
                    react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                        react_1.default.createElement("h2", null, "Password")),
                    react_1.default.createElement(eui_1.EuiFormRow, { label: "", isInvalid: !!formErrors.password, error: formErrors.password, helpText: "Introduce a new password for the user." },
                        react_1.default.createElement(eui_1.EuiFieldPassword, { placeholder: "Password", value: password, onChange: e => onChangePassword(e), "aria-label": "", isInvalid: !!formErrors.password, disabled: wz_api_utils_1.WzAPIUtils.isReservedID(currentUser.id) })),
                    react_1.default.createElement(eui_1.EuiFormRow, { label: "", isInvalid: !!formErrors.confirmPassword, error: formErrors.confirmPassword, helpText: "Confirm the new password." },
                        react_1.default.createElement(eui_1.EuiFieldPassword, { placeholder: "Confirm Password", value: confirmPassword, onChange: e => onChangeConfirmPassword(e), "aria-label": "", isInvalid: !!formErrors.confirmPassword, disabled: wz_api_utils_1.WzAPIUtils.isReservedID(currentUser.id) }))),
                react_1.default.createElement(eui_1.EuiSpacer, null),
                react_1.default.createElement(eui_1.EuiPanel, null,
                    react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                        react_1.default.createElement("h2", null, "Roles")),
                    react_1.default.createElement(eui_1.EuiFormRow, { label: "", helpText: "Assign roles to the selected user" },
                        react_1.default.createElement(eui_1.EuiComboBox, { placeholder: "Select roles", options: rolesOptions, selectedOptions: selectedRoles, isLoading: rolesLoading || isLoading, onChange: onChangeRoles, isClearable: true, "data-test-subj": "demoComboBox", isDisabled: wz_api_utils_1.WzAPIUtils.isReservedID(currentUser.id) }))),
                react_1.default.createElement(eui_1.EuiSpacer, null),
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiButton, { fill: true, isLoading: isLoading, isDisabled: wz_api_utils_1.WzAPIUtils.isReservedID(currentUser.id) || !showApply, onClick: editUser }, "Apply")))))));
};
