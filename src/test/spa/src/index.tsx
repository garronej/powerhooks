import { StrictMode, useState } from "react";
import { render } from "react-dom";
import { TextViewPortAdapter } from "./TestViewPortAdapter";
import { TestUseEffectIf } from "./TestUseEffectIf";

const testIds = ["useEffectIf", "ViewPortAdapter"] as const;

type TestId = typeof testIds[number];

function Component() {

    const [testId, setTestId] = useState<TestId>("useEffectIf");

    return (
        <>
            {testId !== "ViewPortAdapter" &&
                <select value={testId} onChange={event => setTestId(event.target.value as any)}>
                    {
                        testIds.map(testId =>
                            <option
                                key={testId}
                                value={testId}>
                                {testId}
                            </option>
                        )
                    }
                </select>
            }
            {(() => {

                switch (testId) {
                    case "ViewPortAdapter": return <TextViewPortAdapter />;
                    case "useEffectIf": return <TestUseEffectIf />;
                }


            })()}
        </>
    );

}

render(
    <StrictMode>
        <Component />
    </StrictMode>,
    document.getElementById("root")
);

