import React, { useState } from "react";
import { Calendar, Plus, Edit2, CheckSquare, Check, Trash2 } from "lucide-react";
import { TodoItem } from "../../types/todo";

interface TodoViewProps {
  todoList: TodoItem[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onAddQuickTodo: (title: string) => void;
  onOpenSettings: () => void;
}

export const TodoView: React.FC<TodoViewProps> = ({
  todoList = [],
  onToggleTodo,
  onDeleteTodo,
  onAddQuickTodo,
  onOpenSettings,
}) => {
  const [quickInput, setQuickInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  const completedCount = todoList.filter((t) => t.completed).length;
  const totalCount = todoList.length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onAddQuickTodo(quickInput.trim());
    setQuickInput("");
    setShowInput(false);
  };

  return (
    <div className="flex h-full w-full select-none text-white items-center gap-4 px-2">
      {/* Left Column: Large Counter & Actions */}
      <div className="flex flex-col justify-between h-full w-[44%] py-0.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
              {completedCount}/{totalCount}
            </span>
            <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center text-blue-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xs text-white/60 font-medium">Task Done Today</p>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <button
            type="button"
            onClick={() => setShowInput(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:scale-105 active:scale-95 transition-all shadow"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Task</span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 text-white/80 hover:bg-white/20 text-xs font-medium transition-colors"
          >
            <Edit2 className="h-3 w-3" />
            <span>Edit Task</span>
          </button>
        </div>
      </div>

      <div className="w-[1px] h-full bg-white/10" />

      {/* Right Column: Checklist Card */}
      <div className="flex-1 h-full rounded-2xl bg-white/[0.04] border border-white/10 p-2.5 overflow-hidden flex flex-col justify-center">
        {showInput ? (
          <form onSubmit={handleAdd} className="flex items-center gap-1.5 w-full">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Task title..."
              autoFocus
              className="flex-1 bg-white/10 rounded-xl px-2.5 py-1 text-xs outline-none text-white border border-white/20"
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded-xl bg-blue-500 text-white text-xs font-medium"
            >
              Add
            </button>
          </form>
        ) : todoList.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center mb-1 text-white/40">
              <CheckSquare className="h-5 w-5" />
            </div>
            <p className="text-xs text-white/50">No tasks.</p>
          </div>
        ) : (
          <div className="h-full overflow-y-auto scrollbar-none space-y-1.5 pr-1">
            {todoList.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] transition-colors"
              >
                <div
                  onClick={() => onToggleTodo(task.id)}
                  className="flex items-center gap-2 cursor-pointer min-w-0 flex-1"
                >
                  <div
                    className={`h-4 w-4 rounded-md border flex items-center justify-center ${
                      task.completed
                        ? "bg-emerald-500 border-emerald-400 text-white"
                        : "border-white/30"
                    }`}
                  >
                    {task.completed && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-xs truncate ${
                      task.completed ? "line-through text-white/40" : "text-white/90"
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteTodo(task.id)}
                  className="p-1 text-white/30 hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
