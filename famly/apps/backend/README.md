# 1st part - In-app messaging assignment solution
1. All messages in any `conversation` sent by the user with user ID `4`
```sql
SELECT message.txt
FROM message WHERE
message.userId = 4;
```
2. All messages in `conversation` where users 1 and 3 are participating (other users could also be participating)
```sql
SELECT message.id, message.userId ASS sender, conversation.id AS conversation, message.txt
FROM conversation
INNER JOIN message ON message.conversationId = conversation.id
WHERE conversation.userId = 1 OR conversation.userId = 3;
```
3. All messages in any `conversation` where the message contents include the word "cake" (even substring)
```sql
SELECT message.txt FROM message WHERE message.txt LIKE '%cake%';
```

# 2nd part - Description
This project is a web server powered by Express with business logic written in TypeScript and uses:
1. esbuild - build tool
2. nodemon, ts-node - to run project the project in development mode with instant reloading
3. dotenv - load env variables on startup
4. mysql2 - mysql driver supporting promises

# Before attempting to run
Run migrations available in migrations folder. You are responsible for creating schema first. Then copy content of `.env.example` and create new `.env` file. Variables with `DB_` prefix are self explanatory. `PORT` variable is used to run the webserver on specific port.

# Code structure
Entire code base can be find in src folder. Please see explanation of folders and files below:
- src/attendance - logic is grouped by feature therefore in this folder you can find files:
  - repository.ts - functions with business logic (querying and mutating data in database)
  - router.ts - web server routing (not all endpoints follow REST API conventions)
  - types.ts - TypeScript typings (request payload shape, response shape)
  - tests.ts - Test file that can be run with `npm run test` from apps/backend folder. Does not use test runner like Jest due to time constraints.
- src/app.ts - File where routes are assembled together.
- src/server.ts - Entry file
- src/types - Shared types for models such as Child and Attendance.
- src/utils - Just a single file exporting pool of database connections

# Endpoints
- GET /attendance/check/<childId> - returns object with `payload` property indicating if child is checked in or not
- POST /attendance/check - expects object with `childId` property and numeric value - returns 201 if the request was successful
- GET /attendance/checked - returns all children that are checked in
- GET /attendance/checked/today/2 - returns all children that spent more than 2 hours in the daycare

# Possible improvements
- More thorough testing
- Better error handling and error messages