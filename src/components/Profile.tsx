import React, { useMemo } from 'react';
import { Task } from '../types';

interface ProfileProps {
    tasks: Task[];
}

const sourceImg = 'https://raw.githubusercontent.com/fonCki/todo-ux2/refs/heads/development/public'

const getAvatarForScore = (score: number): string => {
    if (score <= 50) return '/avatar/1.webp';
    if (score <= 100) return '/avatar/2.webp';
    if (score <= 150) return '/avatar/3.webp';
    if (score <= 200) return '/avatar/4.webp';
    if (score <= 300) return '/avatar/5.webp';
    if (score <= 550) return '/avatar/6.webp';
    if (score <= 700) return '/avatar/7.webp';
    if (score <= 800) return '/avatar/8.webp';
    if (score <= 900) return '/avatar/9.webp';
    return '/avatar/10.webp';
};

const Profile: React.FC<ProfileProps> = ({ tasks }) => {
    // Calculate the score based on completed tasks
    const score = useMemo(() => {
        return tasks
            .filter(task => task.completed)
            .reduce((total, task) => total + task.difficulty * 10, 0);
    }, [tasks]);

    // Determine which avatar to display based on the score
    const avatarSrc  = sourceImg + getAvatarForScore(score);

    return (
        <div className="fixed top-5 right-5 flex-col items-center space-x-4 p-4 bg-white shadow-lg rounded-t-full">
            {/* User Photo */}
            <img
                src={avatarSrc}
                alt="User Profile"
                className="w-20 h-20 rounded-full"
            />
            {/* Score Display */}
            <div className="text-lg font-semibold">
                {score} pts
            </div>
        </div>
    );
};

export default Profile;
