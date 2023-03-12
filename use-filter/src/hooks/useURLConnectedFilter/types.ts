import { type TUseLazyFilterProps } from '@/hooks/useLazyFilter/types';

type TUseURLConnectedFilterProps = Pick<
  TUseLazyFilterProps,
  'input' | 'properties'
>;

export type { TUseURLConnectedFilterProps };
