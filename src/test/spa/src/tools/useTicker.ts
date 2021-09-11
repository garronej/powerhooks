
import { useEffect, useReducer } from "react";

export function useTicker(interval: number) {

	const [tick, incrementTick] = useReducer((tick: number) => tick + 1, 0);

	useEffect(
		() => {

			console.log(`tick ${tick}`);

			const timer = setTimeout(
				incrementTick,
				interval
			);

			return () => clearTimeout(timer);

		},
		[tick]
	);

	return { tick };


}