//import { useDarkMode } from "next-dark-mode";
import { useDarkMode } from "./next-dark-mode";
import { useFoo } from "./persistanceByCookie";

export default function Index() {

    const { darkModeActive, switchToDarkMode, switchToLightMode } = useDarkMode();

    const { foo, setFoo } = useFoo();

    return (
        <>
            <h1>Hello World, darkModeActive: {darkModeActive ? "yes" : "false"}</h1>
            <h1>foo: {foo}</h1>
            <button onClick={() => (darkModeActive ? switchToLightMode : switchToDarkMode)()}>Switch dark mode</button>
            <button onClick={() => setFoo(`${foo} +1`)}>change foo</button>
        </>
    );

}
