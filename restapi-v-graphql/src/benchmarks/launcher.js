// MOCK -- replace with actual query call
const fn = () => null;

(async () => {
  const times = [];
  for (let i = 0; i < 20; i++) {
    const tDelta = await fn();
    times.push(+tDelta.toFixed(2));
  }
  console.log(times);
})();
