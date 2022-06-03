import { useEffect, memo } from "react";
import type { StatefulEvt } from "evt";
import { useConstCallback } from "./useConstCallback";
import { overwriteReadonlyProp } from "tsafe/lab/overwriteReadonlyProp";
import type { UseNamedStateReturnType } from "./useNamedState";
import { typeGuard } from "tsafe/typeGuard";
import { capitalize } from "./tools/capitalize";
import type { AppContext } from "next/app";
import DefaultApp from "next/app";
import type { NextComponentType } from "next";
import type { AppProps } from "next/app";
import { assert } from "tsafe/assert";
import { useRerenderOnStateChange } from "evt/hooks/useRerenderOnStateChange";
import { createLazilyInitializedStatefulEvt } from "./tools/createLazilyInitializedStatefulEvt";
import type { IncomingHttpHeaders } from "http";
import type { FC } from "react";
import { useConst } from "./useConst";
import type { MaybePromise } from "./tools/MaybePromise";
import type { ParsedUrlQuery } from "querystring";

export type { StatefulEvt };

const isServer = typeof window === "undefined";


function stringify(obj: unknown): string {
	return JSON.stringify([obj]);
}

function parse<T>(str: string): T {
	return JSON.parse(str)[0];
}

const cookiePrefix = "powerhooks_useGlobalState_"

export function createUseSsrGlobalState<T, Name extends string>(
	params: {
		name: Name;
		/** If present and it doesn't return undefined it will override the current state and will take precedence over getInitialValueServerSide if no cookie was present */
		getValueSeverSide?: (appContext: AppContext) => MaybePromise<{ value: T; } | undefined>
		getInitialValueServerSide: (appContext: AppContext) => MaybePromise<{ initialValue: T; doFallbackToGetInitialValueClientSide?: boolean; }>;
		getInitialValueClientSide?: () => MaybePromise<T>;
		Head?: (props: Record<Name, T> & { headers: IncomingHttpHeaders; query: ParsedUrlQuery; pathname: string; }) => ReturnType<FC>;
	}
): Record<
	`use${Capitalize<Name>}`,
	() => UseNamedStateReturnType<T, Name>
> & Record<
	`evt${Capitalize<Name>}`,
	StatefulEvt<T>
> & Record<
	`with${Capitalize<Name>}`,
	<AppComponent>(App?: AppComponent) => AppComponent
