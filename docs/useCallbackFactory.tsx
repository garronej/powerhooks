// @ts-nocheck

                //Without powerhooks:

                array.map(({ todo, isCompeted }) =>
                    <TodoItem
                        todo={todo}
                        isCompleted={isCompeted}
                        onComplete={() => setCompleted(todo)}
                    />
                );

                //With:

                import { useCallbackFactory } from "powerhooks";

                const onCompleteFactory = useCallbackFactory(
                    ([todo]: [string])=> setCompleted(todo)
                );
                
                array.map(({ todo, isCompeted }) =>
                    <TodoItem
                        todo={todo}
                        isCompleted={isCompeted}
                        onComplete={onCompleteFactory(todo)}
                    />
                );






