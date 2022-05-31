

import { createContext, useEffect, memo } from "react";
import type { StatefulEvt } from "evt";
import { useConstCallback } from "./useConstCallback";
import { overwriteReadonlyProp } from "tsafe/lab/overwriteReadonlyProp";
import type { UseNamedStateReturnType } from "./useNamedState";
import { typeGuard } from "tsafe/typeGuard";
import { capitalize } from "./tools/capitalize";
import type { AppContext } from "next/app";
import type { NextComponentType } from "next";
import type { AppProps } from "next/app";
import { assert } from "tsafe/assert";
import { parseCookies, setCookie } from "nookies";
import { useRerenderOnStateChange } from "./evt/hooks/useRerenderOnStateChange";
import { createLazilyInitializedStatefulEvt } from "./tools/createLazilyInitializedStatefulEvt";
import DefaultApp from "next/App";
import type { IncomingHttpHeaders } from "http";
import type { FC } from "react";
import { useConst } from "./useConst";
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
		getInitialStateServerSide: (appContext: AppContext) => Promise<{
			initialState: T;
			doFallbackToGetInitialStateClientSide: boolean;
		}>;
		getInitialStateClientSide?: () => Promise<T>;
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
>  {

	const { name, getInitialStateServerSide, getInitialStateClientSide, Head } = params;


	let initialStateWrap: [T] | undefined = undefined;

	const evtXyz = createLazilyInitializedStatefulEvt<T>(() => {

		if( initialStateWrap === undefined ){
			throw new Error("Too soon, we need to get the initial state from backend first");
		}

		return initialStateWrap[0];

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
			props: AppProps;
			xyzServerInfos: {
				xyz: T;
				doFallbackToGetInitialStateClientSide: boolean;
				isStateFromUrl: boolean;
				headers: IncomingHttpHeaders | undefined;
				pathname: string;
				query: ParsedUrlQuery;
			} | undefined;

		};


		let isInit = false;


		function AppWithXyz({ props, xyzServerInfos, ...rest }: AppWithXyzProps) {

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

				initialStateWrap = [xyzServerInfos.xyz];

				if (!isServer) {

					const setStateCookie = (state: T) => setCookie(null, `${cookiePrefix}${name}`, stringify(state), { "sameSite": "lax" });

					evtXyz
						.toStateless()
						.attach(setStateCookie);

					if (xyzServerInfos.isStateFromUrl) {
						setStateCookie(evtXyz.state);
					}

				}

				isInit = true;

			}

			useEffect(
				() => {

					if (isServer || !xyzServerInfos?.doFallbackToGetInitialStateClientSide) {
						return;
					}

					assert(
						getInitialStateClientSide !== undefined,
						[
							"You've stipulated to fallback on client side evaluation",
							"of the initial state but provided no getInitialStateClientSide"
						].join(" ")
					);

					getInitialStateClientSide().then(state => evtXyz.state = state);

				},
				[]
			);

			const headProps = useConst(() => {

				const { headers, pathname, query } = xyzServerInfos ?? {};

				assert(headers !== undefined);
				assert(pathname !== undefined);
				assert(query !== undefined);

				return { headers, pathname, query};

			});

			return (
				<>
					<AppWithXyzHead {...headProps} />
					<App {...props as any} {...rest as any} />
				</>
			);

		}


		Object.keys(App)
			.forEach(staticMethod => (AppWithXyz as any)[staticMethod] = (App as any)[staticMethod]);

		AppWithXyz.getInitialProps = async (appContext: AppContext): Promise<AppWithXyzProps> => ({
			"props": App.getInitialProps ? await App.getInitialProps(appContext as any) : {},
			"xyzServerInfos": await (async () => {

				if (!isServer) {
					return undefined;
				}

				console.log("pathname: ",appContext.ctx.pathname);
				console.log("query: ",appContext.ctx.query);

				//TODO: Read state from URL and update route

				const common = (() => {

					const { pathname, query, req } = appContext.ctx;

					const { headers } = req ?? {};

					return { pathname, query, headers };

				})();

				read_cookie: {
					const stateStr = parseCookies(appContext.ctx)[`${cookiePrefix}${name}`];

					if (stateStr === undefined) {
						break read_cookie;
					}

					return {
						"xyz": parse<T>(stateStr),
						"doFallbackToGetInitialStateClientSide": false,
						"isStateFromUrl": false,
						...common
					};

				}

				const { initialState, doFallbackToGetInitialStateClientSide } = await getInitialStateServerSide(appContext);

				return {
					"xyz": initialState,
					doFallbackToGetInitialStateClientSide,
					"isStateFromUrl": false,
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

