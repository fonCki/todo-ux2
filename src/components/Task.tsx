import React, { useState, useEffect } from 'react';
import { Task as TaskType } from '../types';
import { getColor } from '../utils/colors';

interface TaskProps {
    task: TaskType;
    onRemove: () => void;
    onComplete: () => void;
}

const getFontSize = (difficulty: number): string => {
    switch (difficulty) {
        case 1: return 'text-sm';
        case 2: return 'text-base';
        case 3: return 'text-lg';
        case 4: return 'text-xl';
        case 5: return 'text-2xl';
        default: return 'text-base';
    }
};

const Task: React.FC<TaskProps> = ({ task, onRemove, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const deadline = new Date(task.deadline);
            const timeDifference = deadline.getTime() - now.getTime();

            if (timeDifference <= 0) {
                setTimeLeft('00:00:00:00'); // Deadline has passed
                return;
            }

            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            setTimeLeft(
                `${days.toString().padStart(2, '0')}d ${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m:${seconds.toString().padStart(2, '0')}s`
            );
        };

        const intervalId = setInterval(updateCountdown, 1000);
        updateCountdown();
        return () => clearInterval(intervalId);
    }, [task.deadline]);

    if (task.completed) {
        return (
            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {task.title.charAt(0)}
            </div>
        );
    }

    return (
        <div className={`${getColor(task.difficulty)} ${getFontSize(task.difficulty)} relative inline-flex flex-col items-center px-4 py-2 m-2 rounded-md shadow-lg`}>
            <button
                onClick={onComplete}
                className="absolute top-1 right-1 text-white rounded-full p-1 text-xs"
            >
                ✅
            </button>
            <div className="inline-flex flex-col items-center justify-between">
                <div className={`${getColor(task.difficulty)} ${getFontSize(task.difficulty)} inline-flex items-center justify-center px-4 py-2 rounded-md`}>
                    <span>{task.title}</span>
                </div>
                <span className="ml-4 text-sm font-light">{timeLeft}</span>
            </div>
            <button
                onClick={onRemove}
                className="absolute top-1 left-1 text-white rounded-full p-1 text-xs"
            >
                ❌
            </button>
        </div>
    );
};

export default Task;
