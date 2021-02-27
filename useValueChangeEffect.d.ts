export declare function useValueChangeEffect<T extends readonly [value: any, ...moreValues: any[]]>(effect: (...args: T) => void, values: T): void;
