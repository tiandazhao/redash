import React from "react";
import PropTypes from "prop-types";

import HelpTrigger from "@/components/HelpTrigger";
import DynamicComponent from "@/components/DynamicComponent";
import { Alert as AlertType } from "@/components/proptypes";

import Form from "antd/lib/form";
import Button from "antd/lib/button";

import Title from "./components/Title";
import Criteria from "./components/Criteria";
import NotificationTemplate from "./components/NotificationTemplate";
import Rearm from "./components/Rearm";
import Query from "./components/Query";

import HorizontalFormItem from "./components/HorizontalFormItem";

export default class AlertEdit extends React.Component {
  _isMounted = false;

  state = {
    saving: false,
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  save = () => {
    this.setState({ saving: true });
    this.props.save().catch(() => {
      if (this._isMounted) {
        this.setState({ saving: false });
      }
    });
  };

  cancel = () => {
    this.props.cancel();
  };

  render() {
    const { alert, queryResult, pendingRearm, onNotificationTemplateChange, menuButton } = this.props;
    const { onQuerySelected, onNameChange, onRearmChange, onCriteriaChange } = this.props;
    const { query, name, options } = alert;
    const { saving } = this.state;

    return (
      <>
        <Title name={name} alert={alert} onChange={onNameChange} editMode>
          <DynamicComponent name="AlertEdit.HeaderExtra" alert={alert} />
          <Button className="m-r-5" onClick={() => this.cancel()}>
            <i className="fa fa-times m-r-5" aria-hidden="true" />
            取消
          </Button>
          <Button type="primary" onClick={() => this.save()}>
            {saving ? (
              <span role="status" aria-live="polite" aria-relevant="additions removals">
                <i className="fa fa-spinner fa-pulse m-r-5" aria-hidden="true" />
                <span className="sr-only">保存中...</span>
              </span>
            ) : (
              <>
                <i className="fa fa-check m-r-5" aria-hidden="true" />
              </>
            )}
            保存
          </Button>
          {menuButton}
        </Title>
        <div className="bg-white tiled p-20">
          <div className="d-flex">
            <Form className="flex-fill">
              <HorizontalFormItem label="查询">
                <Query query={query} queryResult={queryResult} onChange={onQuerySelected} editMode />
              </HorizontalFormItem>
              {queryResult && options && (
                <>
                  <HorizontalFormItem label="触发条件" className="alert-criteria">
                    <Criteria
                      columnNames={queryResult.getColumnNames()}
                      resultValues={queryResult.getData()}
                      alertOptions={options}
                      onChange={onCriteriaChange}
                      editMode
                    />
                  </HorizontalFormItem>
                  <HorizontalFormItem label="发送通知">
                    <Rearm value={pendingRearm || 0} onChange={onRearmChange} editMode />
                  </HorizontalFormItem>
                  <HorizontalFormItem label="模板">
                    <NotificationTemplate
                      alert={alert}
                      query={query}
                      columnNames={queryResult.getColumnNames()}
                      resultValues={queryResult.getData()}
                      subject={options.custom_subject}
                      setSubject={subject => onNotificationTemplateChange({ custom_subject: subject })}
                      body={options.custom_body}
                      setBody={body => onNotificationTemplateChange({ custom_body: body })}
                    />
                  </HorizontalFormItem>
                </>
              )}
            </Form>
            <div>
              <HelpTrigger className="f-13" type="ALERT_SETUP">
                设置说明 <i className="fa fa-question-circle" aria-hidden="true" />
                <span className="sr-only">(帮助)</span>
              </HelpTrigger>
            </div>
          </div>
        </div>
      </>
    );
  }
}

AlertEdit.propTypes = {
  alert: AlertType.isRequired,
  queryResult: PropTypes.object, // eslint-disable-line react/forbid-prop-types,
  pendingRearm: PropTypes.number,
  menuButton: PropTypes.node.isRequired,
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  onQuerySelected: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onCriteriaChange: PropTypes.func.isRequired,
  onRearmChange: PropTypes.func.isRequired,
  onNotificationTemplateChange: PropTypes.func.isRequired,
};

AlertEdit.defaultProps = {
  queryResult: null,
  pendingRearm: null,
};
