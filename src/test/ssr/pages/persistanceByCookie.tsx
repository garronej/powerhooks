
import { useState, useMemo } from 'react'
import type { Dispatch, SetStateAction } from "react";
import type { AppContext } from 'next/app'
import type { AppProps } from "next/app";
import type { NextComponentType } from 'next'
import { symToStr } from "tsafe/symToStr";
import { createContext, useContext } from "react";
import { parseCookies, setCookie } from 'nookies'
import { useEffectOnValueChange } from "powerhooks/useEffectOnValueChange";
import { assert } from "tsafe/assert";

const context = createContext<{ foo: string; setFoo: Dispatch<SetStateAction<string>>; } | undefined>(undefined);


context.displayName = 'Foo'

export const useFoo = () => {
	const value = useContext(context)
	if (value === undefined) {
		throw new Error('useDarkMode must be used within a DarkModeContext Provider')
	}
	return value;
}



export function withFoo<T extends NextComponentType<any, any, any>>(params: {
	App: T;
}): T {

	const { App } = params;

	function AppWithFoo({ foo: fooFromBackend, ...props }: AppProps & { foo: string | undefined; }) {

		const [foo, setFoo] = useState(()=> {
			assert(fooFromBackend !== undefined);
			return fooFromBackend
		});

		useEffectOnValueChange(
			()=> {

				setCookie(null, "foo", foo, { "sameSite": "lax" });

			},
			[foo]
		);

		console.log("run AppWithFoo", JSON.stringify({foo}));

		return (
			<context.Provider value={useMemo(() => ({ foo, setFoo }), [foo])}>
				<App {...props as any} />
			</context.Provider>
		);

	}

	Object.keys(App)
		.forEach(staticMethod => (AppWithFoo as any)[staticMethod] = (App as any)[staticMethod]);

	AppWithFoo.getInitialProps = async (appContext: AppContext) => {

		const initialProps = App.getInitialProps ? await App.getInitialProps(appContext as any) : {};

		const foo = (() => {

			console.log("RUn getInitialProps");

			if (typeof window !== "undefined") {
				return undefined;
			}

			const getDefaultFoo = () => {

				console.log("getting default foo");

				return appContext.ctx.req?.headers["accept-language"]?.split(/[,;]/)[1];
			};

			const fooFromCookie = parseCookies(appContext.ctx)["foo"];

			return fooFromCookie ?? getDefaultFoo()

		})();

		return { ...initialProps, foo };

	};

	AppWithFoo.displayName = `${symToStr({ withFoo })}(${App.displayName || App.name || 'App'})`;

	return AppWithFoo as any;

}
