

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

function pop(
    params: {
        locationSearch: string;
        name: string;
    }
): { wasPresent: false; } | { wasPresent: true; newLocationSearch: string; value: string; } {

    const { locationSearch, name } = params;

    let value: string | undefined = undefined;

    const { newLocationSearch } = (() => {

        let newLocationSearch = locationSearch
            .replace(/^\?/, "")
            .split("&")
            .map(part => part.split("=") as [string, string])
            .filter(([key, value_i]) => key !== name ? true : (value = decodeURI(value_i), false))
            .map(entry => entry.join("="))
            .join("&")
            ;

        newLocationSearch = newLocationSearch === "" ?
            "" : `?${newLocationSearch}`;

        return { newLocationSearch };

    })();

    if (value === undefined) {
        return { "wasPresent": false };
    }

    return {
        "wasPresent": true,
        newLocationSearch,
        value
    };

}

export const urlSearchParams = { add, pop };


