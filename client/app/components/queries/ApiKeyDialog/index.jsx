import { extend } from "lodash";
import React, { useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Modal from "antd/lib/modal";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import { wrap as wrapDialog, DialogPropType } from "@/components/DialogWrapper";
import CodeBlock from "@/components/CodeBlock";
import { axios } from "@/services/axios";
import { clientConfig } from "@/services/auth";
import notification from "@/services/notification";
import { useUniqueId } from "@/lib/hooks/useUniqueId";

import "./index.less";
import { policy } from "@/services/policy";

function ApiKeyDialog({ dialog, ...props }) {
  const [query, setQuery] = useState(props.query);
  const [updatingApiKey, setUpdatingApiKey] = useState(false);

  const regenerateQueryApiKey = useCallback(() => {
    setUpdatingApiKey(true);
    axios
      .post(`api/queries/${query.id}/regenerate_api_key`)
      .then(data => {
        setUpdatingApiKey(false);
        setQuery(extend(query.clone(), { api_key: data.api_key }));
      })
      .catch(() => {
        setUpdatingApiKey(false);
        notification.error("更新API key失败。");
      });
  }, [query]);

  const { csvUrl, jsonUrl } = useMemo(
    () => ({
      csvUrl: `${clientConfig.basePath}api/queries/${query.id}/results.csv?api_key=${query.api_key}`,
      jsonUrl: `${clientConfig.basePath}api/queries/${query.id}/results.json?api_key=${query.api_key}`,
    }),
    [query.id, query.api_key]
  );

  const csvResultsLabelId = useUniqueId("csv-results-label");
  const jsonResultsLabelId = useUniqueId("json-results-label");

  return (
    <Modal {...dialog.props} width={600} footer={<Button onClick={() => dialog.close(query)}>关闭</Button>}>
      <div className="query-api-key-dialog-wrapper">
        <h5>API Key</h5>
        <div className="m-b-20">
          <Input.Group compact>
            <Input readOnly value={query.api_key} aria-label="Query API Key" />
            {policy.canEdit(query) && (
              <Button disabled={updatingApiKey} loading={updatingApiKey} onClick={regenerateQueryApiKey}>
                重新创建
              </Button>
            )}
          </Input.Group>
        </div>

        <h5>API调用示例：</h5>
        <div className="m-b-10">
          <span id={csvResultsLabelId}>结果用CSV格式输出：</span>
          <CodeBlock aria-labelledby={csvResultsLabelId} copyable>
            {csvUrl}
          </CodeBlock>
        </div>
        <div>
          <span id={jsonResultsLabelId}>结果用JSON格式输出：</span>
          <CodeBlock aria-labelledby={jsonResultsLabelId} copyable>
            {jsonUrl}
          </CodeBlock>
        </div>
      </div>
    </Modal>
  );
}

ApiKeyDialog.propTypes = {
  dialog: DialogPropType.isRequired,
  query: PropTypes.shape({
    id: PropTypes.number.isRequired,
    api_key: PropTypes.string,
    can_edit: PropTypes.bool,
  }).isRequired,
};

export default wrapDialog(ApiKeyDialog);
