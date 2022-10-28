import { createContext, useContext, useRef, useState } from "react";

import { AgentHandler } from "~agent-handler";

export const AgentHandlerContext = createContext<any[]>([]);

export function AgentHandlerContextProvider({ children }) {
  const [items, setItems] = useState([]);

  useRef(
    new AgentHandler(
      (newItem: any) => setItems((items) => [newItem, ...items]),
      () => setItems([])
    )
  );

  return (
    <AgentHandlerContext.Provider value={items}>
      <>{children}</>
    </AgentHandlerContext.Provider>
  );
}

export const useAgentHandlerData = () => useContext(AgentHandlerContext);
