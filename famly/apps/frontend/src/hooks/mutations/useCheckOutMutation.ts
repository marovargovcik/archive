import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

type TCheckOutRequestPayload = {
  childId: string;
};

const checkOut = async ({ childId }: TCheckOutRequestPayload) => {
  try {
    await axios.post(`/v2/children/${childId}/checkout`, {
      accessToken: import.meta.env.VITE_API_KEY,
    });
  } catch {
    return await Promise.reject();
  }
};

// eslint-disable-next-line no-alert
const handleError = () => alert('Ops. Try that again');

const useCheckOutMutation = () => {
  const queryClient = useQueryClient();

  const handleSuccess = () => queryClient.invalidateQueries('children');

  return useMutation<unknown, Error, TCheckOutRequestPayload>(
    (payload) => checkOut(payload),
    {
      onError: handleError,
      onSuccess: handleSuccess,
    },
  );
};

export type { TCheckOutRequestPayload };
export { checkOut, useCheckOutMutation };
