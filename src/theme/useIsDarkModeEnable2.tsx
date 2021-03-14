
import { useContext, useMemo, createContext, useState } from "react";
import { ReactNode } from "react";


const context = createContext<{
    setIsDarkModeEnabled(value: boolean): void;
    isDarkModeEnabled: boolean;
} | undefined>(undefined);

export type Props = {
    children: ReactNode;
    initialValue: boolean | (()=>boolean);
};


export function useIsDarkModeEnabled2() {
    const out = useContext(context);

    if (out === undefined) {
        throw new Error("Must be used in a component wrapped in <IsDarkModeEnabledProvider2 />");
    }

    return out;

}

export function IsDarkModeEnabledProvider2(props: Props) {

    const { children, initialValue } = props;

    const [isDarkModeEnabled, setIsDarkModeEnabled] = useState<boolean>(initialValue);

    const value = useMemo(
        () => ({
            isDarkModeEnabled,
            setIsDarkModeEnabled
        }),
        [isDarkModeEnabled]
    );

    return (
        <context.Provider value={value}>
            {children}
        </context.Provider>
    );

}



function App() {

    return (
        <>
            <IsDarkModeEnabledProvider2 initialValue={true}>
                <MyComponent />
            </IsDarkModeEnabledProvider2>
            <IsDarkModeEnabledProvider2 initialValue={false}>
                <MyComponent />
            </IsDarkModeEnabledProvider2>
        </>
    );

}

function MyComponent() {

    const { isDarkModeEnabled, setIsDarkModeEnabled } = useIsDarkModeEnabled2();

    return null;


}
