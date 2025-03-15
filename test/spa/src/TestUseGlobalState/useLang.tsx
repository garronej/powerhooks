/* eslint-disable no-labels */
import { createUseGlobalState } from "powerhooks/useGlobalState";
import { updateSearchBarUrl } from "powerhooks/tools/updateSearchBar";
import { getSearchParam, addOrUpdateSearchParam } from "powerhooks/tools/urlSearchParams";

//https://www.woorank.com/en/edu/seo-guides/best-practices-for-language-declaration
//https://www.woorank.com/en/edu/seo-guides/hreflang-seo-guide
//https://developers.google.com/search/docs/advanced/crawling/localized-versions

const languages = ["en", "fr", "es"] as const;

type Language = (typeof languages)[number];

const fallbackLanguage = "en";

const name = "lang";

export const { useLang, $lang } = createUseGlobalState({
    name,
    initialState: (() => {
        const lang = getLanguageBestApprox<Language>({
            languageLike: navigator.language,
            languages
        });

        if (lang === undefined) {
            return fallbackLanguage;
        }

        return lang;
    })(),
    doPersistAcrossReloads: true
});

{
    const next = (lang: Language) => document.documentElement.setAttribute(name, lang);

    next($lang.current);

    $lang.subscribe(next);
}

{
    const result = getSearchParam({
        url: window.location.href,
        name
    });

    if (result.wasPresent) {
        $lang.current = result.value as Language;
        updateSearchBarUrl(result.url_withoutTheParam);
    }
}

[...languages, undefined].forEach(lang => {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = lang === undefined ? "x-default" : lang;
    link.href =
        lang === undefined
            ? window.location.href
            : addOrUpdateSearchParam({
                  url: window.location.href,
                  name,
                  value: lang,
                  encodeMethod: "encodeURIComponent"
              });

    document.getElementsByTagName("head")[0].appendChild(link);
});

function getLanguageBestApprox<Language extends string>(params: {
    languages: readonly Language[];
    languageLike: string;
}): Language | undefined {
    const { languages, languageLike } = params;

    scope: {
        const lang = languages.find(lang => lang.toLowerCase() === languageLike.toLowerCase());

        if (lang === undefined) {
            break scope;
        }

        return lang;
    }

    scope: {
        const iso2LanguageLike = languageLike.split("-")[0].toLowerCase();

        const lang = languages.find(lang => lang.toLowerCase().includes(iso2LanguageLike));

        if (lang === undefined) {
            break scope;
        }

        return lang;
    }

    return undefined;
}
