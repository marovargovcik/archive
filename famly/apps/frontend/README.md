# Description
This project is a very standard React application powered by:
1. vite - build tool
2. react-router - client side routing library
3. react-query - data-fetching library

# Before attempting to run
Copy content of `.env.example` and create new `.env` file. `VITE_API_BASE_URL` is URL of the API - in this case it is `https://app.famly.co/api`. `VITE_API_KEY` is self explanatory.

# Code structure
Entire code base can be find in src folder. Please see explanation of folders and files below:
- src/hooks - custom hooks for (potentially) reusable logic
- src/types - TypeScript typings (TChild)
- src/utils - constants, side-effects
- src/App.tsx - file contains 2 components which should be avoided (1 component per file) but to keep things simple and together I left it like this

# Features
- client-side pagination (reflected in the URL)
- data refresh, stale data detection, caching (react-query)
- check-in and check-out actions with loading flags available (disabling buttons when async action in progress)

# Possible improvements
- Profile the application to discover and avoid unnecessary re-renders (memo, useMemo, useCallback)
- More sophisticated error handling (logging, feedback) and error boundaries