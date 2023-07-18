let evenValues = 0;

export const findEvenValues = (value: number) => {
  if (value % 2 === 0) {
    evenValues++;
  }
  return evenValues;
};
