'use client';

import { ListTodo, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Project, Todo } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';

interface TodoListProps {
  project: Project;
  projectActions: {
    addTodo: (projectId: string, todoText: string) => void;
    updateTodo: (projectId: string, updatedTodo: Todo) => void;
    deleteTodo: (projectId: string, todoId: string) => void;
  };
}

export function TodoList({ project, projectActions }: TodoListProps) {
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      projectActions.addTodo(project.id, newTodoText.trim());
      setNewTodoText('');
    }
  };

  const handleToggleTodo = (todo: Todo) => {
    projectActions.updateTodo(project.id, {
      ...todo,
      completed: !todo.completed,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="w-5 h-5" />
          To-Do List
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new to-do item..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <Button onClick={handleAddTodo}>Add</Button>
        </div>
        <div className="space-y-2">
          {project.todos.length > 0 ? (
            project.todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleTodo(todo)}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`flex-1 text-sm ${todo.completed ? 'text-muted-foreground line-through' : ''}`}
                >
                  {todo.text}
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => projectActions.deleteTodo(project.id, todo.id)}
                  aria-label={`Delete to-do: ${todo.text}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No to-do items yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
