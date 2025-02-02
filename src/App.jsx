import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

const StudyTracker = () => {
  // States remain the same
  const [loggedIn, setLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem("todos")) || []);
  const [todoText, setTodoText] = useState('');
  const [todoCategory, setTodoCategory] = useState('');
  const [todoDueDate, setTodoDueDate] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [reminders, setReminders] = useState(() => JSON.parse(localStorage.getItem("reminders")) || []);
  const [reminderMessage, setReminderMessage] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [progressData, setProgressData] = useState(() => JSON.parse(localStorage.getItem("progress")) || {});

  // Effects and handlers remain the same
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("reminders", JSON.stringify(reminders));
    localStorage.setItem("progress", JSON.stringify(progressData));
  }, [todos, reminders, progressData]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // All handlers remain the same
  const handleLogin = () => setLoggedIn(!loggedIn);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const addOrUpdateTodo = (e) => {
    e.preventDefault();
    if (!todoText.trim() || !todoCategory) return;

    if (editingTodo) {
      setTodos(todos.map(todo => (todo.id === editingTodo.id ? { ...todo, text: todoText, category: todoCategory, dueDate: todoDueDate } : todo)));
      setEditingTodo(null);
    } else {
      setTodos([...todos, { id: Date.now(), text: todoText, category: todoCategory, dueDate: todoDueDate, completed: false }]);
    }

    setTodoText('');
    setTodoCategory('');
    setTodoDueDate('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const updatedTodo = { ...todo, completed: !todo.completed };
        if (updatedTodo.completed) {
          const today = new Date().toISOString().split('T')[0];
          setProgressData(prev => ({
            ...prev,
            [today]: (prev[today] || 0) + 1
          }));
        }
        return updatedTodo;
      }
      return todo;
    }));
  };

  const deleteTodo = (id) => setTodos(todos.filter(todo => todo.id !== id));

  const editTodo = (todo) => {
    setEditingTodo(todo);
    setTodoText(todo.text);
    setTodoCategory(todo.category);
    setTodoDueDate(todo.dueDate);
  };

  const addReminder = (e) => {
    e.preventDefault();
    if (!reminderMessage.trim() || !reminderTime) return;
    setReminders([...reminders, { id: Date.now(), message: reminderMessage, time: reminderTime }]);
    setReminderMessage('');
    setReminderTime('');
  };

  const deleteReminder = (id) => setReminders(reminders.filter(reminder => reminder.id !== id));

  // Prepare chart data for Recharts
  const barChartData = [
    { name: 'Tasks', completed: todos.filter(todo => todo.completed).length, pending: todos.filter(todo => !todo.completed).length }
  ];

  const lineChartData = Object.entries(progressData).map(([date, count]) => ({
    date,
    tasks: count
  })).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className={`min-h-screen w-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 w-screen'}`}>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">📚 Study Tracker</h1>

        {/* Top Bar */}
        <div className="flex justify-between mb-6">
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            onClick={handleLogin}
          >
            {loggedIn ? 'Logout' : 'Login'}
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            onClick={toggleDarkMode}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {loggedIn && (
          <div className="space-y-8">
            {/* Flex Container for To-Do List & Reminders */}
            <div className="flex flex-wrap gap-8">
              {/* To-Do List */}
              <section className="w-full md:w-[calc(50%-1rem)]">
                <h2 className="text-2xl font-semibold mb-4">📝 To-Do List</h2>
                <form onSubmit={addOrUpdateTodo} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Task"
                    value={todoText}
                    onChange={(e) => setTodoText(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-50 border-gray-200 focus:border-blue-500'
                    } outline-none transition-colors`}
                  />
                  <select
                    value={todoCategory}
                    onChange={(e) => setTodoCategory(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-50 border-gray-200 focus:border-blue-500'
                    } outline-none transition-colors`}
                  >
                    <option value="">Select Category</option>
                    {['Study', 'Assignment', 'Project', 'Personal'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={todoDueDate}
                    onChange={(e) => setTodoDueDate(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-50 border-gray-200 focus:border-blue-500'
                    } outline-none transition-colors`}
                  />
                  <button 
                    type="submit"
                    className={`w-full p-3 rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {editingTodo ? 'Update Task' : 'Add Task'}
                  </button>
                </form>

                <ul className="mt-6 space-y-3">
                  {todos.map((todo) => (
                    <li key={todo.id} className={`p-4 rounded-lg ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
                          {todo.text} ({todo.category}) - {todo.dueDate}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleTodo(todo.id)}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              darkMode 
                                ? 'bg-gray-700 hover:bg-gray-600' 
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {todo.completed ? 'Undo' : 'Complete'}
                          </button>
                          <button
                            onClick={() => editTodo(todo)}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              darkMode 
                                ? 'bg-gray-700 hover:bg-gray-600' 
                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            }`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              darkMode 
                                ? 'bg-red-900 hover:bg-red-800' 
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Study Progress Graphs */}
              <section className="w-full md:w-[calc(50%-1rem)]">
                <h2 className="text-2xl font-semibold mb-4">📊 Study Progress</h2>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <BarChart width={400} height={300} data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#28a745" name="Completed" />
                    <Bar dataKey="pending" fill="#ffcc00" name="Pending" />
                  </BarChart>
                </div>
                <h2 className="text-2xl font-semibold mt-8 mb-4">📅 Daily Progress</h2>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <LineChart width={400} height={300} data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tasks" stroke="#007BFF" />
                  </LineChart>
                </div>
              </section>
            </div>

            {/* Reminders Section */}
            <section className="w-full">
              <h2 className="text-2xl font-semibold mb-4">🔔 Reminders</h2>
              <form onSubmit={addReminder} className="space-y-3 mb-6">
                <input
                  type="text"
                  placeholder="Reminder Message"
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200 focus:border-blue-500'
                  } outline-none transition-colors`}
                />
                <input
                  type="datetime-local"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200 focus:border-blue-500'
                  } outline-none transition-colors`}
                />
                <button 
                  type="submit"
                  className={`w-full p-3 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  Add Reminder
                </button>
              </form>

              <ul className="space-y-3">
                {reminders.length > 0 ? (
                  reminders.map((reminder) => (
                    <li 
                      key={reminder.id} 
                      className={`p-4 rounded-lg flex justify-between items-center ${
                        darkMode ? 'bg-gray-800' : 'bg-gray-50'
                      }`}
                    >
                      <span>{reminder.message} at {reminder.time}</span>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          darkMode 
                            ? 'bg-red-900 hover:bg-red-800' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        Delete
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No reminders set yet.</p>
                )}
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyTracker;