export function getPercentage(initialNumber: number, newNumber: number): number {
    if (initialNumber === 0) return 100;
    const percentage = ((newNumber - initialNumber) / initialNumber) * 100;
    return percentage;
}