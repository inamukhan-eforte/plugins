/*
 * Quintom app - React component for building the management welcome screen.
 *
 * Copyright (C) 2021 Quintom.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import React, { Component } from 'react';
import {
  EuiCard,
  EuiIcon,
  EuiPanel,
  EuiFlexItem,
  EuiFlexGroup,
  EuiSpacer,
  EuiPage
} from '@elastic/eui';
import { updateGlobalBreadcrumb } from '../../../redux/actions/globalBreadcrumbActions';
import store from '../../../redux/store';

import { updateManagementSection } from '../../../redux/actions/managementActions';
import WzReduxProvider from '../../../redux/wz-redux-provider';
import { connect } from 'react-redux';

class ManagementWelcome extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  setGlobalBreadcrumb() {
    const breadcrumb = [{ text: '' }, { text: 'Management' }];
    store.dispatch(updateGlobalBreadcrumb(breadcrumb));
  }

  async componentDidMount() {
    this.setGlobalBreadcrumb();
  }

  switchSection(section) {
    this.props.switchTab(section, true);
    this.props.updateManagementSection(section);
  }

  render() {
    return (
      <WzReduxProvider>
        <EuiPage className="wz-welcome-page">
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiPanel betaBadgeLabel="Administration">
                <EuiSpacer size="m" />
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiCard
                      layout="horizontal"
                      className="homSynopsis__card"
                      icon={
                        <EuiIcon
                          size="xl"
                          type="indexRollupApp"
                          color="primary"
                        />
                      }
                      title="Rules"
                      onClick={() => this.switchSection('rules')}
                      description="Manage your Quintom cluster rules."
                    />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiCard
                      layout="horizontal"
                      className="homSynopsis__card"
                      icon={
                        <EuiIcon
                          size="xl"
                          type="indexRollupApp"
                          color="primary"
                        />
                      }
                      title="Decoders"
                      onClick={() => this.switchSection('decoders')}
                      description="Manage your Quintom cluster decoders."
                    />
                  </EuiFlexItem>
                </EuiFlexGroup>
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiCard
                      layout="horizontal"
                      className="homSynopsis__card"
                      icon={
                        <EuiIcon
                          size="xl"
                          type="indexRollupApp"
                          color="primary"
                        />
                      }
                      title="CDB lists"
                      onClick={() => this.switchSection('lists')}
                      description="Manage your Quintom cluster CDB lists."
                    />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiCard
                      layout="horizontal"
                      className="homSynopsis__card"
                      icon={
                        <EuiIcon
                          size="xl"
                          type="usersRolesApp"
                          color="primary"
                        />
                      }
                      title="Groups"
                      onClick={() => this.switchSection('groups')}
                      description="Manage your agent groups."
                    />
                  </EuiFlexItem>
                </EuiFlexGroup>
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiCard
                      layout="horizontal"
                      className="homSynopsis__card"
                      icon={
                        <EuiIcon size="xl" type="devToolsApp" color="primary" />
                      }
                      title="Configuration"
                      onClick={() => this.switchSection('configuration')}
                      description="Manage your Quintom cluster configuration."
                    />
                  </EuiFlexItem>
                  <EuiFlexItem />
                </EuiFlexGroup>
              </EuiPanel>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiPanel betaBadgeLabel="Status and reports">
                <EuiSpacer size="m" />
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiCard
                      layout="horizontal"
                      className="homSynopsis__card"
                      icon={
                        <EuiIcon size="xl" type="uptimeApp" color="primary" />
                      }
                      title="Status"
                      onClick={() => this.switchSection('status')}
                      description="Manage your Quintom cluster status."
                    />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiCard
                      layout="horizontal"
                      className="homSynopsis__card"
                      icon={
                        <EuiIcon
                          size="xl"
                          type="indexPatternApp"
                          color="primary"
                        />
                      }
                      title="Cluster"
                      onClick={() => this.switchSection('monitoring')}
                      description="Visualize your Quintom cluster."
                    />
                  </EuiFlexItem>
                </EuiFlexGroup>
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiCard
                      layout="horizontal"
                      className="homSynopsis__card"
                      icon={
                        <EuiIcon size="xl" type="filebeatApp" color="primary" />
                      }
                      title="Logs"
                      onClick={() => this.switchSection('logs')}
                      description="Logs from your Quintom cluster."
                    />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiCard
                      layout="horizontal"
                      className="homSynopsis__card"
                      icon={
                        <EuiIcon
                          size="xl"
                          type="reportingApp"
                          color="primary"
                        />
                      }
                      title="Reporting"
                      onClick={() => this.switchSection('reporting')}
                      description="Check your stored Quintom reports."
                    />
                  </EuiFlexItem>
                </EuiFlexGroup>
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiCard
                      layout="horizontal"
                      className="homSynopsis__card"
                      icon={
                        <EuiIcon size="xl" type="visualizeApp" color="primary" />
                      }
                      title="Statistics"
                      onClick={() => this.switchSection('statistics')}
                      description="Information about the Quintom environment"
                    />
                  </EuiFlexItem>
                  <EuiFlexItem>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiPanel>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPage>
      </WzReduxProvider>
    );
  }
}


const mapDispatchToProps = dispatch => {
  return {
    updateManagementSection: section =>
      dispatch(updateManagementSection(section))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ManagementWelcome);
