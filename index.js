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
  async context({req}) {
    const isValid = await keyholder.test(req.query.apiKey);
    console.log('valid', isValid);
    if (!isValid) {
      throw new AuthenticationError('Invalid API key');
    }

    return {
      authenticated: true
    };
  }
});

server.listen(process.env.PORT).then(({url}) => {
  console.log(`🚀 Server ready at ${url}`);
});
