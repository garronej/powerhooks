import { useEffect, useContext, createContext, memo } from "react";
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
import type { IncomingHttpHeaders } from "http";
import type { FC } from "react";
import { useConst } from "./useConst";
import type { MaybePromise } from "./tools/MaybePromise";
import type { ParsedUrlQuery } from "querystring";
import { createStatefulObservable, useRerenderOnChange } from "./tools/StatefulObservable";
import type { StatefulObservable } from "./tools/StatefulObservable";

export type { StatefulObservable };

const isServer = !(typeof window === "object" && typeof document === "object");

function stringify(obj: unknown): string {
	return JSON.stringify([obj]);
}

function parse<T>(str: string): T {
	return JSON.parse(str)[0];
}

const prefix = "powerhooks_useGlobalState_"

export function createUseSsrGlobalState<T, Name extends string>(
	params: {
		name: Name;
		/** If present and it doesn't return undefined it will override the current state and will take precedence over getInitialStateServerSide if no cookie was present */
		getStateSeverSide?: (appContext: AppContext) => MaybePromise<{ value: T; } | undefined>
		getInitialStateServerSide: (appContext: AppContext) => MaybePromise<{ initialValue: T; doFallbackToGetInitialValueClientSide?: boolean; }>;
		getInitialStateClientSide?: () => MaybePromise<T>;
		Head?: (props: Record<Name, T> & { headers: IncomingHttpHeaders; query: ParsedUrlQuery; pathname: string; }) => ReturnType<FC>;
	}
): Record<
	`use${Capitalize<Name>}`,
	() => UseNamedStateReturnType<T, Name>
> & Record<
	`$${Name}`,
	StatefulObservable<T>
> & Record<
	`with${Capitalize<Name>}`,
	{
		<AppComponent extends NextComponentType<any, any, any>>(App: AppComponent): AppComponent
		(): typeof DefaultApp;
	}
