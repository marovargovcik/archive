import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { useCheckInMutation } from '@/hooks/mutations/useCheckInMutation';
import { useCheckOutMutation } from '@/hooks/mutations/useCheckOutMutation';
import { useChildrenQuery } from '@/hooks/queries/useChildrenQuery';
import { useLocalPaginationStrategy } from '@/hooks/useLocalPaginationStrategy';
import { useURLConnectedPagination } from '@/hooks/usePagination';
import styles from '@/styles.module.css';
import type { TChild } from '@/types/models';
import { PAGINATION_LIMIT } from '@/utils/constants';

const Row = ({ checkedIn, checkinTime, childId, name }: TChild) => {
  const [pickupTime, setPickupTime] = useState(() => {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
  });

  const isInvalidPickupTime = pickupTime === '';

  const handlePickupTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPickupTime(event.target.value);
  };

  const { isLoading: isLoadingCheckIn, mutate: mutateCheckIn } =
    useCheckInMutation();

  const handleCheckIn = () => {
    if (!pickupTime) {
      return;
    }

    mutateCheckIn({
      childId,
      pickupTime,
    });
  };

  const { isLoading: isLoadingCheckOut, mutate: mutateCheckOut } =
    useCheckOutMutation();

  const handleCheckOut = () =>
    mutateCheckOut({
      childId,
    });

  return (
    <tr>
      <td>{name.fullName}</td>
      <td>{checkinTime ? new Date(checkinTime).toLocaleString() : 'N/A'}</td>
      <td>
        {checkedIn ? (
          <button
            disabled={isLoadingCheckOut}
            onClick={handleCheckOut}
            type='button'
          >
            {isLoadingCheckOut ? 'Please wait...' : 'Check out'}
          </button>
        ) : (
          <>
            <input
              onChange={handlePickupTimeChange}
              type='time'
              value={pickupTime}
            />{' '}
            <button
              disabled={isLoadingCheckIn || isInvalidPickupTime}
              onClick={handleCheckIn}
              type='button'
            >
              {isLoadingCheckIn ? 'Please wait..' : 'Check in'}
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

const App = () => {
  const { data, isFetching, refetch } = useChildrenQuery();

  const {
    availablePages,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    page,
  } = useURLConnectedPagination({
    limit: PAGINATION_LIMIT,
    total: data?.children.length ?? 0,
  });

  const children = useLocalPaginationStrategy<TChild>({
    data: data?.children ?? [],
    limit: PAGINATION_LIMIT,
    page,
  });

  const handleRefetch = () => refetch();

  return (
    <>
      <div className={styles.controls}>
        <button onClick={handleRefetch} type='button'>
          Refresh page
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Checked in at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {children.map((child) => (
            <Row key={child.childId} {...child} />
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button
          disabled={!hasPreviousPage}
          onClick={goToPreviousPage}
          type='button'
        >
          Previous
        </button>
        <span>
          Page {page} of {availablePages}
        </span>
        <button disabled={!hasNextPage} onClick={goToNextPage} type='button'>
          Next
        </button>
      </div>
      {isFetching && <div>Loading...</div>}
    </>
  );
};

export { App };
