import { randomBytes } from 'node:crypto';

const generateRandomId = () => randomBytes(16).toString('hex');

export { generateRandomId };
