import HLTV from 'hltv';
import request from 'request';
import {gql} from 'apollo-server-express';
import {promisify} from 'util';

export const typeDefs = gql`
  type Team {
    id: ID
    name: String
    players: [Player]
  }

  type Player {
    id: ID
    name: String
    image: String
    age: Int
    team: Team
    country: Country
  }

  type TeamRanking {
    team: Team
  }

  type Country {
    name: String
    code: String
  }

  type Query {
    player(id: ID!): Player
    team(id: ID!): Team
    teamRankings: [TeamRanking]
  }
`;

const hltv = HLTV.createInstance({
  hltvUrl: 'https://d1j2e1aix8fg66.cloudfront.net',
  loadPage: async url => {
    const response = await promisify(request)(url);
    return response.body;
  }
});

export const resolvers = {
  Player: {
    team(parent) {
      return hltv.getTeam({id: parent.team.id});
    }
  },
  Team: {
    players(parent) {
      return Promise.all(
        parent.players.map(player => hltv.getPlayer({id: player.id}))
      );
    }
  },
  TeamRanking: {
    team(parent) {
      return hltv.getTeam({id: parent.team.id});
    }
  },
  Query: {
    player(parent, args) {
      return hltv.getPlayer({id: args.id});
    },
    team(parent, args) {
      return hltv.getTeam({id: args.id});
    },
    teamRankings() {
      return hltv.getTeamRanking();
    }
  }
};
