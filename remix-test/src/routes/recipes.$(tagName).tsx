import { type LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import * as RecipesRepository from '~/entities/recipes/repository';

const loader = ({ params }: LoaderArgs) => {
  const tag = params.tagName
    ? {
        name: params.tagName,
      }
    : null;

  const recipes = tag
    ? RecipesRepository.getAllWithTags([tag])
    : RecipesRepository.getAll();

  return recipes;
};

const Route = () => {
  const recipes = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.name}>
            <Link to={`/recipes/detail/${recipe.name}`}>{recipe.name}</Link>
            <span>Tags: {recipe.tags.map((tag) => tag.name).join(', ')}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export { loader };
export default Route;
