import { redirect } from '@remix-run/node';

const loader = () => redirect('/recipes');

export { loader };
