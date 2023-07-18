let minValue = +Infinity;

export const findMinValue = (value: number) => {
    if (value < minValue) {
        minValue = value;
    }
    return minValue;
}