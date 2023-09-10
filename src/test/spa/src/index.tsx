import { createRoot } from "react-dom/client";
import { StrictMode, useState } from "react";
import { TestUseEffectIf } from "./TestUseEffectIf";
import { TestUseGlobalState } from "./TestUseGlobalState";

const testIds = ["useEffectIf", "useGlobalState"] as const;

type TestId = typeof testIds[number];

function Component() {

	const [testId, setTestId] = useState<TestId>("useGlobalState");

	return (
		<>
			<select value={testId} onChange={event => setTestId(event.target.value as any)}>
				{
					testIds.map(testId =>
						<option
							key={testId}
							value={testId}
						>
							{testId}
						</option>
					)
				}

			</select>
			{(() => {
				switch (testId) {
					case "useEffectIf": return <TestUseEffectIf />;
					case "useGlobalState": return <TestUseGlobalState />
				}
			})()}
		</>
	);


}

createRoot(document.getElementById("root") as HTMLElement)
	.render(
		<StrictMode>
			<Component />
		</StrictMode>
	);