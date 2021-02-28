
import { useContext, createContext, useState } from "react";
import { ReactNode } from "react";

const Context = createContext<{
    setIsDarkModeEnabled(value: boolean): void;
    isDarkModeEnabled: boolean;
} | undefined>(undefined);

export type Props = {
    children: ReactNode;
};


export function useIsDarkModeEnabled2(){
    const out =  useContext(Context);

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

    return(
        <Context.Provider value={{ isDarkModeEnabled, setIsDarkModeEnabled}}>
            {children}
        </Context.Provider>
    );

}

