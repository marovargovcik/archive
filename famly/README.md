# Description
This project is a monorepo with 2 TypeScript based applications residing in apps folder (apps/backend and apps/frontend). I did both assignment as I think it might be beneficial for our chat on Wednesday to have more code to go over and talk about. In case you do not have time to look over both assignments I would appreciate if you could look into apps/frontend.

# Documentation
Both assignments have their own README files where I explain more about how to run it, structure and decisions. Please give it a read and in case something is unclear get back to me and I am happy to explain.

# How do I run this?
I tested this application with Node v14 and v16 and npm v8. I cannot guarantee it will work with other Node or npm version as it is untested. Since it is a JavaScript (TypeScript) project there are of course dependencies. You can install them by running `npm install` from the project root folder. You can launch both projects in development mode with `npm run all:dev` but only after you followed README instructions of both frontend and backend since there are few environment variable files required.

# Code quality and shared code
Both assignments are formatted by strict set of ESLint rules. You can find the ESLint configuration in packages/config. Shared pieces of code can be placed in packages/helpers or packages/types. For this project it was not needed but it would come handy if I would implement frontend application for my backend endpoints like for example for sharing response types and model types.