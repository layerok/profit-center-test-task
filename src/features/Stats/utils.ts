export const formatMs = (ms: number) => {
  return `${ms}ms`;
};

export function profile<R>(cb: () => R, name = 'profile'): {
  result: R;
  startTime: number;
  endTime: number;
  timeSpent: number;
} {
  const startTime = Date.now();
  const result = cb();
  const endTime = Date.now();
  const timeSpent = endTime - startTime;

  const info = {
    result,
    startTime,
    endTime,
    timeSpent,
  };
  return info;
}
