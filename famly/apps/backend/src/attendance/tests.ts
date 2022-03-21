import 'dotenv/config';

import { check, getAllCheckedIn, isCheckedIn } from '@/attendance/repository';

(async () => {
  const allCheckedInBeforeCheck = await getAllCheckedIn();
  const resultBeforeCheck = await isCheckedIn({
    childId: 1,
  });

  await check({
    childId: 1,
  });

  const resultAfterCheck = await isCheckedIn({
    childId: 1,
  });

  if (resultBeforeCheck === resultAfterCheck) {
    throw new Error('Results are equal. Expected for results to not be equal');
  }

  const allCheckedInAfterCheck = await getAllCheckedIn();

  if (allCheckedInBeforeCheck.length === allCheckedInAfterCheck.length) {
    throw new Error('Results are equal. Expected for results to not be equal');
  }

  console.log('All tests passed');

  // eslint-disable-next-line node/no-process-exit
  process.exit(0);
})();
