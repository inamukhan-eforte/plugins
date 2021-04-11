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
exports.CreateUser = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const useApiService_1 = require("../../../common/hooks/useApiService");
const services_1 = __importDefault(require("../services"));
const services_2 = __importDefault(require("../../roles/services"));
const error_handler_1 = require("../../../../react-services/error-handler");
const useDebouncedEffect_1 = require("../../../common/hooks/useDebouncedEffect");
exports.CreateUser = ({ closeFlyout }) => {
    const [selectedRoles, setSelectedRole] = react_1.useState([]);
    const [rolesLoading, roles, rolesError] = useApiService_1.useApiService(services_2.default.GetRoles, {});
    const rolesOptions = roles
        ? roles.map(item => {
            return { label: item.name, id: item.id };
        })
        : [];
    const [isLoading, setIsLoading] = react_1.useState(false);
    const [userName, setUserName] = react_1.useState('');
    const [password, setPassword] = react_1.useState('');
    const [confirmPassword, setConfirmPassword] = react_1.useState('');
    const [allowRunAs, setAllowRunAs] = react_1.useState(false);
    const [formErrors, setFormErrors] = react_1.useState({
        userName: '',
        password: '',
        confirmPassword: '',
    });
    const [showApply, setShowApply] = react_1.useState(false);
    const userNameRef = react_1.useRef(false);
    useDebouncedEffect_1.useDebouncedEffect(() => {
        if (userNameRef.current)
            validateFields(['userName']);
        else
            userNameRef.current = true;
    }, 300, [userName]);
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
        setShowApply(isValidForm(false));
    }, 300, [userName, password, confirmPassword]);
    const validations = {
        userName: [
            { fn: () => (userName.trim() === '' ? 'The user name is required' : '') },
            {
                fn: () => !userName.match(/^.{4,20}$/)
                    ? 'The user name must contain a length between 4 and 20 characters.'
                    : '',
            },
        ],
        password: [
            { fn: () => (password === '' ? 'The password is required' : '') },
            {
                fn: () => !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/)
                    ? 'The password must contain a length between 8 and 64 characters, and must contain at least one upper and lower case letter, a number and a symbol.'
                    : '',
            },
        ],
        confirmPassword: [
            { fn: () => (confirmPassword === '' ? 'The confirm password is required' : '') },
            { fn: () => (confirmPassword !== password ? `Passwords don't match.` : '') },
        ],
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
            username: userName,
            password: password,
            allow_run_as: allowRunAs,
        };
        try {
            const user = await services_1.default.CreateUser(userData);
            await addRoles(user.id);
            error_handler_1.ErrorHandler.info('User was successfully created');
            closeFlyout(true);
        }
        catch (error) {
            error_handler_1.ErrorHandler.handle(error, 'There was an error');
            setIsLoading(false);
        }
    };
    const addRoles = async (userId) => {
        const formattedRoles = selectedRoles.map(item => {
            return item.id;
        });
        if (formattedRoles.length > 0)
            await services_1.default.AddUserRoles(userId, formattedRoles);
    };
    const onChangeRoles = selectedRoles => {
        setSelectedRole(selectedRoles);
    };
    const onChangeUserName = e => {
        setUserName(e.target.value);
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
                react_1.default.createElement("h2", null, "Create new user"))),
        react_1.default.createElement(eui_1.EuiFlyoutBody, null,
            react_1.default.createElement(eui_1.EuiForm, { component: "form", style: { padding: 24 } },
                react_1.default.createElement(eui_1.EuiPanel, null,
                    react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                        react_1.default.createElement("h2", null, "User data")),
                    react_1.default.createElement(eui_1.EuiSpacer, null),
                    react_1.default.createElement(eui_1.EuiFormRow, { label: "User name", isInvalid: !!formErrors.userName, error: formErrors.userName, helpText: "Introduce the user name for the user." },
                        react_1.default.createElement(eui_1.EuiFieldText, { placeholder: "User name", value: userName, onChange: e => onChangeUserName(e), "aria-label": "", isInvalid: !!formErrors.userName })),
                    react_1.default.createElement(eui_1.EuiFormRow, { label: "Password", isInvalid: !!formErrors.password, error: formErrors.password, helpText: "Introduce a new password for the user." },
                        react_1.default.createElement(eui_1.EuiFieldPassword, { placeholder: "Password", value: password, onChange: e => onChangePassword(e), "aria-label": "", isInvalid: !!formErrors.password })),
                    react_1.default.createElement(eui_1.EuiFormRow, { label: "Confirm Password", isInvalid: !!formErrors.confirmPassword, error: formErrors.confirmPassword, helpText: "Confirm the new password." },
                        react_1.default.createElement(eui_1.EuiFieldPassword, { placeholder: "Confirm Password", value: confirmPassword, onChange: e => onChangeConfirmPassword(e), "aria-label": "", isInvalid: !!formErrors.confirmPassword })),
                    react_1.default.createElement(eui_1.EuiFormRow, { label: "Allow run as", helpText: "Set if the user is able to use run as" },
                        react_1.default.createElement(eui_1.EuiSwitch, { label: "Allow run as", showLabel: false, checked: allowRunAs, onChange: e => onChangeAllowRunAs(e), "aria-label": "" }))),
                react_1.default.createElement(eui_1.EuiSpacer, null),
                react_1.default.createElement(eui_1.EuiPanel, null,
                    react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                        react_1.default.createElement("h2", null, "User roles")),
                    react_1.default.createElement(eui_1.EuiFormRow, { label: "", helpText: "Assign roles to the selected user" },
                        react_1.default.createElement(eui_1.EuiComboBox, { placeholder: "Select roles", options: rolesOptions, selectedOptions: selectedRoles, isLoading: rolesLoading || isLoading, onChange: onChangeRoles, isClearable: true, "data-test-subj": "demoComboBox" }))),
                react_1.default.createElement(eui_1.EuiSpacer, null),
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiButton, { fill: true, isLoading: isLoading, onClick: editUser, isDisabled: !showApply }, "Apply")))))));
};
