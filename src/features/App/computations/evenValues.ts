let evenValues = 0;

export const recalculateEvenValues = (value: number) => {
  if (value % 2 === 0) {
    evenValues++;
  }
  return evenValues;
};

export const getEvenValues = () => {
  return evenValues;
}

export const resetEvenValues = () => {
  evenValues = 0;
};
