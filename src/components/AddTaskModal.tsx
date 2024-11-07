import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface AddTaskModalProps {
    onClose: () => void;
    onAddTask: (task: { title: string; difficulty: number; deadline: Date }) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onAddTask }) => {
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState(() => {
        const today = new Date();
        today.setDate(today.getDate() + 7);
        return today;
    });
    const [difficulty, setDifficulty] = useState(1);

    const handleAddTask = () => {
        if (title.trim()) {
            onAddTask({ title, difficulty, deadline });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Task Title"
                />
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <DatePicker
                    selected={deadline}
                    onChange={(date: Date | null) => {
                        if (date) setDeadline(date); // Only set deadline if date is not null
                    }}
                    className="w-full p-2 border rounded mb-4"
                    placeholderText="Select a date"
                />

                <input
                    type="range"
                    min="1"
                    max="5"
                    value={difficulty}
                    onChange={(e) => setDifficulty(Number(e.target.value))}
                    className="w-full mb-4"
                />
                <p className="text-center mb-4">Difficulty: {difficulty}</p>

                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                    <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 py-2 rounded">Add Task</button>
                </div>
            </div>
        </div>
    );
};

export default AddTaskModal;
