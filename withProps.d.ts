import type React from "react";
export declare function withProps<P extends object, K extends keyof P>(Component: (props: P) => ReturnType<React.FC>, preInjectedProps: {
    [Key in K]: P[Key];
}): (props: { [Key in Exclude<keyof P, K>]: P[Key]; }) => JSX.Element;
