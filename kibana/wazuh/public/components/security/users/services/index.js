"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_users_service_1 = __importDefault(require("./get-users.service"));
const create_user_service_1 = __importDefault(require("./create-user.service"));
const update_user_service_1 = __importDefault(require("./update-user.service"));
const delete_users_service_1 = __importDefault(require("./delete-users.service"));
const add_user_roles_service_1 = __importDefault(require("./add-user-roles.service"));
const remove_user_roles_service_1 = __importDefault(require("./remove-user-roles.service"));
exports.default = {
    GetUsers: get_users_service_1.default,
    CreateUser: create_user_service_1.default,
    UpdateUser: update_user_service_1.default,
    DeleteUsers: delete_users_service_1.default,
    AddUserRoles: add_user_roles_service_1.default,
    RemoveUserRoles: remove_user_roles_service_1.default,
};
