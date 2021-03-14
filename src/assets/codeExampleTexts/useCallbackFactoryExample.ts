export const useCallbackFactoryExample = `import {useCallbackFactory} from "powerhooks";
import {useState, memo, useCallback} from "react";

type Task = {
    description: string;
    isInEditingState: boolean;
}

export const TodoList = ()=>{

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

    const onClickFactory = useCallbackFactory(
        ([taskIndex]: [number])=>{

            if(tasks[taskIndex].isInEditingState){
                return;
            }

            setTasks((()=>{
                const newTasks = [...tasks];

                newTasks[taskIndex].isInEditingState = true;

                return newTasks;
            })());
        }
    );


    const onEditTaskFactory = useCallbackFactory(
        (
            [taskIndex]: [number],
            [params]: [{
                newDescription: string;
            }]
        )=>{
            const {newDescription} = params;

            setTasks((()=>{

                const newTasks = [...tasks];

                newTasks[taskIndex].description = newDescription;
                newTasks[taskIndex].isInEditingState = false;

                return newTasks;

            })())

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
                            key={}
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

        const {
            description, 
            isInEditingState, 
            onClick, 
            onEditTask
        } = props;

        const [textInput, setTextInput] = useState("");


        console.log("render");

        const onChange= useCallback(
            (e: React.ChangeEvent<HTMLInputElement>)=>{
                setTextInput(e.target.value);
            }
        ,[])

        const onSubmit = useCallback(
            (e: React.FormEvent<HTMLFormElement>)=>{
                if(textInput === ""){
                    return;
                }

                e.preventDefault();

                onEditTask({
                    "newDescription": textInput
                });

                setTextInput("");
            }
        ,[onEditTask, textInput])


        return (
            <li onClick={onClick}>
                {
                    isInEditingState ? <form onSubmit={onSubmit}>
                        <input 
                            autoFocus 
                            onChange={onChange} 
                            value={textInput} 
                            type="text"
                        />
                    </form> : description
                }
            </li>
        )
    });

    return {TaskComponent};
})()


`