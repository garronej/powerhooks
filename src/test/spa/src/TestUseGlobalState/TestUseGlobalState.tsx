

import { useLang } from "./useLang";
import { useIsDarkModeEnabled } from "./useIsDarkModeEnabled";

export function TestUseGlobalState() {

    const { isDarkModeEnabled, setIsDarkModeEnabled } = useIsDarkModeEnabled();

    const { lang, setLang } = useLang();

    return (
        <>
            <h1>isDarkModeEnabled: {isDarkModeEnabled ? "yes" : "false"}</h1>
            <button onClick={() => setIsDarkModeEnabled(!isDarkModeEnabled)}>Switch dark mode</button>
            <br />
            <h1>lang: {JSON.stringify(lang)}</h1>
            <button onClick={() => setLang("fr")}>Set language to fr</button>
            <button onClick={() => setLang("en")}>Set language to en</button>
        </>
    );

}