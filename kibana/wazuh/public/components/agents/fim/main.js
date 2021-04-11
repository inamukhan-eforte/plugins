"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainFim = void 0;
const react_1 = __importDefault(require("react"));
const index_1 = require("./index");
require("../../common/modules/module.less");
const react_redux_1 = require("react-redux");
const prompt_no_selected_agent_1 = require("../prompt-no-selected-agent");
const prompt_no_active_agent_1 = require("../prompt-no-active-agent");
const redux_1 = require("redux");
const hocs_1 = require("../../common/hocs");
const mapStateToProps = state => ({
    currentAgentData: state.appStateReducers.currentAgentData
});
exports.MainFim = redux_1.compose(react_redux_1.connect(mapStateToProps), hocs_1.withGuard(props => !(props.currentAgentData && props.currentAgentData.id) && !props.agent, () => react_1.default.createElement(prompt_no_selected_agent_1.PromptNoSelectedAgent, { body: 'You need to select an agent to see Integrity Monitoring inventory.' })), hocs_1.withGuard(props => {
    const agentData = (props.currentAgentData && props.currentAgentData.id) ? props.currentAgentData : props.agent;
    return agentData.status !== 'active';
}, () => react_1.default.createElement(prompt_no_active_agent_1.PromptNoActiveAgent, null)))(function MainFim({ currentAgentData, agent, ...rest }) {
    const agentData = (currentAgentData && currentAgentData.id) ? currentAgentData : agent;
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(index_1.Inventory, Object.assign({}, rest, { agent: agentData }))));
});
