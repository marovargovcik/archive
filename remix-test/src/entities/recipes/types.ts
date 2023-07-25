import { type Tag } from '~/entities/tags/types';

type Recipe = {
  content: string;
  createdAt: Date;
  name: string;
  tags: Tag[];
  url: string;
};

export { type Recipe };