> {

	const { name, getValueSeverSide, getInitialValueServerSide, getInitialValueClientSide, Head } = params;


	let doThrowIsTateRead= true;

	const evtXyz = createLazilyInitializedStatefulEvt<T>(() => {

		if (doThrowIsTateRead) {
			throw new Error("Too soon, we need to get the initial state from backend first");
		}

		return { "isFake": true } as any;

	});

	//Susceptible to have one handler attached for every component.
	evtXyz.setMaxHandlers(Infinity);

	function useXyz() {

		useRerenderOnStateChange(evtXyz);

		return {
			[name]: evtXyz.state,
			[`set${capitalize(name)}`]:
				useConstCallback((setStateAction: T | ((prevState: T) => T)) =>
					evtXyz.state =
					typeGuard<(prevState: T) => T>(setStateAction, typeof setStateAction === "function") ?
						setStateAction(evtXyz.state) :
						setStateAction
				)
		} as any;

	}

	overwriteReadonlyProp(useXyz as any, "name", `use${capitalize(name)}`);

	const AppWithXyzHead = memo((props: { headers: IncomingHttpHeaders; query: ParsedUrlQuery; pathname: string; }) => {

		useRerenderOnStateChange(evtXyz);

		if (Head === undefined) {
			return null;
		}

		return <Head {...{ [name]: evtXyz.state, ...props } as any} />;

	});

	{

		const componentName = `AppWith${capitalize(name)}Head`;

		overwriteReadonlyProp(AppWithXyzHead as any, "name", componentName);

		AppWithXyzHead.displayName = componentName;

	}

	function withXyz<C extends NextComponentType<any, any, any>>(App: C = DefaultApp as any): C {


		type AppWithXyzProps = {
			initialProps: AppProps;
			xyzServerInfos: {
				xyz: T;
				doFallbackToGetInitialValueClientSide: boolean;
				headers: IncomingHttpHeaders | undefined;
				pathname: string;
				query: ParsedUrlQuery;
			} | undefined;
		};


		let isInit = false;


		function AppWithXyz({ initialProps, xyzServerInfos, ...props }: AppWithXyzProps) {

			scope: {

				if (xyzServerInfos === undefined) {
					//NOTE: getInitialProps was called client side
					//evtXyz is already initialized.
					break scope;
				}

				if (isInit) {

					if (isServer) {
						evtXyz.state = xyzServerInfos.xyz;
					}

					break scope;
				}

				doThrowIsTateRead= false;
				evtXyz.state = xyzServerInfos.xyz;

				if (!isServer) {

					evtXyz
						.attach(state => {

							let newCookie = `${cookiePrefix}${name}=${stringify(state)};path=/;max-age=31536000`;

							//We do not set the domain if we are on localhost or an ip
							if (window.location.hostname.match(/\.[a-zA-Z]{2,}$/)) {
								newCookie += `;domain=${window.location.hostname.split(".").length >= 3 ?
									window.location.hostname.replace(/^[^.]+\./, "") :
									window.location.hostname
									}`;
							}

							document.cookie = newCookie;

						});

				}

				isInit = true;

			}

			useEffect(
				() => {

					if (isServer || !xyzServerInfos?.doFallbackToGetInitialValueClientSide) {
						return;
					}

					assert(
						getInitialValueClientSide !== undefined,
						[
							"You've stipulated to fallback on client side evaluation",
							"of the initial state but provided no getInitialValueClientSide"
						].join(" ")
					);

					Promise.resolve(getInitialValueClientSide()).then(initialValue => evtXyz.state = initialValue);

				},
				[]
			);

			const headProps = useConst(() => {

				const { headers, pathname, query } = xyzServerInfos ?? {};

				assert(headers !== undefined);
				assert(pathname !== undefined);
				assert(query !== undefined);

				return { headers, pathname, query };

			});

			return (
				<>
					<AppWithXyzHead {...headProps} />
					<App {...initialProps as any} {...props as any} />
				</>
			);

		}


		Object.keys(App)
			.forEach(staticMethod => (AppWithXyz as any)[staticMethod] = (App as any)[staticMethod]);

		AppWithXyz.getInitialProps = async (appContext: AppContext): Promise<AppWithXyzProps> => ({
			"initialProps": App.getInitialProps ? await App.getInitialProps(appContext as any) : {},
			"xyzServerInfos": await (async () => {

				if (!isServer) {
					return undefined;
				}

				const common = (() => {

					const { pathname, query, req } = appContext.ctx;

					const { headers } = req ?? {};

					return { pathname, query, headers };

				})();

				//TODO: Read state from URL and update route

				get_value: {

					if (getValueSeverSide === undefined) {
						break get_value;
					}

					const resp = await getValueSeverSide(appContext);

					if (resp === undefined) {
						break get_value;
					}

					const { value } = resp;

					return {
						"xyz": value,
						"doFallbackToGetInitialValueClientSide": false,
						...common
					};

				}


				read_cookie: {

					const cookie = appContext.ctx.req?.headers.cookie;

					if (cookie === undefined) {
						break read_cookie;
					}

					const parsedCookies = Object.fromEntries(
						cookie
							.split(/; */)
							.map(line => line.split("="))
							.map(([key, value]) => [key, decodeURIComponent(value)])
					);

					const cookieName = `${cookiePrefix}${name}`;

					if (!(cookieName in parsedCookies)) {
						break read_cookie;
					}


					let xyz: T;

					try {

						xyz = parse<T>(parsedCookies[cookieName]);

					} catch {

						break read_cookie;

					}

					return {
						xyz,
						"doFallbackToGetInitialValueClientSide": false,
						...common
					};

				}

				const { initialValue, doFallbackToGetInitialValueClientSide = false } = await getInitialValueServerSide(appContext);

				return {
					"xyz": initialValue,
					doFallbackToGetInitialValueClientSide,
					...common
				};

			})()

		});

		AppWithXyz.displayName = `with${capitalize(name)}(${App.displayName || App.name || "App"})`;

		overwriteReadonlyProp(AppWithXyz as any, "name", `AppWith${capitalize(name)}`);

		return AppWithXyz as any;

	}

	overwriteReadonlyProp(withXyz as any, "name", `with${capitalize(name)}`);

	return {
		[useXyz.name]: useXyz,
		[`evt${capitalize(name)}`]: evtXyz,
		[withXyz.name]: withXyz,
	} as any;

}

