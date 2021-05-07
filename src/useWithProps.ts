
import { useGuaranteedMemo } from "./useGuaranteedMemo";
import { objectKeys } from "tsafe/objectKeys";
import { withProps } from "./withProps";

/**
 * Assert: The number of properties in preInjectedProps is constant
 */
export const useWithProps: typeof withProps = (Component, preInjectedProps) => {

    return useGuaranteedMemo(
        () => withProps(
            Component,
            preInjectedProps
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        objectKeys(preInjectedProps).map(key => preInjectedProps[key])
    );

}