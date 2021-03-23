// @ts-nocheck

//useIsDarkModeEnabled.ts: 

import { createUseGlobalState } from "powerhooks/useGlobalState";

const { useIsDarkModeEnabled } = createUseGlobalState({
  "name": "isDarkModeEnabled",
  "defaultValue": () => window.matchMedia(
    "(prefers-color-scheme: dark)"
    ).matches,
  "persistance": "localStorage"
});

//MyComponent.ts:

import { useIsDarkModeEnabled } from "./useIsDarkModeEnabled";

export function MyComponent() {

  const { 
    isDarkModeEnabled, 
    setIsDarkModeEnabled 
  } = useIsDarkModeEnabled();

  return (
    <div>
      <p>
        The dark mode is currently: {isDarkModeEnabled?"enabled":"disabled"}
      </p>
      <button onClick={()=> setIsDarkModeEnabled(!isDarkModeEnabled)}>
        Click to toggle dark mode
      </button>
    </div>
  );

}