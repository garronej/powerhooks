/** https://stackoverflow.com/questions/65890278/why-cant-usecallback-always-return-the-same-ref */
export declare function useConstCallback<T extends (...args: never[]) => unknown>(callback: T): T;
