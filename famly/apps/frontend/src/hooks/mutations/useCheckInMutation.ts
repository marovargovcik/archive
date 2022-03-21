import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

type TCheckInRequestPayload = {
  childId: string;
  pickupTime: string;
};

const checkIn = async ({ childId, pickupTime }: TCheckInRequestPayload) => {
  try {
    await axios.post(`/v2/children/${childId}/checkins`, {
      accessToken: import.meta.env.VITE_API_KEY,
      pickupTime,
    });
  } catch {
    return await Promise.reject();
  }
};

// eslint-disable-next-line no-alert
const handleError = () => alert('Ops. Try that again');

const useCheckInMutation = () => {
  const queryClient = useQueryClient();

  const handleSuccess = () => queryClient.invalidateQueries('children');

  return useMutation<unknown, Error, TCheckInRequestPayload>(
    (payload) => checkIn(payload),
    {
      onError: handleError,
      onSuccess: handleSuccess,
    },
  );
};

export type { TCheckInRequestPayload };
export { checkIn, useCheckInMutation };
