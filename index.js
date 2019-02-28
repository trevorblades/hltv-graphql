import Keyholder from 'keyholder';
import {ApolloServer, AuthenticationError} from 'apollo-server';
import {resolvers, typeDefs} from './schema';

const keyholder = new Keyholder({
  id: process.env.KEYHOLDER_ID,
  apiKey: process.env.KEYHOLDER_API_KEY
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  formatError: error => {
    console.error(error);
    return error;
  },
  async context({req}) {
    const isValid = await keyholder.testReq(req);
    if (isValid) {
      return {
        authenticated: true
      };
    }

    throw new AuthenticationError('Invalid API key');
  }
});

server.listen(process.env.PORT).then(({url}) => {
  console.log(`🚀 Server ready at ${url}`);
});
