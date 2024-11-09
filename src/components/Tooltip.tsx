import React from 'react';

interface TooltipProps {
    title: string;
    difficulty: number;
    deadline: Date;
    points: number; // Add points prop
}

const Tooltip: React.FC<TooltipProps> = ({ title, difficulty, deadline, points }) => {
    const formattedDeadline = deadline.toLocaleDateString(); // Format the date

    return (
        <div className="absolute bottom-full mb-2 w-max p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-50">
            <p><strong>{title}</strong></p>
            <p>Status: Completed</p>
            <p>Difficulty: {difficulty}</p>
            <p>Points Earned: {points}</p> {/* Display points earned */}
            <p>Deadline: {formattedDeadline}</p>
        </div>
    );
};

export default Tooltip;
