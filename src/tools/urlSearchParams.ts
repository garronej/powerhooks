import { assert } from "tsafe/assert";
import { id } from "tsafe/id";

export function addParamToUrl(params: {
  url: string;
  name: string;
  value: string;
}): {
  newUrl: string;
} {
  const { url, name, value } = params;

  let newUrl = url;

  {
    const result = retrieveParamFromUrl({
      url,
      name,
    });

    if (result.wasPresent) {
      newUrl = result.newUrl;
    }
  }

  let hash: string | undefined = undefined;

  if (newUrl.includes("#")) {
    const [p1, p2] = newUrl.split("#");

    assert(p2 !== undefined);

    newUrl = p1;

    hash = p2;
  }

  newUrl += `${
    newUrl.includes("?") ? (newUrl.endsWith("?") ? "" : "&") : "?"
  }${name}=${encodeURIComponent(value)}`;

  if (hash !== undefined) {
    newUrl += `#${hash}`;
  }

  return { newUrl };
}

export function retrieveAllParamStartingWithPrefixFromUrl<
  Prefix extends string,
  DoLeave extends boolean
>(params: {
  url: string;
  prefix: Prefix;
  doLeavePrefixInResults: DoLeave;
}): {
  newUrl: string;
  values: Record<DoLeave extends true ? `${Prefix}${string}` : string, string>;
} {
  const { url, prefix, doLeavePrefixInResults } = params;

  const { urlWithoutHash, hash } = (() => {
    if (url.includes("#")) {
      const [p1, p2] = url.split("#");

      assert(p2 !== undefined);

      return {
        urlWithoutHash: p1,
        hash: p2,
      };
    }

    return {
      urlWithoutHash: url,
      hash: undefined,
    };
  })();

  const { urlBeforeSearch, search } = (() => {
    if (urlWithoutHash.includes("?")) {
      const [p1, p2] = urlWithoutHash.split("?");

      assert(p2 !== undefined);

      return {
        urlBeforeSearch: p1,
        search: p2,
      };
    }

    return {
      urlBeforeSearch: urlWithoutHash,
      search: undefined,
    };
  })();

  if (search === undefined) {
    return {
      newUrl: url,
      values: id<Record<string, string>>({}),
    };
  }

  const values: Record<string, string> = {};

  const { newLocationSearch } = (() => {
    let newLocationSearch = search
      .split("&")
      .filter((part) => part !== "")
      .map((part) => part.split("=") as [string, string])
      .filter(([key, value_i]) =>
        !key.startsWith(prefix)
          ? true
          : ((values[
              doLeavePrefixInResults ? key : key.substring(prefix.length)
            ] = decodeURIComponent(value_i)),
            false)
      )
      .map((entry) => entry.join("="))
      .join("&");

    return { newLocationSearch };
  })();

  return {
    newUrl: `${urlBeforeSearch}${
      newLocationSearch === "" ? "" : `?${newLocationSearch}`
    }${hash === undefined ? "" : `#${hash}`}`,
    values,
  };
}

export function retrieveAllParamFromUrl(params: { url: string }): {
  newUrl: string;
  values: Record<string, string>;
} {
  return retrieveAllParamStartingWithPrefixFromUrl({
    url: params.url,
    prefix: "",
    doLeavePrefixInResults: true,
  });
}

export function retrieveParamFromUrl(params: {
  url: string;
  name: string;
}):
  | { wasPresent: false }
  | { wasPresent: true; newUrl: string; value: string } {
  const { url, name } = params;

  let { newUrl, values } = retrieveAllParamStartingWithPrefixFromUrl({
    url,
    prefix: name,
    doLeavePrefixInResults: true,
  });

  if (!(name in values)) {
    return { wasPresent: false };
  }

  const { [name]: value, ...rest } = values;

  Object.entries(rest).forEach(
    ([name, value]) =>
      (newUrl = addParamToUrl({
        name,
        url: newUrl,
        value,
      }).newUrl)
  );

  return {
    wasPresent: true,
    newUrl,
    value: value,
  };
}

export function updateSearchBarUrl(url: string) {
  window.history.replaceState("", "", url);
}
