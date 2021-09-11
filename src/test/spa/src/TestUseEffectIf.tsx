
import { useEffectIf } from "powerhooks/useEffectIf";
import { useTicker } from "./tools/useTicker";
import { useEffect, useRef } from "react";


type Shape = Shape.Circle | Shape.Square;

declare namespace Shape {
	export type Circle = { type: "circle"; radius: number; };
	export type Square = { type: "square"; sideLength: number; };
}

export function TestUseEffectIf() {

	const shapeRef = useRef<Shape>({
		"type": "square",
		"sideLength": 10

	});

	const { tick } = useTicker(1000);

	useEffect(
		() => {

			console.log(`Current shape: ${JSON.stringify(shapeRef.current)}`);

			if (tick === 3) {

				shapeRef.current = {
					"type": "circle",
					"radius": 10
				};

				return;

			}

			if (tick === 6) {

				shapeRef.current = {
					"type": "circle",
					"radius": 20
				};

				return;

			}

			if (tick === 9) {

				shapeRef.current ={
					"type": "circle",
					"radius": 30
				};

				return;

			}

		},
		[tick]
	);

	useEffectIf(
		({ deps: [radius] }) => {
			console.log("===================>", { radius });
		},
		shapeRef.current.type !== "circle" ?
			false :
			{
				"doRunOnlyOnChange": true,
				"deps": [shapeRef.current.radius, "foo"] as const
			}
	);

	return <h1>{tick} {JSON.stringify(shapeRef.current)}</h1>


}
