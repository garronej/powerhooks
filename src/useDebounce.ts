import { useEffect } from "react";
import { waitForDebounceFactory } from "./tools/waitForDebounce";
import { useConst } from "./useConst";
import { useConstCallback } from "./useConstCallback";

export function createUseDebounce(params: {
	delay: number;
}) {
	const { delay } = params;

	function useDebounce(params: {
		query: any;
		onDebounced: () => void;
	}) {

		const { query, onDebounced: onDebounced_props } = params;

		const { waitForDebounce } = useConst(() => waitForDebounceFactory({ delay }));

		const isUnmountedRef = useConst(() => ({ "current": false }));

		useEffect(
			() => () => {
				isUnmountedRef.current = true;
			},
			[]
		);

		const onDebounced = useConstCallback(onDebounced_props);

		useEffect(
			() => {

				(async () => {

					await waitForDebounce();

					if (isUnmountedRef.current) {
						return;
					}

					onDebounced();

				})();


			},
			[query]
		);

	}

	return { useDebounce };

}
