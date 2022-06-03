
import { useEffect } from "react";
import { createUseSsrGlobalState } from "powerhooks/useSsrGlobalState";
import Head from "next/head";
import { updateSearchBarUrl, retrieveParamFromUrl, addParamToUrl } from "powerhooks/tools/urlSearchParams";
import { assert } from "tsafe/assert";

//https://www.woorank.com/en/edu/seo-guides/best-practices-for-language-declaration
//https://www.woorank.com/en/edu/seo-guides/hreflang-seo-guide
//https://developers.google.com/search/docs/advanced/crawling/localized-versions

const languages = ["en", "fr", "es"] as const;

type Language = typeof languages[number];

const fallbackLanguage = "en";

const name = "lang";

export const { useLang, withLang, evtLang } = createUseSsrGlobalState({
	name,
	"getValueSeverSide": appContext => {

		const { [name]: value } = appContext.router.query;

		if (typeof value !== "string") {
			return undefined;
		}

		const lang = getLanguageBestApprox({
			languages,
			"languageLike": value
		})

		if (lang === undefined) {
			return undefined;
		}

		return { "value": lang };

	},
	"getInitialValueServerSide": appContext => {

		let languageLike: string;

		try {

			languageLike = appContext.ctx.req?.headers["accept-language"]?.split(/[,;]/)[1]!;

			assert(typeof languageLike === "string");

		} catch {

			return {
				"doFallbackToGetInitialValueClientSide": true,
				"initialValue": fallbackLanguage
			} as const;

		}

		const lang = getLanguageBestApprox<Language>({
			languageLike,
			languages
		});

		if (lang === undefined) {
			return {
				"doFallbackToGetInitialValueClientSide": true,
				"initialValue": fallbackLanguage
			} as const;
		}

		return { "initialValue": lang };

	},
	"getInitialValueClientSide": () => {
		const lang = getLanguageBestApprox<Language>({
			"languageLike": navigator.language,
			languages,
		});

		if (lang === undefined) {
			return fallbackLanguage;
		}

		return lang;

	},
	"Head": ({ lang, headers, pathname, query }) => {

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(
			() => {
				document.documentElement.setAttribute(name, lang);
			},
			[lang]
		);

		return (
			<Head>
				{
					[...languages, undefined].map(lang =>
						<link
							key={lang ?? "default"}
							rel="alternate"
							hrefLang={lang === undefined ? "x-default" : lang}
							href={
								Object.entries((() => {

									const { lang: _, ...rest } = query;

									return { ...rest, ...(lang === undefined ? {} : { lang }) };

								})())
									.reduce((url, [name, value]) => {

										if (typeof value !== "string") {
											console.warn("TODO: Fix hrefLang generator");
											return url;
										}

										const { newUrl } = addParamToUrl(
											{
												url,
												name,
												value

											}
										);

										return newUrl;

									}, `${headers.host}${pathname}`)
							}
						/>
					)
				}
			</Head>
		);
	}
});

//NOTE: We remove the param from the url ASAP client side
if (typeof window !== "undefined") {

	const result = retrieveParamFromUrl({
		"url": window.location.href,
		name

	});

	if (result.wasPresent) {
		updateSearchBarUrl(result.newUrl);
	}

}


function getLanguageBestApprox<Language extends string>(
	params: {
		languages: readonly Language[];
		languageLike: string;
	}
): Language | undefined {

	const { languages, languageLike } = params;

	scope: {
		const lang = languages.find(lang => lang.toLowerCase() === languageLike.toLowerCase());

		if (lang === undefined) {
			break scope;
		}

		return lang;

	}

	scope: {

		const iso2LanguageLike = languageLike
			.split("-")[0]
			.toLowerCase();

		const lang = languages.find(lang =>
			lang.toLowerCase().includes(iso2LanguageLike),
		);

		if (lang === undefined) {
			break scope;
		}

		return lang;

	}

	return undefined;

}
