import { useEffect } from "react";
import { useConst } from "./useConst";
import { useConstCallback } from "./useConstCallback";
import { waitForDebounceFactory } from "./tools/waitForDebounce";

type Destructor = () => void;

type EffectCallback = () => void | Destructor;

export function createUseDebounce(params: { delay: number }) {
	const { delay } = params;

	const { waitForDebounce, obsIsDebouncing } = waitForDebounceFactory({ delay });

	function useDebounce(
		effectCallback: EffectCallback,
		deps: readonly [value: any, ...moreValues: any[]],
	) {

		const constEffectCallback = useConstCallback(effectCallback);

		const refIsFirst = useConst(() => ({ "current": false }));

		useEffect(() => {
			if (refIsFirst.current) {
				refIsFirst.current = false;

				return constEffectCallback();
			}

			let isActive = true;
			let destructor: Destructor | undefined = undefined;

			(async () => {
				await waitForDebounce();

				if (!isActive) {
					return;
				}

				destructor = constEffectCallback() ?? undefined;
			})();

			return () => {
				isActive = false;
				destructor?.();
			};
		}, deps);
	}

	return { useDebounce, obsIsDebouncing };
}
