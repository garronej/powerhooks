import { useUpdateConditionOrDeps } from "./tools/useUpdateConditionOrDeps";
import * as React from "react";
const { useEffect } = React;


export type Destructor = () => void;

export function useEffectIf(
	effect: () => (void | Destructor),
	updateConditionOrDeps: boolean | readonly any[]
): void {

	const { deps } = useUpdateConditionOrDeps({ 
		updateConditionOrDeps,
		"hookName": useEffectIf.name
	});

	useEffect(
		() => {

			//Only necessary for fist render.
			if (updateConditionOrDeps === false) {
				return;
			}

			return effect();

		},
		deps
	);

}

