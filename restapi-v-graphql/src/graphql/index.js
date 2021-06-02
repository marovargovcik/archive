const path = require('path');
const { Router } = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLFileLoader,
  addResolversToSchema,
  loadSchemaSync,
} = require('graphql-tools');

const resolvers = require('./resolvers');

const router = Router();

const typeDefs = loadSchemaSync(path.join(__dirname, './typeDefs.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

const schema = addResolversToSchema(typeDefs, resolvers);

router.use(
  '/graphql',
  graphqlHTTP((req) => ({
    context: {
      loaders: req.loaders,
    },
    graphiql: true,
    schema,
  })),
);

module.exports = router;
