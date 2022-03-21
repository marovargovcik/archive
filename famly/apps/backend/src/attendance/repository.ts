import { createError } from '@repo/helpers/api/createError';

import type {
  TCheckRequestPayload,
  TIsCheckedInRequestPayload,
} from '@/attendance/types';
import type { TAttendance, TAttendanceWithChild } from '@/types/models';
import { database } from '@/utils/database';

const isCheckedIn = async ({ childId }: TIsCheckedInRequestPayload) => {
  try {
    const [rows] = await database.query<TAttendance[]>(
      `SELECT id FROM attendance 
       WHERE childId = ? AND checkOutTimestamp IS NULL
      `.trim(),
      [childId],
    );

    if (rows.length) {
      return true;
    }

    return false;
  } catch {
    throw createError(400, 'UNABLE_TO_COMPLETE_REQUEST', {
      errors: [],
      expose: true,
    });
  }
};

const getAllCheckedIn = async () => {
  try {
    const [rows] = await database.query<TAttendanceWithChild[]>(
      `SELECT attendance.id as attendanceId, attendance.checkInTimestamp, attendance.checkOutTimestamp, attendance.childId, children.name as childName 
       FROM attendance INNER JOIN children on children.id = attendance.childId 
       WHERE checkOutTimestamp IS NULL
      `.trim(),
    );

    return rows;
  } catch {
    throw createError(400, 'UNABLE_TO_COMPLETE_REQUEST', {
      errors: [],
      expose: true,
    });
  }
};

const getAllCheckedInTodayForAtLeast2Hours = async () => {
  try {
    const [rows] = await database.query<TAttendanceWithChild[]>(
      `SELECT attendance.id as attendanceId, attendance.checkInTimestamp, attendance.checkOutTimestamp, attendance.childId, children.name as childName
       FROM attendance INNER JOIN children on children.id = attendance.childId
       WHERE DATE(checkInTimestamp) = CURDATE()
       AND (
         checkOutTimestamp IS NULL AND (TIME_TO_SEC(TIMEDIFF(CURRENT_TIMESTAMP(), checkInTimestamp)) / 60) >= 120
         OR checkOutTimestamp IS NOT NULL AND (TIME_TO_SEC(TIMEDIFF(checkOutTimestamp , checkInTimestamp)) / 60) >= 120
       )
      `.trim(),
    );

    return rows;
  } catch {
    throw createError(400, 'UNABLE_TO_COMPLETE_REQUEST', {
      errors: [],
      expose: true,
    });
  }
};

const check = async ({ childId }: TCheckRequestPayload) => {
  try {
    const shouldCheckOut = await isCheckedIn({ childId });

    if (shouldCheckOut) {
      await database.execute(
        `UPDATE attendance 
         SET checkOutTimestamp = CURRENT_TIMESTAMP 
         WHERE childId = ? AND checkOutTimestamp IS NULL
        `.trim(),
        [childId],
      );
      return;
    }

    await database.execute('INSERT INTO attendance (childId) VALUES(?)', [
      childId,
    ]);
  } catch {
    throw createError(400, 'UNABLE_TO_COMPLETE_REQUEST', {
      errors: [],
      expose: true,
    });
  }
};

export {
  check,
  getAllCheckedIn,
  getAllCheckedInTodayForAtLeast2Hours,
  isCheckedIn,
};
