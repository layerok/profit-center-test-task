let maxValue = -Infinity;

export const findMaxValue = (value: number) => {
    if (value > maxValue) {
        maxValue = value;
    }
    return maxValue;
}