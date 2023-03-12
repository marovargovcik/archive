import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  type TFilter,
  type TProperty,
  type TPropertyOption,
} from '@/hooks/useFilter/types';
import { isStringFilter } from '@/hooks/useFilter/utils';
import { type TLazyProperty } from '@/hooks/useLazyFilter/types';
import { useURLConnectedFilter } from '@/hooks/useURLConnectedFilter/hook';

type Emoji = {
  name: string;
};

const PROPERTIES: Array<TLazyProperty | TProperty> = [
  {
    key: 'firstName',
    label: 'First name',
    multiple: false,
    options: null,
  },
  {
    key: 'lastName',
    label: 'Last name',
    multiple: false,
    options: null,
  },
  {
    key: 'rooms',
    label: 'Rooms',
    multiple: false,
    options: [
      {
        label: 'All rooms',
        value: 'allRooms',
      },
      {
        label: 'Bears',
        value: 'bears',
      },
      {
        label: 'Elephants',
        value: 'elephants',
      },
      {
        label: 'Green',
        value: 'green',
      },
      {
        label: 'Rhinos',
        value: 'rhinos',
      },
    ],
  },
  {
    key: 'sortBy',
    label: 'Sort by',
    multiple: false,
    options: [
      {
        label: 'Name',
        value: 'name',
      },
      {
        label: 'Age (youngest first)',
        value: 'ageAsc',
      },
      {
        label: 'Age (oldest first)',
        value: 'ageDesc',
      },
    ],
  },
  {
    key: 'emoji',
    label: 'Emoji',
    multiple: true,
    options: async (query) => {
      const response = await fetch(
        'https://cors-anywhere.herokuapp.com/https://emojihub.yurace.pro/api/all/category/animals-and-nature'
      );

      const emojis: Emoji[] = await response.json();

      return emojis.flatMap((emoji) => {
        if (
          emoji.name.toLowerCase().startsWith((query ?? '').toLowerCase()) ===
          false
        ) {
          return [];
        }

        return [
          {
            label: emoji.name,
            value: emoji.name,
          },
        ];
      });
    },
  },
];

const DELIMITER = ': ';

const URL = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [input, setInput] = useState('');

  const hook = useURLConnectedFilter({
    input,
    properties: PROPERTIES,
  });

  const handlePropertyClick = useCallback(
    (property: TLazyProperty | TProperty) => () => {
      setInput(property.label + DELIMITER);
      inputRef.current?.focus();
    },
    []
  );

  const handlePropertyOptionClick = useCallback(
    (option: TPropertyOption) => () => {
      if (hook.property === null) {
        return;
      }

      hook.addFilter({
        option,
        property: hook.property,
      });
      setInput('');
      inputRef.current?.focus();
    },
    [hook]
  );

  const handleRemoveFilter = useCallback(
    (filter: TFilter) => () => {
      hook.removeFilter(filter);
      inputRef.current?.focus();
    },
    [hook]
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setInput(event.target.value),
    []
  );

  const handleInputSubmit = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') {
        return;
      }

      if (
        hook.property !== null &&
        hook.property.options === null &&
        hook.query !== null
      ) {
        hook.addFilter({
          property: hook.property,
          value: hook.query,
        });
        setInput('');
      }
    },
    [hook]
  );

  const filteredProperties = useMemo(() => {
    if (input === '') {
      return PROPERTIES;
    }

    const filteredProperties = PROPERTIES.filter((property) =>
      input.toLowerCase().includes(property.label.toLowerCase())
    );

    if (filteredProperties.length === 0) {
      return PROPERTIES;
    }

    return filteredProperties;
  }, [input]);

  const filteredOptions = useMemo(() => {
    if (hook.property === null) {
      return [];
    }

    if (hook.property.options === null) {
      return [];
    }

    const query = hook.query;

    if (query === null || query === '') {
      return hook.property.options;
    }

    return hook.property.options.filter((option) =>
      option.label.toLowerCase().startsWith(query.toLowerCase())
    );
  }, [hook.property, hook.query]);

  return (
    <>
      <div>
        <label htmlFor='search'>Search</label>
        <br />
        <input
          id='search'
          onChange={handleInputChange}
          onKeyDown={handleInputSubmit}
          ref={inputRef}
          type='text'
          value={input}
        />
      </div>
      <p>Filter by:</p>
      <ul>
        {filteredProperties.map((property) => (
          <li key={property.key} onClick={handlePropertyClick(property)}>
            {property.label}
          </li>
        ))}
      </ul>
      {hook.isFetching ? (
        <p>Loading options...</p>
      ) : (
        filteredOptions.length > 0 && (
          <>
            <p>Options:</p>
            <ul>
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={handlePropertyOptionClick(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </>
        )
      )}
      <p>Active filters</p>
      <ul>
        {hook.filters.map((filter) => (
          <li key={filter.property.key} onClick={handleRemoveFilter(filter)}>
            <b>{filter.property.label}</b>{' '}
            {isStringFilter(filter) ? filter.value : filter.option.value}
          </li>
        ))}
      </ul>
      <details>
        <summary>Expand</summary>
        <details style={{ margin: '8px 0 8px 8px' }}>
          <summary>Properties</summary>
          <pre>{JSON.stringify(PROPERTIES, null, 2)}</pre>
        </details>
        <details style={{ margin: '8px 0 8px 8px' }}>
          <summary>Delimiter</summary>
          <pre>{JSON.stringify({ delimiter: DELIMITER }, null, 2)}</pre>
        </details>
        <details style={{ margin: '8px 0 8px 8px' }}>
          <summary>Input</summary>
          <pre>{JSON.stringify({ input }, null, 2)}</pre>
        </details>
        <details style={{ margin: '8px 0 8px 8px' }}>
          <summary>Hook</summary>
          <pre>{JSON.stringify(hook, null, 2)}</pre>
        </details>
        <details style={{ margin: '8px 0 8px 8px' }}>
          <summary>Filters</summary>
          <pre>{JSON.stringify(hook.filters, null, 2)}</pre>
        </details>
      </details>
    </>
  );
};

export { URL };
