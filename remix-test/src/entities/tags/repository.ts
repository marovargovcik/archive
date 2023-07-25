import { database } from '~/database';
import type * as TagsTypes from '~/entities/tags/types';

const getAll = () => {
  const queryStatement = database.prepare(`
    SELECT tags.*, COUNT(recipeTags.recipeName) as recipeCount
    FROM tags
    LEFT JOIN recipeTags ON recipeTags.tagName = tags.name
    GROUP BY tags.name
  `);

  const tags = queryStatement.all() as TagsTypes.TagWithRecipeCount[];

  return tags;
};

const create = (tag: TagsTypes.Tag) => {
  const insertTagStatement = database.prepare<TagsTypes.Tag['name']>(`
    INSERT INTO tags (name)
    VALUES (?)
  `);

  insertTagStatement.run(tag.name);
};

const update = (oldTag: TagsTypes.Tag, newTag: TagsTypes.Tag) => {
  const insertTagStatement = database.prepare<TagsTypes.Tag['name']>(`
    INSERT INTO tags (name)
    VALUES (?)
  `);

  const updateRecipeTagsStatement = database.prepare<
    [TagsTypes.Tag['name'], TagsTypes.Tag['name']]
  >(`
    UPDATE recipeTags
    SET tagName = ?
    WHERE tagName = ?
  `);

  const deleteTagStatement = database.prepare<TagsTypes.Tag['name']>(`
    DELETE
    FROM tags
    WHERE name = ?
  `);

  database.transaction(() => {
    insertTagStatement.run(newTag.name);
    updateRecipeTagsStatement.run(newTag.name, oldTag.name);
    deleteTagStatement.run(oldTag.name);
  })();
};

const _delete = (tag: TagsTypes.Tag) => {
  const deleteRecipeTagsStatement = database.prepare<TagsTypes.Tag['name']>(`
    DELETE
    FROM recipeTags
    WHERE tagName = ?
  `);

  const deleteTagStatement = database.prepare<TagsTypes.Tag['name']>(`
    DELETE
    FROM tags
    WHERE name = ?
  `);

  database.transaction(() => {
    deleteRecipeTagsStatement.run(tag.name);
    deleteTagStatement.run(tag.name);
  })();
};

export { create, _delete as delete, getAll, update };