> {

	const { name, getStateSeverSide, getInitialStateServerSide, getInitialStateClientSide, Head } = params;

	let doThrowIfStateRead = true;

	const $xyz = createStatefulObservable(() => {

		if (doThrowIfStateRead) {
			throw new Error("Too soon, we need to get the initial state from backend first");
		}

		return { "isFake": true } as any;

	});

	const wrappedXyzContext = createContext<[T] | undefined>(undefined);

	const { useXyz } = (() => {

		function useXyzClientSide() {

			useRerenderOnChange($xyz);

			return {
				[name]: $xyz.current,
				[`set${capitalize(name)}`]:
					useConstCallback((setStateAction: T | ((prevState: T) => T)) =>
						$xyz.current =
						typeGuard<(prevState: T) => T>(setStateAction, typeof setStateAction === "function") ?
							setStateAction($xyz.current) :
							setStateAction
					)
			} as any;

		}

		function useXyzServerSide() {

			const wrappedXyz = useContext(wrappedXyzContext);

			assert(wrappedXyz !== undefined);

			return {
				[name]: wrappedXyz[0],
				[`set${capitalize(name)}`]: useConstCallback(() => {
					/* nothing */
				})
			} as any;

		}

		const useXyz = isServer ? useXyzServerSide : useXyzClientSide;

		return { useXyz };

	})();


	overwriteReadonlyProp(useXyz as any, "name", `use${capitalize(name)}`);

	const AppWithXyzHead = memo((props: { headers: IncomingHttpHeaders; query: ParsedUrlQuery; pathname: string; }) => {

		const { [name]: xyz } = useXyz();

		if (Head === undefined) {
			return null;
		}

		return <Head {...{ [name]: xyz, ...props } as any} />;

	});

	{

		const componentName = `AppWith${capitalize(name)}Head`;

		overwriteReadonlyProp(AppWithXyzHead as any, "name", componentName);

		AppWithXyzHead.displayName = componentName;

	}

	function withXyz<AppComponent extends NextComponentType<any, any, any>>(App: AppComponent): AppComponent {

		type XyzServerInfos = {
			xyz: T;
			doFallbackToGetInitialValueClientSide: boolean;
			headers: IncomingHttpHeaders | undefined;
			pathname: string;
			query: ParsedUrlQuery;
		};

		let isInit = false;

		const xyzServerInfosAppPropName = `${prefix}${name}`;

		function AppWithXyz({ [xyzServerInfosAppPropName]: xyzServerInfos, ...props }: AppProps & Record<typeof xyzServerInfosAppPropName, XyzServerInfos | undefined>) {

			scope: {

				if (xyzServerInfos === undefined) {
					//NOTE: getInitialProps was called client side
					//$xyz is already initialized.

					assert(!isServer);
					break scope;
				}

				if (isServer) {
					break scope;
				}

				if (isInit) {

					break scope;
				}

				doThrowIfStateRead = false;
				$xyz.current = xyzServerInfos.xyz;


				const next = (state: T) => {

					let newCookie = `${prefix}${name}=${stringify(state)};path=/;max-age=31536000;SameSite=Strict`;

					set_domain: {
						const { hostname } = window.location;

						//We do not set the domain if we are on localhost or an ip
						if (/(^localhost$)|(^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$)/.test(hostname)) {
							break set_domain;
						}

						newCookie += `;domain=${hostname}`;
					}

					document.cookie = newCookie;


				};

				$xyz.subscribe(next);

				next($xyz.current);


				isInit = true;

			}

			useEffect(
				() => {

					if (xyzServerInfos === undefined) {
						return;
					}

					if (!xyzServerInfos.doFallbackToGetInitialValueClientSide) {
						return;
					}

					assert(
						getInitialStateClientSide !== undefined,
						[
							"You've stipulated to fallback on client side evaluation",
							"of the initial state but provided no getInitialStateClientSide"
						].join(" ")
					);

					Promise.resolve(getInitialStateClientSide()).then(initialValue => $xyz.current = initialValue);

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
				!isServer ? (
					<>
						<AppWithXyzHead {...headProps} />
						<App {...props as any} />
					</>) :
					<wrappedXyzContext.Provider value={(() => {

						assert(xyzServerInfos !== undefined);

						return [xyzServerInfos.xyz];

					})()}>
						<AppWithXyzHead {...headProps} />
						<App {...props as any} />
					</wrappedXyzContext.Provider>
			);

		}

		const super_getInitialProps =
			App.getInitialProps?.bind(App) ??
			DefaultApp.getInitialProps.bind(DefaultApp);

		Object.keys(App)
			.forEach(staticMethod => (AppWithXyz as any)[staticMethod] = (App as any)[staticMethod]);

		(AppWithXyz as any).getInitialProps = async (appContext: AppContext) => {
			const initialProps = await super_getInitialProps(appContext);

			const xyzServerInfos: XyzServerInfos | undefined = await (async () => {

				if (!isServer) {
					return undefined;
				}
				const common = (() => {

					const { pathname, query, req } = appContext.ctx;

					const { headers } = req ?? {};

					return { pathname, query, headers };

				})();

				get_value: {

					if (getStateSeverSide === undefined) {
						break get_value;
					}

					const resp = await getStateSeverSide(appContext);

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

					const cookieName = `${prefix}${name}`;

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

				const { initialValue, doFallbackToGetInitialValueClientSide = false } = await getInitialStateServerSide(appContext);

				return {
					"xyz": initialValue,
					doFallbackToGetInitialValueClientSide,
					...common
				};


			})();

			return { ...initialProps, [xyzServerInfosAppPropName]: xyzServerInfos };

		};


		AppWithXyz.displayName = `with${capitalize(name)}(${App.displayName || App.name || "App"})`;

		overwriteReadonlyProp(AppWithXyz as any, "name", `AppWith${capitalize(name)}`);

		return AppWithXyz as any;

	}

	overwriteReadonlyProp(withXyz as any, "name", `with${capitalize(name)}`);

	return {
		[useXyz.name]: useXyz,
		[`$${name}`]: $xyz,
		[withXyz.name]: withXyz
	} as any;

}

