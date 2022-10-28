import type { TDevToolsMessage } from "eligius";
import { useCallback } from "react";

import devtoolsToAgentConnection from "~agent-handler/devtools-to-agent-connection";

const rewindMessage: TDevToolsMessage = {
  name: "event",
  data: { type: "playcontrol", data: { kind: "seek", args: [0] } }
};

const playMessage: TDevToolsMessage = {
  name: "event",
  data: { type: "playcontrol", data: { kind: "play" } }
};

const stopMessage: TDevToolsMessage = {
  name: "event",
  data: { type: "playcontrol", data: { kind: "stop" } }
};

const pauseMessage: TDevToolsMessage = {
  name: "event",
  data: { type: "playcontrol", data: { kind: "stop" } }
};

export function PlayControls() {
  const onClick = useCallback(
    (message) => () => devtoolsToAgentConnection.postMessage(message),
    [devtoolsToAgentConnection]
  );

  return (
    <div className="playControlsContainer">
      <button type="button" onClick={onClick(rewindMessage)} title="Rewind">
        &lt;&lt;
      </button>
      <button type="button" onClick={onClick(playMessage)} title="Play">
        &gt;
      </button>
      <button type="button" onClick={onClick(pauseMessage)} title="Pause">
        |
      </button>
      <button type="button" onClick={onClick(stopMessage)} title="Stop">
        ||
      </button>
    </div>
  );
}
