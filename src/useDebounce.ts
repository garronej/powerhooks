import { useEffect } from "react";
import { waitForDebounceFactory } from "./tools/waitForDebounce";
import { useConst } from "./useConst";
import { useConstCallback } from "./useConstCallback";

type Destructor = () => void;

type EffectCallback = () => (void | Destructor);

export function createUseDebounce(params: {
	delay: number;
}) {
	const { delay } = params;

	function useDebounce(effectCallback: EffectCallback, deps: readonly [value: any, ...moreValues: any[]]) {

		const { waitForDebounce } = useConst(() => waitForDebounceFactory({ delay }));

		const isUnmountedRef = useConst(() => ({ "current": false }));

		useEffect(
			() => () => {
				isUnmountedRef.current = true;
			},
			[]
		);

		const constEffectCallback = useConstCallback(effectCallback);

		useEffect(
			() => {

				let destructor: Destructor | undefined = undefined;

				(async () => {

					await waitForDebounce();

					if (isUnmountedRef.current) {
						return;
					}

					destructor= constEffectCallback() ?? undefined;

				})();

				return ()=> {
					destructor?.();
				};


			},
			deps
		);

	}

	return { useDebounce };

}
