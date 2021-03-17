declare function add(params: {
    url: string;
    name: string;
    value: string;
}): {
    newUrl: string;
};
declare function pop(params: {
    locationSearch: string;
    name: string;
}): {
    wasPresent: false;
} | {
    wasPresent: true;
    newLocationSearch: string;
    value: string;
};
export declare const urlSearchParams: {
    add: typeof add;
    pop: typeof pop;
};
export {};
