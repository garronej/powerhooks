

/** Memoize a function with no arguments. */
export function memoize0<F extends ()=> unknown>(fn: F): F{

	let wrapCache: [any] | undefined = undefined;

	const memoizedFn= ()=> {

		if (wrapCache === undefined) {
			wrapCache = [fn()];
		}

		return wrapCache[0];

	}

	return memoizedFn as any as F;

}