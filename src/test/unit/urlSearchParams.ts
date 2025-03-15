import {
  getSearchParam,
  addOrUpdateSearchParam,
  getAllSearchParams,
  getAllSearchParamsStartingWithPrefix
} from "../../tools/urlSearchParams";
import { assert } from "tsafe/assert";
import { same } from "evt/tools/inDepth/same";

{
  const url = "https://example.com?p=x&foo=bar#xx";

  const got = getSearchParam({
    url,
    name: "foo",
  });

  const expected = {
    wasPresent: true as const,
    value: "bar",
    url_withoutTheParam: "https://example.com?p=x#xx",
  };

  assert(same(got, expected));
}

{
  const url = "https://example.com/?foo=bar";

  const got = getSearchParam({
    url,
    name: "foo",
  });

  const expected = {
    wasPresent: true as const,
    value: "bar",
    url_withoutTheParam: "https://example.com/",
  };

  assert(same(got, expected));
}

{
  const url = "https://example.com?foo=bar#xx";

  const got = getSearchParam({
    url,
    name: "foo",
  });

  const expected = {
    wasPresent: true as const,
    value: "bar",
    url_withoutTheParam: "https://example.com#xx",
  };

  assert(same(got, expected));
}

{
  for (const value of [
    "",
    " ",
    "+",
    "++",
    "%20",
    "%20+",
    "?",
    "#",
    "oidc email profile",
    JSON.stringify({ foo: "+%20🐹foo=#?", bar: 22 }),
  ]) {
    for (const encodeMethod of ["encodeURIComponent", "www-form"] as const) {
      const url = addOrUpdateSearchParam({
        url: "https://example.com",
        name: "foo",
        value,
        encodeMethod,
      });

      const got = getSearchParam({
        url,
        name: "foo",
      });

      const expected = {
        wasPresent: true as const,
        value,
        url_withoutTheParam: "https://example.com",
      };

      assert(same(got, expected));
    }
  }
}

{

    let url = "https://example.com";

    url = addOrUpdateSearchParam({
      url,
      name: "x",
      value: JSON.stringify({ foo: "+%20🐹foo=#?", bar: 22 }),
      encodeMethod: "encodeURIComponent",
    });

    url = addOrUpdateSearchParam({
      url,
      name: "foo",
      value: "__",
      encodeMethod: "www-form",
    });

    url = addOrUpdateSearchParam({
      url,
      name: "foo",
      value: "oidc email profile",
      encodeMethod: "www-form",
    });

    url = addOrUpdateSearchParam({
      url,
      name: "p",
      value: "",
      encodeMethod: "encodeURIComponent",
    });

    const got = getAllSearchParams(url);

    const expected = {
      x: JSON.stringify({ foo: "+%20🐹foo=#?", bar: 22 }),
      foo: "oidc email profile",
      p: "",
    };

    assert(same(got, expected));

}

{

    let url = "https://example.com";

    url = addOrUpdateSearchParam({
        url,
        name: "p1",
        value: "v1",
        encodeMethod: "encodeURIComponent",
    });

    url = addOrUpdateSearchParam({
        url,
        name: "p2",
        value: "v2",
        encodeMethod: "encodeURIComponent",
    });

    url = addOrUpdateSearchParam({
        url,
        name: "p3",
        value: "v3",
        encodeMethod: "encodeURIComponent",
    });

    url = addOrUpdateSearchParam({
        url,
        name: "foo",
        value: "bar",
        encodeMethod: "encodeURIComponent",
    });

    const result = getAllSearchParamsStartingWithPrefix({
        url,
        prefix: "p",
        doLeavePrefixInResults: false,
    });

    const expected = {
        valueByName: {
            "1": "v1",
            "2": "v2",
            "3": "v3",
        },
        url_withoutTheParams: "https://example.com?foo=bar",
    };

    assert(same(result, expected));

}

{

    let url = "https://example.com";

    url = addOrUpdateSearchParam({
        url,
        name: "p1",
        value: "v1",
        encodeMethod: "encodeURIComponent",
    });

    url = addOrUpdateSearchParam({
        url,
        name: "p2",
        value: "v2",
        encodeMethod: "encodeURIComponent",
    });

    url = addOrUpdateSearchParam({
        url,
        name: "p3",
        value: "v3",
        encodeMethod: "encodeURIComponent",
    });

    url = addOrUpdateSearchParam({
        url,
        name: "foo",
        value: "bar",
        encodeMethod: "encodeURIComponent",
    });

    const result = getAllSearchParamsStartingWithPrefix({
        url,
        prefix: "p",
        doLeavePrefixInResults: true,
    });

    const expected = {
        valueByName: {
            "p1": "v1",
            "p2": "v2",
            "p3": "v3",
        },
        url_withoutTheParams: "https://example.com?foo=bar",
    };

    assert(same(result, expected));

}

{

  const got = addOrUpdateSearchParam({
    url: "https://example.com",
    name: "foo",
    value: "oidc profile email",
    encodeMethod: "www-form",
  });

  const expected = "https://example.com?foo=oidc+profile+email";

  assert(got === expected);

}

{

  const got = addOrUpdateSearchParam({
    url: "https://example.com",
    name: "foo",
    value: "oidc profile email",
    encodeMethod: "encodeURIComponent"
  });

  const expected = "https://example.com?foo=oidc%20profile%20email";

  assert(got === expected);

}

console.log("PASS");


