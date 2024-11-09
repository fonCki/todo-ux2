import React, {useEffect, useState} from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Task as TaskType } from '../types';
import Task from './Task';
import AddTaskModal from './AddTaskModal';
import Profile from './Profile'; // Import Profile component
import { FaTrashAlt } from 'react-icons/fa';
import FishTank from "./FishTank";
import {predefinedTasks} from "../data/tasks";

const TaskBoard: React.FC = () => {
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAKeyPressed, setIsAKeyPressed] = useState(false);

    useEffect(() => {
        getRandomTask();
        getRandomTask();
    }, []);

    // Function to be called when 'a' is held down and button is clicked
    const getRandomTask = () => {
        const randomIndex = Math.floor(Math.random() * predefinedTasks.length);
        const randomTask = predefinedTasks[randomIndex];
        setTasks(prev => [...prev, randomTask]);

    };

    // Event handlers for key down and key upa
    useEffect(() => {
        const handleKeyDown = (event:any) => {
            if (event.key === 'a') {
                setIsAKeyPressed(true);
            }
        };
        const handleKeyUp = (event:any) => {
            if (event.key === 'a') {
                setIsAKeyPressed(false);
            }
        };

        // Add event listeners to the window
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Cleanup listeners on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Modified onClick handler for the button
    const handleButtonClick = () => {
        if (isAKeyPressed) {
            getRandomTask();
        } else {
            setIsModalOpen(true);
        }
    };
    const addTask = (taskData: { title: string; difficulty: number; deadline: Date }) => {
        const newTask: TaskType = {
            id: Math.random(),
            title: taskData.title,
            difficulty: taskData.difficulty,
            deadline: taskData.deadline,
            deleted: false,
            completed: false
        };
        setTasks(prev => [...prev, newTask]);
    };

    const handleCompleteTask = (id: number) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === id ? { ...task, completed: true } : task
            )
        );
    };

    const handleRemoveTask = (id: number) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === id ? { ...task, deleted: true } : task
            )
        );
    };

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return; // Do nothing if no destination is provided (item dropped outside the list)
        }

        if (destination.droppableId === 'recycle-bin' && source.droppableId === 'task-list') {
            const taskId = parseFloat(draggableId);
            handleRemoveTask(taskId);
            return; // Exit the function to prevent further state updates after deletion
        }

        if (source.droppableId === 'task-list' && destination.droppableId === 'task-list' && destination.index !== source.index) {
            const newTasks = Array.from(tasks);
            const draggedTaskIndex = newTasks.findIndex(task => task.id === parseFloat(draggableId));
            const [movedTask] = newTasks.splice(draggedTaskIndex, 1);
            newTasks.splice(destination.index, 0, movedTask);
            setTasks(newTasks);
        }
    };


    return (
        <div>
            <Profile tasks={tasks} />
            <div className="mr-20">



            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="task-list" direction="horizontal">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-wrap gap-4 p-4">
                            {tasks
                                .filter(task => !task.deleted && !task.completed)
                                .map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <Task
                                                    task={task}
                                                    onRemove={() => handleRemoveTask(task.id)}
                                                    onComplete={() => handleCompleteTask(task.id)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                <Droppable droppableId="recycle-bin">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="fixed bottom-5 left-5 flex items-center justify-center">
                            <FaTrashAlt size={32} color="gray" />
                        </div>
                    )}
                </Droppable>

                {/*ADD TASK BUTTON*/}
                <div className="fixed bottom-5 right-5">
                    <button onClick={handleButtonClick} className="w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg text-3xl flex items-center justify-center">+</button>
                </div>

                {isModalOpen && (
                    <AddTaskModal
                        onClose={() => setIsModalOpen(false)}
                        onAddTask={addTask}
                    />
                )}

                <FishTank tasks={tasks} /> {/* Add the FishTank component to display completed tasks */}
            </DragDropContext>
            </div>
        </div>
    );
};

export default TaskBoard;
