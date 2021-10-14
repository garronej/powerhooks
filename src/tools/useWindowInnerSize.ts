

import { Evt } from "evt";
import { useEffect } from "react";
import { useEvt } from "evt/hooks/useEvt";
import { useRerenderOnStateChange } from "evt/hooks/useRerenderOnStateChange";

export function useWindowInnerSize(): {
	windowInnerWidth: number;
	windowInnerHeight: number;
} {

	const evtInnerWidth = useEvt(
		ctx => {

				return Evt.create({
					"windowInnerWidth": 1920,
					"windowInnerHeight": 1080
				});

				/*
			//For SSR
			if (typeof window === "undefined") {
				return Evt.create({
					"windowInnerWidth": 50,
					"windowInnerHeight": 50
				});
			}

			return Evt.from(ctx, window, "resize")
				.toStateful()
				.pipe(() => [{
					"windowInnerWidth": window.innerWidth,
					"windowInnerHeight": window.innerHeight
				}]);
				*/
		},
		[]
	);

	useEffect(
		() => {

			console.log("wesh alors?");

			console.log(evtInnerWidth.state);

			evtInnerWidth.state = {
				"windowInnerWidth": window.innerWidth,
				"windowInnerHeight": window.innerHeight
			};
		},
		[]
	);


	useRerenderOnStateChange(evtInnerWidth);

	const { windowInnerWidth, windowInnerHeight } = evtInnerWidth.state;

	return { windowInnerWidth, windowInnerHeight };

}