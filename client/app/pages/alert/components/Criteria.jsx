import React from "react";
import PropTypes from "prop-types";
import { head, includes, toString, isEmpty } from "lodash";

import Input from "antd/lib/input";
import WarningFilledIcon from "@ant-design/icons/WarningFilled";
import Select from "antd/lib/select";
import Divider from "antd/lib/divider";

import { AlertOptions as AlertOptionsType } from "@/components/proptypes";

import "./Criteria.less";

const CONDITIONS = {
  ">": "\u003e",
  ">=": "\u2265",
  "<": "\u003c",
  "<=": "\u2264",
  "==": "\u003d",
  "!=": "\u2260",
};

const VALID_STRING_CONDITIONS = ["==", "!="];

function DisabledInput({ children, minWidth }) {
  return (
    <div className="criteria-disabled-input" style={{ minWidth }}>
      {children}
    </div>
  );
}

DisabledInput.propTypes = {
  children: PropTypes.node.isRequired,
  minWidth: PropTypes.number.isRequired,
};

export default function Criteria({ columnNames, resultValues, alertOptions, onChange, editMode }) {
  const columnValue = !isEmpty(resultValues) ? head(resultValues)[alertOptions.column] : null;
  const invalidMessage = (() => {
    // bail if condition is valid for strings
    if (includes(VALID_STRING_CONDITIONS, alertOptions.op)) {
      return null;
    }

    if (isNaN(alertOptions.value)) {
      return "取值列类型和阈值类型不匹配。";
    }

    if (isNaN(columnValue)) {
      return "取值列类型和条件类型不匹配。";
    }

    return null;
  })();

  const columnHint = (
    <small className="alert-criteria-hint">
      最大取值 <code className="p-0">{toString(columnValue) || "unknown"}</code>
    </small>
  );

  return (
    <div data-test="Criteria">
      <div className="input-title">
        <span className="input-label">取值列</span>
        {editMode ? (
          <Select
            value={alertOptions.column}
            onChange={column => onChange({ column })}
            dropdownMatchSelectWidth={false}
            style={{ minWidth: 100 }}>
            {columnNames.map(name => (
              <Select.Option key={name}>{name}</Select.Option>
            ))}
          </Select>
        ) : (
          <DisabledInput minWidth={70}>{alertOptions.column}</DisabledInput>
        )}
      </div>
      <div className="input-title">
        <span className="input-label">条件</span>
        {editMode ? (
          <Select
            value={alertOptions.op}
            onChange={op => onChange({ op })}
            optionLabelProp="label"
            dropdownMatchSelectWidth={false}
            style={{ width: 55 }}>
            <Select.Option value=">" label={CONDITIONS[">"]}>
              {CONDITIONS[">"]} 大于
            </Select.Option>
            <Select.Option value=">=" label={CONDITIONS[">="]}>
              {CONDITIONS[">="]} 大于等于
            </Select.Option>
            <Select.Option disabled key="dv1">
              <Divider className="select-option-divider m-t-10 m-b-5" />
            </Select.Option>
            <Select.Option value="<" label={CONDITIONS["<"]}>
              {CONDITIONS["<"]} 小于
            </Select.Option>
            <Select.Option value="<=" label={CONDITIONS["<="]}>
              {CONDITIONS["<="]} 小于等于
            </Select.Option>
            <Select.Option disabled key="dv2">
              <Divider className="select-option-divider m-t-10 m-b-5" />
            </Select.Option>
            <Select.Option value="==" label={CONDITIONS["=="]}>
              {CONDITIONS["=="]} 等于
            </Select.Option>
            <Select.Option value="!=" label={CONDITIONS["!="]}>
              {CONDITIONS["!="]} 不等于
            </Select.Option>
          </Select>
        ) : (
          <DisabledInput minWidth={50}>{CONDITIONS[alertOptions.op]}</DisabledInput>
        )}
      </div>
      <div className="input-title">
        <label className="input-label" htmlFor="threshold-criterion">
          阈值
        </label>
        {editMode ? (
          <Input
            id="threshold-criterion"
            style={{ width: 90 }}
            value={alertOptions.value}
            onChange={e => onChange({ value: e.target.value })}
          />
        ) : (
          <DisabledInput minWidth={50}>{alertOptions.value}</DisabledInput>
        )}
      </div>
      <div className="ant-form-item-explain">
        {columnHint}
        <br />
        {invalidMessage && (
          <small>
            <WarningFilledIcon className="warning-icon-danger" /> {invalidMessage}
          </small>
        )}
      </div>
    </div>
  );
}

Criteria.propTypes = {
  columnNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  resultValues: PropTypes.arrayOf(PropTypes.object).isRequired,
  alertOptions: AlertOptionsType.isRequired,
  onChange: PropTypes.func,
  editMode: PropTypes.bool,
};

Criteria.defaultProps = {
  onChange: () => {},
  editMode: false,
};
