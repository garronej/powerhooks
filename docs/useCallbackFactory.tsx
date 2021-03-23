// @ts-nocheck

//Without powerhooks:

array.map(({ todo, isCompeted }) =>
    <TodoItem
        todo={todo}
        isCompleted={isCompeted}
        onComplete={() => setCompleted(todo)}
    />
);

// Even if <TodoItem> uses React.memo, each time 
// a item of the list is set to completed 
// every <TodoItem> is re-renders because of
// onComplete that changes at every render for every item.

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

// Whereas the value returned by onCompleteFactory is
// always the same for a specific todo.

// Whereas here we can set an element of the list to 
// completed without re-rendering every items.







