
import { useEffect } from "react";
import { createUseSsrGlobalState } from "powerhooks/useSsrGlobalState";
import Head from "next/head";
import { updateSearchBarUrl, retrieveParamFromUrl, addParamToUrl } from "powerhooks/tools/urlSearchParams";

//https://www.woorank.com/en/edu/seo-guides/best-practices-for-language-declaration
//https://www.woorank.com/en/edu/seo-guides/hreflang-seo-guide
//https://developers.google.com/search/docs/advanced/crawling/localized-versions

const languages = ["en", "fr", "es"] as const;

type Language = typeof languages[number];

const fallbackLanguage = "en";

export const { useLang, withLang, evtLang } = createUseSsrGlobalState({
	"name": "lang",
	"getInitialValueServerSide": appContext => {

		let lang: Language | undefined;

		try {

			lang = getLanguageBestApprox<Language>({
				"languageLike": appContext.ctx.req?.headers["accept-language"]?.split(/[,;]/)[1]!,
				fallbackLanguage,
				languages
			});

		} catch {
			return {
				"doFallbackToGetInitialValueClientSide": true,
				"initialValue": fallbackLanguage
			} as const;
		}

		return { "initialValue": lang };

	},
	"getInitialValueClientSide": () => 
		getLanguageBestApprox<Language>({
			"languageLike": navigator.language,
			languages,
			fallbackLanguage
		}),
	"Head": ({ lang, headers, pathname, query }) => {

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(
			() => {
				document.documentElement.setAttribute("lang", lang);
			},
			[lang]
		);

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {

			const result = retrieveParamFromUrl({
				"url": window.location.href,
				"name": "lang",

			});

			if (!result.wasPresent) {
				return;
			}

			updateSearchBarUrl(result.newUrl);

		}, []);

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


//TODO: Correct
function getLanguageBestApprox<Language extends string>(
	params: {
		languages: readonly Language[];
		fallbackLanguage: Language;
		languageLike: string;
	}
): Language {

	const { languages, languageLike, fallbackLanguage } = params;

	const iso2LanguageLike = languageLike
		.split("-")[0]
		.toLowerCase();

	const lang = languages.find(lang =>
		lang.toLowerCase().includes(iso2LanguageLike),
	);

	if (lang !== undefined) {
		return lang;
	}

	return fallbackLanguage;
}
