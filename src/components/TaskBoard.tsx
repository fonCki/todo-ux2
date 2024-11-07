import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Task as TaskType } from '../types';
import Task from './Task';
import AddTaskModal from './AddTaskModal';
import Profile from './Profile'; // Import Profile component
import { FaTrashAlt } from 'react-icons/fa';

const TaskBoard: React.FC = () => {
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

        if (!destination) return;

        if (destination.droppableId === 'recycle-bin') {
            const taskId = parseFloat(draggableId);
            handleRemoveTask(taskId);
        } else if (source.droppableId === 'task-list' && destination.droppableId === 'task-list') {
            const newTasks = Array.from(tasks);
            const draggedTaskIndex = newTasks.findIndex(task => task.id === parseFloat(draggableId));
            const [movedTask] = newTasks.splice(draggedTaskIndex, 1);
            newTasks.splice(destination.index, 0, movedTask);
            setTasks(newTasks);
        }
    };

    return (
        <div>
            <Profile tasks={tasks} /> {/* Add the Profile component to display photo and score */}

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

                <div className="fixed bottom-5 right-5">
                    <button onClick={() => setIsModalOpen(true)} className="w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg text-3xl flex items-center justify-center">+</button>
                </div>

                {isModalOpen && (
                    <AddTaskModal
                        onClose={() => setIsModalOpen(false)}
                        onAddTask={addTask}
                    />
                )}

                <div className="fixed bottom-20 w-full flex justify-center">
                    <div className="flex gap-4 p-4 bg-blue-100 rounded-full shadow-md w-80 h-24 overflow-x-auto fishtank">
                        {tasks
                            .filter(task => task.completed)
                            .map(task => (
                                <div key={task.id} className="bg-green-400 w-12 h-12 rounded-full flex items-center justify-center text-xs font-semibold">
                                    {task.title.charAt(0)}
                                </div>
                            ))}
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
};

export default TaskBoard;
