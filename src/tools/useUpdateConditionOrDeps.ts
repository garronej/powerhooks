import { useRef } from "react";
import { assert } from "tsafe/assert";

const depsMaxLength = 9;

const privateObject= {}

export function useUpdateConditionOrDeps(
	props: {
		updateConditionOrDeps: boolean | readonly any[],
		/** For more insightful debug messages */
		hookName?: string;
	}
): { deps: readonly any[]; } {

	const { 
		updateConditionOrDeps, 
		hookName = useUpdateConditionOrDeps.name
	} = props;

	const depsRef = useRef<readonly any[]>(new Array(depsMaxLength).fill(privateObject));

	depsRef.current = typeof updateConditionOrDeps === "boolean" ?
		updateConditionOrDeps ?
			[{}, ...new Array(depsMaxLength - 1).fill(privateObject)] :
			depsRef.current
		:
		(
			assert(
				updateConditionOrDeps.length <= depsMaxLength,
				`dependency array passed to ${hookName} can only contain at most ${depsMaxLength} elements`
			),
			[
				...updateConditionOrDeps,
				...new Array(depsMaxLength - updateConditionOrDeps.length).fill(privateObject)
			]
		);

	return { "deps": depsRef.current };

}
