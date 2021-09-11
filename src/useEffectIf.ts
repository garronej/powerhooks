import { useEffectRunConditionToDependencyArray } from "./tools/useEffectRunConditionToDependencyArray";
import type { EffectRunCondition } from "./tools/useEffectRunConditionToDependencyArray";
import * as React from "react";
import { assert } from "tsafe/assert";
const { useEffect } = React;

export type Destructor = () => void;

export type { EffectRunCondition };

export function useEffectIf<Deps extends readonly any[]>(
	effect: (params:{ deps: Deps; }) => (void | Destructor),
	effectRunCondition: EffectRunCondition<Deps>
): void {

	const { deps, doSkipEffectRun } = useEffectRunConditionToDependencyArray({ 
		effectRunCondition,
		"hookName": useEffectIf.name
	});

	useEffect(
		() => {

			if( doSkipEffectRun ) return;

			assert(effectRunCondition !== false);

			return effect({ 
				"deps": effectRunCondition === true ?
					[] as any : "length" in effectRunCondition ?
						effectRunCondition :
						effectRunCondition.deps
			});

		},
		deps
	);

}

/*
type Shape = { type: "circle"; radius: number; } | { type: "square"; sideLength: number; };

const shape: Shape = null as any;

useEffectIf(
	({ deps: [ radius ] })=> {
	},
	shape.type !== "circle" ? false : { "doRunOnlyOnChange": true, "deps": [shape.radius, "foo"] as const }
);
*/
