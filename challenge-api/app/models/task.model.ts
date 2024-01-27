interface Task {
    id: string;
    status: 'pending' | 'completed';
    cities?: any;
}

export default Task;