import groupBy from 'lodash.groupby';

import { database } from '~/database';
import type * as RecipesTypes from '~/entities/recipes/types';
import type * as TagsTypes from '~/entities/tags/types';

/**
 * This is how the column holding tag names is named in the joint table. We alias the column name anyway for easier refactoring
 */
const TAG_COLUMN_NAME = 'tagName';

/**
 * Database results are not grouped because such shape cannot be returned by traditional relational databases. Instead the recipe is
 * returned multiple times with a different tag column. This type is used as representation of what's returned from the database.
 */
type RecipeWithTagName = Omit<RecipesTypes.Recipe, 'tags'> & {
  [TAG_COLUMN_NAME]: TagsTypes.Tag['name'];
};

/**
 * Transformation of the collection of the same recipe with different tags to a single recipe with tags aggregated into an array. This
 * function does not check if recipes in the array are the same. It is responsibility of the caller to ensure that the collection of
 * RecipeWithTagName passed as an argument under went a groupBy operation.
 */
const transformRecipesWithTagNameToRecipeWithTags = (
  recipesWithTagName: RecipeWithTagName[]
): RecipesTypes.Recipe =>
  recipesWithTagName.reduce<RecipesTypes.Recipe>(
    (recipe, recipeWithTagName) => {
      const {
        createdAt,
        [TAG_COLUMN_NAME]: tagName,
        ...recipeWithoutCreatedAtAndTags
      } = recipeWithTagName;

      const tags: TagsTypes.Tag[] = Array.from(
        new Set([
          ...recipe.tags,
          {
            name: tagName,
          },
        ])
      );

      return {
        ...recipeWithoutCreatedAtAndTags,
        createdAt: new Date(createdAt),
        tags,
      };
    },
    {
      content: '',
      createdAt: new Date(),
      name: '',
      tags: [],
      url: '',
    }
  );

const getAll = (): RecipesTypes.Recipe[] => {
  const queryStatement = database.prepare(`
    SELECT recipes.*, recipeTags.tagName as ${TAG_COLUMN_NAME}
    FROM recipes
    LEFT JOIN recipeTags ON recipeTags.recipeName = recipes.name
  `);

  const recipesWithTagName = queryStatement.all() as RecipeWithTagName[];

  const recipesWithTagNameGroupedByName = groupBy(recipesWithTagName, 'name');

  const recipes = Object.values(recipesWithTagNameGroupedByName).map(
    transformRecipesWithTagNameToRecipeWithTags
  );

  return recipes;
};

const getAllWithTags = (tags: TagsTypes.Tag[]): RecipesTypes.Recipe[] => {
  const parameters = Array.from({ length: tags.length })
    .map(() => '?')
    .join(',');

  const queryStatement = database.prepare<Array<TagsTypes.Tag['name']>>(`
    SELECT recipes.*, recipeTags.tagName as ${TAG_COLUMN_NAME}
    FROM recipes
    INNER JOIN recipeTags ON recipeTags.recipeName = recipes.name
    WHERE recipes.name IN (
        SELECT recipeTags.recipeName FROM recipeTags WHERE recipeTags.tagName IN (${parameters})
    );
  `);

  const recipesWithTagName = queryStatement.all(
    ...tags.map((tag) => tag.name)
  ) as RecipeWithTagName[];

  const recipesWithTagNameGroupedByName = groupBy(recipesWithTagName, 'name');

  const recipes = Object.values(recipesWithTagNameGroupedByName).map(
    transformRecipesWithTagNameToRecipeWithTags
  );

  return recipes;
};

const getOne = (
  name: RecipesTypes.Recipe['name']
): RecipesTypes.Recipe | null => {
  const queryStatement = database.prepare<RecipesTypes.Recipe['name']>(`
    SELECT recipes.*, recipeTags.tagName as ${TAG_COLUMN_NAME}
    FROM recipes
    LEFT JOIN recipeTags ON recipeTags.recipeName = recipes.name
    WHERE recipes.name = ?
  `);

  const recipesWithTagName = queryStatement.all(name) as RecipeWithTagName[];

  if (recipesWithTagName.length === 0) {
    return null;
  }

  const recipe =
    transformRecipesWithTagNameToRecipeWithTags(recipesWithTagName);

  return recipe;
};

const create = (recipe: RecipesTypes.Recipe) => {
  const insertRecipeStatement = database.prepare<
    [
      RecipesTypes.Recipe['content'],
      string,
      RecipesTypes.Recipe['name'],
      RecipesTypes.Recipe['url']
    ]
  >(`
    INSERT INTO recipes (content, createdAt, name, url)
    VALUES (?, ?, ?, ?)
  `);

  const insertRecipeTagStatement = database.prepare<
    [RecipesTypes.Recipe['name'], TagsTypes.Tag['name']]
  >(`
    INSERT INTO recipeTags (recipeName, tagName)
    VALUES (?, ?)
  `);

  database.transaction(() => {
    insertRecipeStatement.run(
      recipe.content,
      recipe.createdAt.toISOString(),
      recipe.name,
      recipe.url
    );

    for (const tag of recipe.tags) {
      insertRecipeTagStatement.run(recipe.name, tag.name);
    }
  })();
};

const update = (
  oldRecipe: RecipesTypes.Recipe,
  updatedRecipe: RecipesTypes.Recipe
) => {
  const deleteRecipeTagsStatement = database.prepare<
    RecipesTypes.Recipe['name']
  >(`
    DELETE
    FROM recipeTags
    WHERE recipeName = ?
  `);

  const updateRecipeStatement = database.prepare<
    [
      RecipesTypes.Recipe['content'],
      RecipesTypes.Recipe['name'],
      RecipesTypes.Recipe['url'],
      /* Old recipe name */
      RecipesTypes.Recipe['name']
    ]
  >(`
    UPDATE recipes
    SET content = ?, name = ?, url = ?
    WHERE name = ?
  `);

  const insertRecipeTagStatement = database.prepare<
    [RecipesTypes.Recipe['name'], TagsTypes.Tag['name']]
  >(`
    INSERT INTO recipeTags (recipeName, tagName)
    VALUES (?, ?)
  `);

  database.transaction(() => {
    deleteRecipeTagsStatement.run(oldRecipe.name);

    updateRecipeStatement.run(
      updatedRecipe.content,
      updatedRecipe.name,
      updatedRecipe.url,
      oldRecipe.name
    );

    for (const tag of updatedRecipe.tags) {
      insertRecipeTagStatement.run(updatedRecipe.name, tag.name);
    }
  })();
};

const _delete = (recipe: RecipesTypes.Recipe) => {
  const deleteRecipeStatement = database.prepare<RecipesTypes.Recipe['name']>(`
    DELETE
    FROM recipes
    WHERE name = ?
  `);

  deleteRecipeStatement.run(recipe.name);
};

export { create, _delete as delete, getAll, getAllWithTags, getOne, update };
