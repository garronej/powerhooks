export declare type UseArrayDiffCallbackParams<ArrOf> = {
    added: ArrOf[];
    removed: ArrOf[];
};
/**
 * NOTE: Callback does not need to be constant.
 * WARNING: This hooks will only works with arrays that changes refs when updated.
 * */
export declare function useArrayDiff<ArrOf>(params: {
    watchFor: "addition";
    array: ArrOf[];
    callback(params: Pick<UseArrayDiffCallbackParams<ArrOf>, "added">): void;
}): void;
export declare function useArrayDiff<ArrOf>(params: {
    watchFor: "deletion";
    array: ArrOf[];
    callback(params: Pick<UseArrayDiffCallbackParams<ArrOf>, "removed">): void;
}): void;
export declare function useArrayDiff<ArrOf>(params: {
    watchFor: "addition or deletion";
    array: ArrOf[];
    callback(params: UseArrayDiffCallbackParams<ArrOf>): void;
}): void;
