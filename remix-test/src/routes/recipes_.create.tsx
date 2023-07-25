import { type ActionArgs, redirect } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';

import * as RecipesRepository from '~/entities/recipes/repository';
import * as TagsRepository from '~/entities/tags/repository';
import type * as TagsTypes from '~/entities/tags/types';

const FORM_CONSTANTS = {
  FIELDS: {
    content: 'CONTENT',
    name: 'NAME',
    tags: 'TAGS',
    url: 'URL',
  },
} as const;

const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const content = formData.get(FORM_CONSTANTS.FIELDS.content) as string;
  const name = formData.get(FORM_CONSTANTS.FIELDS.name) as string;
  const tagsAsString = formData.get(FORM_CONSTANTS.FIELDS.tags) as string;

  const tags = tagsAsString
    .split(',')
    .filter((tagName) => tagName !== '')
    .map<TagsTypes.Tag>((tagName) => ({
      name: tagName,
    }));

  const url = formData.get(FORM_CONSTANTS.FIELDS.url) as string;

  RecipesRepository.create({
    content,
    createdAt: new Date(),
    name,
    tags,
    url,
  });

  return redirect('/recipes');
};

const loader = () => TagsRepository.getAll();

const Route = () => {
  const availableTags = useLoaderData<typeof loader>();
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
  const tagsInputRef = useRef<HTMLInputElement>(null);

  const toggleTag = (tagName: string) => () => {
    if (selectedTagNames.includes(tagName)) {
      setSelectedTagNames((selectedTagNames) =>
        selectedTagNames.filter(
          (iteratedTagName) => iteratedTagName !== tagName
        )
      );

      return;
    }

    setSelectedTagNames((selectedTagNames) => [...selectedTagNames, tagName]);
  };

  useEffect(() => {
    if (tagsInputRef.current === null) {
      return;
    }

    tagsInputRef.current.value = selectedTagNames.join(',');
  }, [selectedTagNames]);

  return (
    <>
      <Link to="/recipes">Back to recipes</Link>
      <h1>Create a new recipe</h1>
      <Form method="POST">
        <label htmlFor={FORM_CONSTANTS.FIELDS.name}>Name</label>
        <br />
        <input
          id={FORM_CONSTANTS.FIELDS.name}
          name={FORM_CONSTANTS.FIELDS.name}
          type="text"
        />
        <br />
        <label htmlFor={FORM_CONSTANTS.FIELDS.url}>URL</label>
        <br />
        <input
          id={FORM_CONSTANTS.FIELDS.url}
          name={FORM_CONSTANTS.FIELDS.url}
          type="text"
        />
        <input
          id={FORM_CONSTANTS.FIELDS.tags}
          name={FORM_CONSTANTS.FIELDS.tags}
          ref={tagsInputRef}
          type="hidden"
        />
        <div>Tags</div>
        <ul>
          {availableTags.map((tag) => (
            <li key={tag.name} onClick={toggleTag(tag.name)}>
              {selectedTagNames.includes(tag.name) ? (
                <b>{tag.name}</b>
              ) : (
                tag.name
              )}
            </li>
          ))}
        </ul>
        <br />
        <label htmlFor={FORM_CONSTANTS.FIELDS.content}>Content</label>
        <br />
        <textarea
          id={FORM_CONSTANTS.FIELDS.content}
          name={FORM_CONSTANTS.FIELDS.content}
        />
        <br />
        <button type="submit">Create</button>
      </Form>
    </>
  );
};

export { action, loader };
export default Route;
