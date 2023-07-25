type Tag = {
  name: string;
};

type TagWithRecipeCount = Tag & {
  recipeCount: number;
};

export { type Tag, type TagWithRecipeCount };
