import Dialog from "rc-dialog";
import Tree from "rc-tree";
import { useCallback, useState } from "react";
import BaseTable, { AutoResizer, Column } from "react-base-table";
import { createRoot } from "react-dom/client";

import {
  AgentHandlerContextProvider,
  useAgentHandlerData
} from "~agent-handler-context";
import { PlayControls } from "~components/play-controls";

const DiagnosticsView = () => {
  const items = useAgentHandlerData();

  return (
    <div>
      <h2>Eligius Diagnostics</h2>
      <div style={{ marginBottom: "10px" }}>
        <PlayControls />
      </div>
      <h3>Events</h3>
      <AutoResizer>
        {({ width }) => (
          <BaseTable data={items} width={width} height={200}>
            <Column
              key="eventName"
              dataKey="eventName"
              width={width / 2}
              title="Event name"
            />
            <Column
              key="args"
              dataKey="args"
              width={width / 2}
              title="event data"
              cellRenderer={getRenderer}
            />
          </BaseTable>
        )}
      </AutoResizer>
    </div>
  );
};

function getRenderer({ cellData }) {
  return <ArgView cellData={cellData} />;
}

function ArgView(cellData) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const showDialog = useCallback(
    () => setDialogVisible((x) => !x),
    [setDialogVisible]
  );

  if (
    (Array.isArray(cellData) && cellData.length) ||
    (typeof cellData === "object" && Object.keys(cellData).length)
  ) {
    return (
      <>
        {!dialogVisible && <button onClick={showDialog}>*</button>}
        <Dialog visible={dialogVisible} title="" onClose={showDialog}>
          <Tree
            style={{ width: 150 }}
            treeData={[
              {
                title: "args",
                children: objectToTreeData(cellData),
                key: (Math.random() * 10).toString()
              }
            ]}
          />
        </Dialog>
      </>
    );
  }
  return (
    <>
      {cellData} - {typeof cellData}
    </>
  );
}

function objectToTreeData(value: any) {
  if (Array.isArray(value)) {
    return value.map(objectToTreeData);
  }
  if (typeof value === "object") {
    const entries = Object.entries(value);
    return entries.map(([name, value]) => ({
      key: (Math.random() * 10).toString(),
      title: name,
      children: Array.isArray(value)
        ? objectToTreeData(value)
        : objectToTreeData([value])
    }));
  }
  return {
    key: (Math.random() * 10).toString(),
    title: value
  };
}

//array<{key,title,children, [disabled, selectable]}>

const App = () => {
  return (
    <AgentHandlerContextProvider>
      <DiagnosticsView />
    </AgentHandlerContextProvider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
