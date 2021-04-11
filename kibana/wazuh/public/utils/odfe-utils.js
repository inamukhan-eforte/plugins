"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOdfeSessionExpired = void 0;
const isAuthenticationRequired = (e) => {
    const statusCode = e.statusCode && e.statusCode === 401;
    const error = e.error && e.error === 'Unauthorized';
    const message = e.message && e.message === 'Authentication required';
    return statusCode && error && message;
};
exports.checkOdfeSessionExpired = (error) => {
    const { data } = (error || {}).response || {};
    if (isAuthenticationRequired(data)) {
        location.reload();
    }
};
