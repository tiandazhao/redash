import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Link from "@/components/Link";
import TimeAgo from "@/components/TimeAgo";
import { Alert as AlertType } from "@/components/proptypes";

import Form from "antd/lib/form";
import Button from "antd/lib/button";
import Tooltip from "@/components/Tooltip";
import AntAlert from "antd/lib/alert";
import * as Grid from "antd/lib/grid";

import Title from "./components/Title";
import Criteria from "./components/Criteria";
import Rearm from "./components/Rearm";
import Query from "./components/Query";
import AlertDestinations from "./components/AlertDestinations";
import HorizontalFormItem from "./components/HorizontalFormItem";
import { STATE_CLASS } from "../alerts/AlertsList";
import DynamicComponent from "@/components/DynamicComponent";

function AlertState({ state, lastTriggered }) {
  return (
    <div className="alert-state">
      <span className={`alert-state-indicator label ${STATE_CLASS[state]}`}>状态: {state}</span>
      {state === "unknown" && <div className="ant-form-item-explain">提醒设置已确认。</div>}
      {lastTriggered && (
        <div className="ant-form-item-explain">
          最后触发时间{" "}
          <span className="alert-last-triggered">
            <TimeAgo date={lastTriggered} />
          </span>
        </div>
      )}
    </div>
  );
}

AlertState.propTypes = {
  state: PropTypes.string.isRequired,
  lastTriggered: PropTypes.string,
};

AlertState.defaultProps = {
  lastTriggered: null,
};

// eslint-disable-next-line react/prefer-stateless-function
export default class AlertView extends React.Component {
  state = {
    unmuting: false,
  };

  unmute = () => {
    this.setState({ unmuting: true });
    this.props.unmute().finally(() => {
      this.setState({ unmuting: false });
    });
  };

  render() {
    const { alert, queryResult, canEdit, onEdit, menuButton } = this.props;
    const { query, name, options, rearm } = alert;

    return (
      <>
        <Title name={name} alert={alert}>
          <DynamicComponent name="AlertView.HeaderExtra" alert={alert} />
          <Tooltip title={canEdit ? "" : "没有权限编辑提醒"}>
            <Button type="default" onClick={canEdit ? onEdit : null} className={cx({ disabled: !canEdit })}>
              <i className="fa fa-edit m-r-5" aria-hidden="true" />
              编辑
            </Button>
            {menuButton}
          </Tooltip>
        </Title>
        <div className="bg-white tiled p-20">
          <Grid.Row type="flex" gutter={16}>
            <Grid.Col xs={24} md={16} className="d-flex">
              <Form className="flex-fill">
                <HorizontalFormItem>
                  <AlertState state={alert.state} lastTriggered={alert.last_triggered_at} />
                </HorizontalFormItem>
                <HorizontalFormItem label="查询">
                  <Query query={query} queryResult={queryResult} />
                </HorizontalFormItem>
                {queryResult && options && (
                  <>
                    <HorizontalFormItem label="触发条件" className="alert-criteria">
                      <Criteria
                        columnNames={queryResult.getColumnNames()}
                        resultValues={queryResult.getData()}
                        alertOptions={options}
                      />
                    </HorizontalFormItem>
                    <HorizontalFormItem label="发送通知" className="form-item-line-height-normal">
                      <Rearm value={rearm || 0} />
                      <br />
                      设为 {options.custom_subject || options.custom_body ? "自定义" : "默认"} 通知模板。
                    </HorizontalFormItem>
                  </>
                )}
              </Form>
            </Grid.Col>
            <Grid.Col xs={24} md={8}>
              {options.muted && (
                <AntAlert
                  className="m-b-20"
                  message={
                    <>
                      <i className="fa fa-bell-slash-o" aria-hidden="true" /> 通知设为静音
                    </>
                  }
                  description={
                    <>
                      该提醒不发送通知。
                      <br />
                      {canEdit && (
                        <>
                          点击恢复发送通知
                          <Button
                            size="small"
                            type="primary"
                            onClick={this.unmute}
                            loading={this.state.unmuting}
                            className="m-t-5 m-l-5">
                            恢复有声
                          </Button>
                        </>
                      )}
                    </>
                  }
                  type="warning"
                />
              )}
              <h4>
                目标{" "}
                <Tooltip title="在新标签页打开提醒设置。">
                  <Link href="destinations" target="_blank">
                    <i className="fa fa-external-link f-13" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </Link>
                </Tooltip>
              </h4>
              <AlertDestinations alertId={alert.id} />
            </Grid.Col>
          </Grid.Row>
        </div>
      </>
    );
  }
}

AlertView.propTypes = {
  alert: AlertType.isRequired,
  queryResult: PropTypes.object, // eslint-disable-line react/forbid-prop-types,
  canEdit: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  menuButton: PropTypes.node.isRequired,
  unmute: PropTypes.func,
};

AlertView.defaultProps = {
  queryResult: null,
  unmute: null,
};
