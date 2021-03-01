import { ReactNode } from "react";
export declare type Props = {
    children: ReactNode;
};
export declare function useIsDarkModeEnabled2(): {
    setIsDarkModeEnabled(value: boolean): void;
    isDarkModeEnabled: boolean;
};
export declare function IsDarkModeEnabledProvider2(props: Props): JSX.Element;
