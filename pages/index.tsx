// frontend/pages/index.tsx
import { useState, useEffect, ChangeEvent } from 'react';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  useEffect(() => {
    fetch('/api/todos')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch todos');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setTodos(data);
        } else {
          console.error('Received data is not an array:', data);
          setTodos([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
      });
  }, []);

  const addTodo = () => {
    if (!newTodo.trim()) return; // 空の入力を防ぐ

    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo, completed: false }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to add todo');
        }
        return res.json();
      })
      .then(() => {
        setTodos([...todos, { id: todos.length + 1, title: newTodo, completed: false }]);
        setNewTodo('');
      })
      .catch((error) => {
        console.error('Error adding todo:', error);
      });
  };


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={handleInputChange}
        placeholder="Add a new todo"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
