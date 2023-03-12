import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useFilter } from '@/hooks/useFilter/hook';
import {
  type TFilter,
  type TProperty,
  type TPropertyOption,
} from '@/hooks/useFilter/types';
import { isStringFilter } from '@/hooks/useFilter/utils';

const PROPERTIES: TProperty[] = [
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
];

const DELIMITER = ': ';

const Vanilla = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [input, setInput] = useState('');
  const [filters, setFilters] = useState<TFilter[]>([]);

  const hook = useFilter({
    delimiter: DELIMITER,
    filters,
    input,
    onFiltersChange: setFilters,
    properties: PROPERTIES,
  });

  const handlePropertyClick = useCallback(
    (property: TProperty) => () => {
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
      {filteredOptions.length > 0 && (
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
      )}
      <p>Active filters</p>
      <ul>
        {filters.map((filter) => (
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
          <pre>{JSON.stringify(filters, null, 2)}</pre>
        </details>
      </details>
    </>
  );
};

export { Vanilla };
