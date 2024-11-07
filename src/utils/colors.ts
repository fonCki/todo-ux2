export function getColor(difficulty: number): string {
    switch (difficulty) {
        case 1: return 'bg-green-500';
        case 2: return 'bg-green-400';
        case 3: return 'bg-yellow-400';
        case 4: return 'bg-orange-400';
        case 5: return 'bg-red-500';
        default: return 'bg-gray-300';
    }
}
