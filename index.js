import Keyholder from 'keyholder';
import basicAuth from 'basic-auth';
import {ApolloServer, AuthenticationError} from 'apollo-server';
import {resolvers, typeDefs} from './schema';

const keyholder = new Keyholder({
  id: process.env.KEYHOLDER_ID,
  apiKey: process.env.KEYHOLDER_API_KEY
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  async context({req}) {
    const auth = basicAuth(req);
    if (auth) {
      const isValid = await keyholder.test(auth.pass);
      if (isValid) {
        console.log('user is authenticated!');
        return {
          authenticated: true
        };
      }
    }

    throw new AuthenticationError('Invalid API key');
  }
});

server.listen(process.env.PORT).then(({url}) => {
  console.log(`🚀 Server ready at ${url}`);
});
