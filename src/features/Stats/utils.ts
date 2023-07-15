export const formatMs = (ms: number) => {
  return `${ms}ms`;
};

export function profile<R>(cb: () => R): {
  result: R;
  startTime: number;
  endTime: number;
  timeSpent: number;
} {
  const startTime = Date.now();
  const result = cb();
  const endTime = Date.now();
  const timeSpent = endTime - startTime;
  return {
    result,
    startTime,
    endTime,
    timeSpent,
  };
};
