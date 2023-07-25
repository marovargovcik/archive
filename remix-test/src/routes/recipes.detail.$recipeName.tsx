import { type ActionArgs, type LoaderArgs, redirect } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';

import * as RecipesRepository from '~/entities/recipes/repository';
import type * as RecipesTypes from '~/entities/recipes/types';

const FORM_CONSTANTS = {
  FIELDS: {
    RECIPE_NAME: 'recipeName',
  },
};

const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const recipeName = formData.get(FORM_CONSTANTS.FIELDS.RECIPE_NAME) as string;

  RecipesRepository.delete({ name: recipeName } as RecipesTypes.Recipe);

  return redirect('/recipes');
};

const loader = ({ params }: LoaderArgs) => {
  const recipe = RecipesRepository.getOne(params.recipeName as string);

  if (recipe === null) {
    throw new Error('Recipe not found');
  }

  return recipe;
};

const Route = () => {
  const recipe = useLoaderData<typeof loader>();

  return (
    <>
      <Link to="/recipes">Back to recipes</Link>
      <h1>
        Recipe: "{recipe.name}"
        <Form method="POST">
          <input
            name={FORM_CONSTANTS.FIELDS.RECIPE_NAME}
            type="hidden"
            value={recipe.name}
          />
          <button type="submit">Delete this recipe</button>
        </Form>
      </h1>
      <p>
        <b>Created at</b>
      </p>
      {new Date(recipe.createdAt).toLocaleString()}
      <p>
        <b>URL</b>
      </p>
      <a href={recipe.url} rel="noreferrer" target="_blank">
        {recipe.url}
      </a>
      <p>
        <b>Tags</b>
      </p>
      <span>{recipe.tags.map((tag) => tag.name).join(', ')}</span>
      <p>
        <b>Content</b>
      </p>
      <div>{recipe.content}</div>
    </>
  );
};

export { action, loader };
export default Route;
