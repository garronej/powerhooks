

function add(
    params: {
        url: string,
        name: string,
        value: string;
    }
): { newUrl: string; } {

    const { url, name, value } = params;

    const newUrl = `${url}${/\?/.test(url) ? "&" : "?"}${name}=${encodeURI(value)}`;

    return { newUrl };

}

export function retrieve(
    params: {
        locationSearch: string;
        prefix: string;
    }
): { newLocationSearch: string; values: Record<string, string>; } {

    const { locationSearch, prefix } = params;

    const values: Record<string, string> = {};

    const { newLocationSearch } = (() => {

        let newLocationSearch = locationSearch
            .replace(/^\?/, "")
            .split("&")
            .map(part => part.split("=") as [string, string])
            .filter(([key, value_i]) =>
                !key.startsWith(prefix) ?
                    true :
                    (values[key.substring(prefix.length)] = decodeURI(value_i), false))
            .map(entry => entry.join("="))
            .join("&")
            ;

        newLocationSearch = newLocationSearch === "" ?
            "" : `?${newLocationSearch}`;

        return { newLocationSearch };

    })();

    return {
        newLocationSearch,
        values
    };

}

export const urlSearchParams = { add, retrieve };


