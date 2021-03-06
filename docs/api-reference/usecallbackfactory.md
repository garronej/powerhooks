# useCallbackFactory





```jsx
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import React, {useState, memo, useCallback} from "react";

type Task = {
    description: string;
    isInEditingState: boolean;
}

export const UseCallbackFactoryExample = ()=>{

    const [tasks, setTasks] = useState<Task[]>(
        [
            {
                "description": "piano practice",
                "isInEditingState": false
            },

            {
                "description": "clean the house",
                "isInEditingState": false
            }
        ]
    );

    const onClickFactory = useCallbackFactory(([taskIndex]: [number])=>{

        if(tasks[taskIndex].isInEditingState){
            return;
        }
        
       tasks[taskIndex].isInEditingState = true,

        setTasks([...tasks])

    });


    const onEditTaskFactory = useCallbackFactory(
        (
            [taskIndex]: [number],
            [params]: [{
                newDescription: string;
            }]
        )=>{
            const {newDescription} = params;

            setTasks((
                tasks[taskIndex].description = newDescription,
                tasks[taskIndex].isInEditingState = false,
                [...tasks]
            ));
        }
    );





    return(
        <div>
            <h1>UseCallbackFactory Example:</h1>
            <ul>
                {
                    tasks.map(
                        (task, index)=> 
                        <TaskComponent 
                            description={task.description} 
                            isInEditingState={task.isInEditingState} 
                            onClick={onClickFactory(index)}
                            onEditTask={onEditTaskFactory(index)}
                            key={`${task.description}+${index}`}
                        />
                    )
                }
            </ul>
        </div>
    )
}


const {TaskComponent} = (()=>{
    type Props = Task & {
        onClick(): void;
        onEditTask(
            params: {
                newDescription: string;
            }
        ): void;
    };

    const TaskComponent = memo((props: Props)=>{


        const {description, isInEditingState, onClick, onEditTask} = props;
        const [textInput, setTextInput] = useState("");


        console.log(`render ${description}`);

        const onChange= useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
            setTextInput(e.target.value);
        },[])

        const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>)=>{
            if(textInput === ""){
                return;
            }

            e.preventDefault();

            onEditTask({
                "newDescription": textInput
            });

            setTextInput("");

        },[onEditTask, textInput])


        return (
            <li onClick={onClick}>
                {
                    isInEditingState ? 
                    <form onSubmit={onSubmit}>
                        <input autoFocus 
                        onChange={onChange} value={textInput} type="text"/>
                    </form> : description
                }
            </li>
        )
    });

    return {TaskComponent};
})()



```

