import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import "./App.css";
import search from "./assets/search.svg";
import search_white from "./assets/search-white.svg";
import crt from "./assets/chevron-top.svg";
import detective from "./assets/detective.png";
import detective_dark from "./assets/detective-dark.png";
import plus from "./assets/plus.svg";
import pencil from "./assets/pencil.svg";
import bin from "./assets/bin.svg";
import dark from "./assets/dark.svg";
import light from "./assets/light.svg";

function App() {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);

  function handleApply() {
    if (inputValue.trim() === "") return;
    if (!editingTodo) {
      const newObj = {
        id: Date.now(),
        text: inputValue,
        completed: false,
      };
      setTodos((prev) => prev.concat(newObj));
      setInputValue("");
      setEditingTodo(null);
      setDialogOpen(false);
    } else {
      setTodos((prev) =>
        prev.map((todo) => {
          if (todo.id === editingTodo.id) {
            const newObj = { ...todo, text: inputValue };
            return newObj;
          } else {
            return todo;
          }
        }),
      );
      setInputValue("");
      setEditingTodo(null);
      setDialogOpen(false);
    }
  }
  function complete(id) {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const newObj = { ...todo, completed: !todo.completed };
          return newObj;
        } else {
          return todo;
        }
      }),
    );
  }
  const visibleTodos = (
    filter === "all"
      ? todos
      : filter === "completed"
        ? todos.filter((todo) => todo.completed)
        : todos.filter((todo) => !todo.completed)
  ).filter((todo) =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  function delTodos(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTodos(parsed);
    }
    setIsLoaded(true);
  }, []);
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos, isLoaded]);

  return (
    <div className={`${theme}`}>
      <div className="container">
        <div className="head">
          <h1 className="title">TODO LIST</h1>
          <div className="header">
            <div className="search">
              <input
                className="search-input"
                type="text"
                name="query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search note..."
              />
              <img
                src={theme === "light" ? search : search_white}
                alt="search"
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="select-wrapper">
              <select
                className="filter"
                name="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="active">Active</option>
              </select>
              <img className="crt" src={crt} alt="chevron-top" />
            </div>
            <button
              className="theme"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <img src={theme === "light" ? dark : light} alt="theme" />
            </button>
          </div>
        </div>
        {dialogOpen && (
          <div className="overlay" onClick={() => setDialogOpen(false)}>
            <div className="dialog" onClick={(e) => e.stopPropagation()}>
              <h2 className="note-title">
                {editingTodo ? "EDIT NOTE" : "NEW NOTE"}
              </h2>
              <input
                type="text"
                name="note"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Input your note..."
              />
              <div className="dialog-actions">
                <button
                  className="dialog-btn cancel"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </button>
                <button className="dialog-btn" onClick={handleApply}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="body">
          <ul className="list">
            {visibleTodos.length !== 0 ? (
              visibleTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={todo.completed ? "note note-completed" : "note"}
                >
                  <div className="left">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        id={`complete-${todo.id}`}
                        className="todo"
                        name="complete"
                        checked={todo.completed}
                        onChange={() => complete(todo.id)}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <span className="todo-name">{todo.text}</span>
                  </div>
                  <div className="right">
                    <button
                      onClick={() => {
                        setEditingTodo(todo);
                        setInputValue(todo.text);
                        setDialogOpen(true);
                      }}
                    >
                      <img src={pencil} alt="pencil" />
                    </button>
                    <button onClick={() => delTodos(todo.id)}>
                      <img src={bin} alt="bin" />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <div className="empty">
                <img
                  src={theme === "light" ? detective : detective_dark}
                  alt="detective"
                  width={221}
                />
                <p className="empty-text">Empty...</p>
              </div>
            )}
          </ul>
          <button
            className="add"
            onClick={() => {
              setEditingTodo(null);
              setInputValue("");
              setDialogOpen(true);
            }}
          >
            <img src={plus} alt="plus" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
