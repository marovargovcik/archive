/* eslint-disable @typescript-eslint/no-use-before-define */
import { type ActionArgs } from '@remix-run/node';
import {
  Form,
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';

import * as TagsRepository from '~/entities/tags/repository';
import type * as TagsTypes from '~/entities/tags/types';

const FORM_CONSTANTS = {
  ACTIONS: {
    CREATE: '_create',
    DELETE: '_delete',
    KEY: '_action',
    UPDATE: '_update',
  },
  FIELDS: {
    OLD_TAG_NAME: 'oldTagName',
    TAG_NAME: 'tagName',
  },
} as const;

type FormAction =
  (typeof FORM_CONSTANTS)['ACTIONS'][keyof (typeof FORM_CONSTANTS)['ACTIONS']];

const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const action: FormAction = formData.get(
    FORM_CONSTANTS.ACTIONS.KEY
  ) as FormAction;

  if (action === '_create') {
    const newTagName = formData.get(FORM_CONSTANTS.FIELDS.TAG_NAME) as string;

    TagsRepository.create({
      name: newTagName,
    });

    return null;
  }

  if (action === '_update') {
    const oldTagName = formData.get(
      FORM_CONSTANTS.FIELDS.OLD_TAG_NAME
    ) as string;

    const newTagName = formData.get(FORM_CONSTANTS.FIELDS.TAG_NAME) as string;

    TagsRepository.update(
      {
        name: oldTagName,
      },
      {
        name: newTagName,
      }
    );

    return null;
  }

  const tagName = formData.get(FORM_CONSTANTS.FIELDS.TAG_NAME) as string;

  TagsRepository.delete({
    name: tagName,
  });

  return null;
};

const loader = () => TagsRepository.getAll();

const Route = () => {
  const tags = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const isLoading = navigation.state === 'loading';

  return (
    <>
      <h1>Manage existing tags</h1>
      <Link to="/recipes">Back to recipes</Link>

      {isLoading && <div>Loading...</div>}

      <ul>
        {tags.map((tag) => (
          <li key={tag.name}>
            <Tag tag={tag} />
          </li>
        ))}
      </ul>

      <h1>Create a new tag</h1>
      <Form method="POST">
        <input
          name={FORM_CONSTANTS.ACTIONS.KEY}
          type="hidden"
          value={FORM_CONSTANTS.ACTIONS.CREATE}
        />
        <input name={FORM_CONSTANTS.FIELDS.TAG_NAME} />
        <button type="submit">Create</button>
      </Form>
    </>
  );
};

const Tag = ({ tag }: { tag: TagsTypes.TagWithRecipeCount }) => {
  const fetcher = useFetcher();

  const isDeleting =
    fetcher.formData?.get(FORM_CONSTANTS.ACTIONS.KEY) ===
      FORM_CONSTANTS.ACTIONS.DELETE && fetcher.state === 'submitting';

  const isUpdating =
    fetcher.formData?.get(FORM_CONSTANTS.ACTIONS.KEY) ===
      FORM_CONSTANTS.ACTIONS.UPDATE && fetcher.state === 'submitting';

  return (
    <>
      <fetcher.Form method="POST">
        <input
          name={FORM_CONSTANTS.ACTIONS.KEY}
          type="hidden"
          value={FORM_CONSTANTS.ACTIONS.UPDATE}
        />
        <input
          name={FORM_CONSTANTS.FIELDS.OLD_TAG_NAME}
          type="hidden"
          value={tag.name}
        />
        <input defaultValue={tag.name} name={FORM_CONSTANTS.FIELDS.TAG_NAME} />
        <button disabled={isUpdating} type="submit">
          Update
        </button>{' '}
      </fetcher.Form>
      <div>Recipes ({tag.recipeCount})</div>
      <Form method="POST">
        <input
          name={FORM_CONSTANTS.ACTIONS.KEY}
          type="hidden"
          value={FORM_CONSTANTS.ACTIONS.DELETE}
        />
        <input
          name={FORM_CONSTANTS.FIELDS.TAG_NAME}
          type="hidden"
          value={tag.name}
        />
        <button disabled={isDeleting} type="submit">
          Delete
        </button>
      </Form>
    </>
  );
};

export { action, loader };
export default Route;
