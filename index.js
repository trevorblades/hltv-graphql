import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {resolvers, typeDefs} from './schema';

const app = express();

// app.get('/', async (req, res) => {
//   try {
//     const rankings = await hltv.getTeamRanking();
//     const teams = await Promise.all(
//       rankings.slice(0, 5).map(ranking => hltv.getTeam({id: ranking.team.id}))
//     );

//     const players = await Promise.all(
//       teams.flatMap(team =>
//         team.players.map(player => hltv.getPlayer({id: player.id}))
//       )
//     );

//     res.send(players);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.applyMiddleware({app});

app.listen(process.env.PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT}${
      server.graphqlPath
    }`
  );
});
