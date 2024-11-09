import React, { useState } from 'react';
import { Task } from '../types';
import Tooltip from './Tooltip';

interface FishTankProps {
    tasks: Task[];
}

const FishTank: React.FC<FishTankProps> = ({ tasks }) => {
    const [hoveredTask, setHoveredTask] = useState<Task | null>(null);

    const completedTasks = tasks.filter(task => task.completed);
    const taskCount = completedTasks.length;
    const height = Math.min(100 + taskCount * 10, 250);

    return (
        <div
            className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex justify-center"
            style={{ height: `${height}px`, width: '90%', maxWidth: '500px' }}
        >
            <div
                className="relative flex flex-wrap gap-2 p-4 bg-blue-200 shadow-lg overflow-visible"
                style={{
                    width: '100%',
                    height: `${height}px`,
                    borderRadius: '50% / 15% 15% 0 0',
                    alignItems: 'flex-start',
                }}
            >
                {completedTasks.map(task => (
                    <div
                        key={task.id}
                        className="bg-green-400 w-12 h-12 rounded-full flex items-center justify-center text-xs font-semibold relative"
                        onMouseEnter={() => setHoveredTask(task)}
                        onMouseLeave={() => setHoveredTask(null)}
                    >
                        {task.title.charAt(0)}

                        {/* Display Tooltip if this task is hovered */}
                        {hoveredTask === task && (
                            <Tooltip
                                title={task.title}
                                difficulty={task.difficulty}
                                deadline={task.deadline}
                                points={task.difficulty * 10}  // Calculate and pass points
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FishTank;
