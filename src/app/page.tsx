"use client";

import Image from "next/image";
import sunImg from "../../public/images/icon-sun.svg";
import moonImg from "../../public/images/icon-moon.svg";
import cancelImg from "../../public/images/icon-cross.svg";
import { ChangeEvent, useEffect, useState } from "react";

export default function Home() {
  const [todoInput, setTodoInput] = useState("");
  const [todoList, setTodoList] = useState<{ id: number; text: string }[]>([]);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [completedList, setCompletedList] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState("all");
  const [mappingObject, setMappingObject] = useState<typeof todoList>([]);
  const [theme, setTheme] = useState("dark");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodoInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && todoInput.trim() !== "") {
      const newTask = { id: Date.now(), text: todoInput.trim() };
      setTodoList((prev) => [...prev, newTask]);
      setTodoInput("");
    }
  };

  const handleCompleted = (taskId: number) => {
    setCompletedList((prev) =>
        prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleDelete = (taskId: number) => {
    setTodoList((prev) => prev.filter((task) => task.id !== taskId));
    setCompletedList((prev) => prev.filter((id) => id !== taskId));
  };

  const handleClearCompleted = () => {
    setTodoList((prev) => prev.filter((task) => !completedList.includes(task.id)));
    setCompletedList([]);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    switch (filterBy) {
      case "all":
        setMappingObject([...todoList]);
        break;
      case "active":
        setMappingObject(todoList.filter((task) => !completedList.includes(task.id)));
        break;
      case "completed":
        setMappingObject(todoList.filter((task) => completedList.includes(task.id)));
        break;
      default:
        setMappingObject([...todoList]);
    }
  }, [filterBy, todoList, completedList]);

  return (
      <div className={ ` w-full h-screen  ${theme === "dark" ? "dark-theme" : "light-theme"}`}>
        <div className="header_img flex relative flex-col justify-center items-center">
          <div className="flex w-[40%] gap-5 justify-between items-center">
            <h3 className="text-3xl font-bold">TODO</h3>
            <span onClick={toggleTheme} className="cursor-pointer">
              <Image src={theme === "dark" ? sunImg : moonImg} alt="Theme Toggle" />
            </span>
          </div>
          <div className="mt-10 flex items-center py-4 px-8 gap-5 bg-veryDarkDesaturatedBlue input-bg  w-[40%]">
            <button className="bg-transparent w-6 h-6 rounded-full border border-veryDarkGrayishBlue"></button>
            <input
                className="bg-transparent border-none outline-none"
                placeholder="Start typing here"
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                value={todoInput}
            />
          </div>

          <div className="absolute w-full top-48 flex flex-col justify-center items-center">
            {todoList.length > 0 ? (
                <div className="input-bg  mt-20 w-[40%]">
                  {mappingObject.map((task) => (
                      <div
                        key={task.id}
                        onMouseEnter={() => setHoverIndex(task.id)}
                        onMouseLeave={() => setHoverIndex(-1)}
                        className="flex cursor-pointer items-center py-4 px-6 border-b border-b-slate-300 justify-between"
                      >
                        <div className="flex gap-5">
                          <button
                              className={`${
                                  completedList.includes(task.id)
                                      ? "checkedLinearGradient"
                                      : "bg-transparent"
                              } w-6 h-6 rounded-full border border-veryDarkGrayishBlue`}
                              onClick={() => handleCompleted(task.id)}
                          ></button>
                          <p
                              className={`text-lightGrayishBlue ${
                                  completedList.includes(task.id) ? "line-through" : ""
                              }`}
                          >
                            {task.text}
                          </p>
                        </div>
                        {hoverIndex === task.id && (
                          <span onClick={() => handleDelete(task.id)}>
                            <Image src={cancelImg} alt="Cancel" />
                          </span>
                        )}
                      </div>
                  ))}
                  <hr  />
                  <div className="flex justify-between items-center px-6 py-4 text-darkGrayishBlue font-bold">
                    <div>
                      <p>{todoList.filter((task) => !completedList.includes(task.id)).length} items left</p>
                    </div>
                    <div className="flex gap-5 justify-center cursor-pointer">
                  <span
                      className={`hover:text-white ${filterBy === "all" && "text-blue-500"}`}
                      onClick={() => setFilterBy("all")}
                  >
                    All
                  </span>
                      <span
                          className={`hover:text-white ${filterBy === "active" && "text-blue-500"}`}
                          onClick={() => setFilterBy("active")}
                      >
                    Active
                  </span>
                      <span
                          className={`hover:text-white ${filterBy === "completed" && "text-blue-500"}`}
                          onClick={() => setFilterBy("completed")}
                      >
                    Completed
                  </span>
                    </div>
                    <div>
                      <p className="cursor-pointer hover:text-white" onClick={handleClearCompleted}>
                        Clear Completed
                      </p>
                    </div>
                  </div>
                </div>
            ) : (
                <p className="text-lightGrayishBlue mt-10">No tasks yet! Start adding some.</p>
            )}
          </div>
        </div>
      </div>
  );
}
