import type { RowDataPacket } from 'mysql2';

type TChild = RowDataPacket & {
  id: number;
  name: string;
};

type TAttendance = RowDataPacket & {
  checkInTimestamp: string;
  checkOutTimestamp: string | null;
  childId: number;
  id: number;
};

type TAttendanceWithChild = RowDataPacket & {
  attendanceId: number;
  checkInTimestamp: string;
  checkOutTimestamp: string | null;
  childId: number;
  childName: string;
};

export type { TAttendance, TAttendanceWithChild, TChild };
