import React, { useState } from 'react';

const StudyTracker = () => {
  // State for To‑Do List
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState('');

  // State for Reminders
  const [reminders, setReminders] = useState([]);
  const [reminderMessage, setReminderMessage] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  // --- To‑Do List Functions ---
  const addTodo = (e) => {
    e.preventDefault();
    if (!todoText.trim()) return;
    const newTodo = { id: Date.now(), text: todoText, completed: false };
    setTodos([...todos, newTodo]);
    setTodoText('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // --- Reminder Functions ---
  const addReminder = (e) => {
    e.preventDefault();
    if (!reminderMessage.trim() || !reminderTime) return;
    const newReminder = { id: Date.now(), message: reminderMessage, time: reminderTime };
    setReminders([...reminders, newReminder]);
    setReminderMessage('');
    setReminderTime('');
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  return (
    <div className="p-6 font-sans w-screen mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Study Tracker</h1>

      {/* To‑Do List Section */}
      <section className="mb-6">
        <h2 className="text-2xl mb-2">To‑Do List</h2>
        <form onSubmit={addTodo} className="mb-4">
          <input
            type="text"
            placeholder="Add a task"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            className="p-2 w-2/3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="p-2 ml-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Add
          </button>
        </form>
        <ul className="list-none p-0">
          {todos.map(todo => (
            <li key={todo.id} className="mb-2 flex items-center">
              <span
                onClick={() => toggleTodo(todo.id)}
                className={`flex-1 cursor-pointer ${todo.completed ? 'line-through' : ''}`}
              >
                {todo.text}
              </span>
              <button onClick={() => deleteTodo(todo.id)} className="ml-3 p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Reminders Section */}
      <section className="mb-6">
        <h2 className="text-2xl mb-2">Reminders</h2>
        <form onSubmit={addReminder} className="mb-4">
          <input
            type="text"
            placeholder="Reminder message"
            value={reminderMessage}
            onChange={(e) => setReminderMessage(e.target.value)}
            className="p-2 w-2/5 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="datetime-local"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="p-2 ml-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="p-2 ml-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Add Reminder
          </button>
        </form>
        <ul className="list-none p-0">
          {reminders.map(reminder => (
            <li key={reminder.id} className="mb-2 border-b border-gray-300 pb-2">
              <div>
                <strong>{reminder.message}</strong> at {new Date(reminder.time).toLocaleString()}
              </div>
              <button onClick={() => deleteReminder(reminder.id)} className="mt-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default StudyTracker;
