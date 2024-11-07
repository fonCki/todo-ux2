export interface Task {
    id: number;
    title: string;
    difficulty: number;
    deadline: Date;
    deleted?: boolean;
    completed?: boolean;
}
