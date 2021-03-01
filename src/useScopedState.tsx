
//TODO:


import { useContext, useMemo ,createContext, useState } from "react";
import { ReactNode } from "react";

const context = createContext<{
    setIsDarkModeEnabled(value: boolean): void;
    isDarkModeEnabled: boolean;
} | undefined>(undefined);

export type Props = {
    children: ReactNode;
};


export function useIsDarkModeEnabled2(){
    const out =  useContext(context);

    if( out === undefined ){
        throw new Error("Must be used in a component wrapped in <IsDarkModeEnabledProvider2 />");
    }

    return out;

}

export function IsDarkModeEnabledProvider2(props: Props) {

    const { children } = props;

    const [isDarkModeEnabled, setIsDarkModeEnabled] = useState<boolean>(
        () =>
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    const value = useMemo(
        () => ({ isDarkModeEnabled, setIsDarkModeEnabled }), 
        [isDarkModeEnabled]
    );

    return(
        <context.Provider value={value}>
            {children}
        </context.Provider>
    );

}