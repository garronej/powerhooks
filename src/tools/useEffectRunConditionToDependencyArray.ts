import { useRef, useEffect } from "react";
import { assert } from "tsafe/assert";

export type EffectRunCondition<Deps extends readonly any[] = readonly any[]> = boolean | Deps | { doRunOnlyOnChange: boolean; deps: Deps };

const depsMaxLength = 9;

const privateObject = {}

/**
 * Hooks for having better control on when an effect should be run.
 * 
 * function useMyEffect(effect: ()=> void; effectRunCondition: EffectRunCondition) {
 * 
 *     const { deps, doSkipEffectRun }= useEffectRunConditionToDependencyArray({ 
 *         effectRunCondition, 
 *         "hookName": useMyEffect.name 
 *     });
 * 
 *     useEffect(()=> {
 *         if( doSkipEffectRun ) return;
 * 	       effect();
 *     }, deps);
 * 
 * }
 * 
 */
export function useEffectRunConditionToDependencyArray(
	props: {
		effectRunCondition: EffectRunCondition,
		/** For more insightful debug messages */
		hookName?: string;
	}
): { deps: readonly any[]; doSkipEffectRun: boolean; } {

	const {
		effectRunCondition,
		hookName = useEffectRunConditionToDependencyArray.name
	} = props;

	const refIsFistRender = useRef(true);

	useEffect(() => { refIsFistRender.current = false; }, []);

	const depsRef = useRef<readonly any[]>(new Array(depsMaxLength).fill(privateObject));

	const { deps, doSkipEffectRun } = (() => {

		if (typeof effectRunCondition === "boolean") {

			return {
				"deps": effectRunCondition ?
					[{}, ...new Array(depsMaxLength - 1).fill(privateObject)] :
					depsRef.current,
				"doSkipEffectRun": !effectRunCondition
			};

		}

		const [shortDeps, doSkipEffectRun] = "length" in effectRunCondition ?
			[effectRunCondition, false] :
			[
				effectRunCondition.deps,
				effectRunCondition.doRunOnlyOnChange && refIsFistRender.current
			];

		assert(
			shortDeps.length <= depsMaxLength,
			`dependency array passed to ${hookName} can only contain at most ${depsMaxLength} elements`
		);

		const deps = [
			...shortDeps,
			...new Array(depsMaxLength - shortDeps.length).fill(privateObject)
		];

		return { deps, doSkipEffectRun };

	})();

	depsRef.current = deps;

	return { 
		deps, 
		doSkipEffectRun /* NOTE: Only necessary for fist render */
	};

}
