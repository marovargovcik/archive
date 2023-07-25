# Order of things to talk about
- server-side vs client-side rendering and what remix does to treeshake and separete client side JavaScript from server-side one
- anatomy of a remix route (loader, action, component, meta)
- routing
  - layouts
  - stub routes
  - dynamic segments
  - optional dynamic segments
- leveraging platform and progressive enhancement
- useFetcher on /tags/manage (disabling JavaScript)

# Routing

/ - _index.tsx
/recipes - recipes.$(tagName).tsx
/recipes/<tagName> - recipes.$(tagName).tsx
/recipes/detail/<recipeName> - recipes.detail.$recipeName.tsx
/recipes/create - recipes_.create.tsx
/tags/manage - tags.manage.tsx

/presentation/* - presentation.*.tsx