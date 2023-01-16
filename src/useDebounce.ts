import { useEffect, useTransition } from "react";
import { waitForDebounceFactory } from "./tools/waitForDebounce";
import { useConst } from "./useConst";
import { useConstCallback } from "./useConstCallback";
import { useEffectOnValueChange } from "./useEffectOnValueChange";

export function createUseDebounce(params: {
	delay: number;
}) {
	const { delay } = params;

	function useDebounce(callback: () => void, deps: readonly [value: any, ...moreValues: any[]]) {

		const { waitForDebounce } = useConst(() => waitForDebounceFactory({ delay }));

		const isUnmountedRef = useConst(() => ({ "current": false }));

		useEffect(
			() => () => {
				isUnmountedRef.current = true;
			},
			[]
		);

		const constCallback = useConstCallback(callback);

		const [, startTransition] = useTransition();

		useEffectOnValueChange(
			() => {

				(async () => {

					await waitForDebounce();

					if (isUnmountedRef.current) {
						return;
					}

					startTransition(() => constCallback());

				})();


			},
			deps
		);

	}

	return { useDebounce };

}
