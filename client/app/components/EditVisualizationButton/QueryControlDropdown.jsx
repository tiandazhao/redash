import React from "react";
import PropTypes from "prop-types";
import Dropdown from "antd/lib/dropdown";
import Menu from "antd/lib/menu";
import Button from "antd/lib/button";
import PlainButton from "@/components/PlainButton";
import { clientConfig } from "@/services/auth";

import PlusCircleFilledIcon from "@ant-design/icons/PlusCircleFilled";
import ShareAltOutlinedIcon from "@ant-design/icons/ShareAltOutlined";
import FileOutlinedIcon from "@ant-design/icons/FileOutlined";
import FileExcelOutlinedIcon from "@ant-design/icons/FileExcelOutlined";
import EllipsisOutlinedIcon from "@ant-design/icons/EllipsisOutlined";

import QueryResultsLink from "./QueryResultsLink";

export default function QueryControlDropdown(props) {
  const menu = (
    <Menu>
      {!props.query.isNew() && (!props.query.is_draft || !props.query.is_archived) && (
        <Menu.Item>
          <PlainButton onClick={() => props.openAddToDashboardForm(props.selectedTab)}>
            <PlusCircleFilledIcon /> 添加至报表
          </PlainButton>
        </Menu.Item>
      )}
      {!clientConfig.disablePublicUrls && !props.query.isNew() && (
        <Menu.Item>
          <PlainButton
            onClick={() => props.showEmbedDialog(props.query, props.selectedTab)}
            data-test="ShowEmbedDialogButton">
            <ShareAltOutlinedIcon /> 嵌入到其它应用
          </PlainButton>
        </Menu.Item>
      )}
      <Menu.Item>
        <QueryResultsLink
          fileType="csv"
          disabled={props.queryExecuting || !props.queryResult.getData || !props.queryResult.getData()}
          query={props.query}
          queryResult={props.queryResult}
          embed={props.embed}
          apiKey={props.apiKey}>
          <FileOutlinedIcon /> 另存为CSV文件
        </QueryResultsLink>
      </Menu.Item>
      <Menu.Item>
        <QueryResultsLink
          fileType="tsv"
          disabled={props.queryExecuting || !props.queryResult.getData || !props.queryResult.getData()}
          query={props.query}
          queryResult={props.queryResult}
          embed={props.embed}
          apiKey={props.apiKey}>
          <FileOutlinedIcon /> 另存为TSV文件
        </QueryResultsLink>
      </Menu.Item>
      <Menu.Item>
        <QueryResultsLink
          fileType="xlsx"
          disabled={props.queryExecuting || !props.queryResult.getData || !props.queryResult.getData()}
          query={props.query}
          queryResult={props.queryResult}
          embed={props.embed}
          apiKey={props.apiKey}>
          <FileExcelOutlinedIcon /> 另存为Excel文件
        </QueryResultsLink>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown trigger={["click"]} overlay={menu} overlayClassName="query-control-dropdown-overlay">
      <Button data-test="QueryControlDropdownButton">
        <EllipsisOutlinedIcon rotate={90} />
      </Button>
    </Dropdown>
  );
}

QueryControlDropdown.propTypes = {
  query: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  queryResult: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  queryExecuting: PropTypes.bool.isRequired,
  showEmbedDialog: PropTypes.func.isRequired,
  embed: PropTypes.bool,
  apiKey: PropTypes.string,
  selectedTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  openAddToDashboardForm: PropTypes.func.isRequired,
};

QueryControlDropdown.defaultProps = {
  queryResult: {},
  embed: false,
  apiKey: "",
  selectedTab: "",
};
