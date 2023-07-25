import { Link, Outlet, useLoaderData } from '@remix-run/react';

import * as TagsRepository from '~/entities/tags/repository';

const loader = () => TagsRepository.getAll();

const Route = () => {
  const tags = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Tags</h1>
      <Link to="/tags/manage">Manage tags</Link>
      <ul>
        <li>
          <Link to="/recipes">All recipes</Link>
        </li>
        {tags.map((tag) => (
          <li key={tag.name}>
            <Link to={`/recipes/${tag.name}`}>{tag.name}</Link> (
            {tag.recipeCount})
          </li>
        ))}
      </ul>
      <Link to="/recipes/create">Create a new recipe</Link>
      <br />
      <br />
      <Outlet />
    </>
  );
};

export { loader };
export default Route;
