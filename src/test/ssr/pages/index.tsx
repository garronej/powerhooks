import { useDarkMode } from "next-dark-mode";

export default function Index() {

    const { darkModeActive, switchToDarkMode, switchToLightMode } = useDarkMode();

    return (
    <>
            <h1>Hello World, darkModeActive: {darkModeActive ? "yes" : "false"}</h1>
            <button onClick={()=> (darkModeActive ? switchToLightMode : switchToDarkMode)() }>Switch dark mode</button>
    </>
    );

}
