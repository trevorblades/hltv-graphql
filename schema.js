import hltv from 'hltv';
import {gql} from 'apollo-server-express';

export const typeDefs = gql`
  type Team {
    id: ID
    name: String
    logo: String
    players: [Player]
  }

  type Player {
    id: ID
    name: String
    ign: String
    image: String
    age: Int
    team: Team
    country: Country
    statistics: Statistics
  }

  type TeamRanking {
    team: Team
  }

  type Country {
    name: String
    code: String
  }

  type Statistics {
    rating: Float
  }

  type Query {
    player(id: ID!): Player
    team(id: ID!): Team
    teamRankings(limit: Int): [TeamRanking]
  }
`;

function augmentWithId(method) {
  return async id => {
    const response = await method({id});
    return {
      ...response,
      id
    };
  };
}

const getPlayer = augmentWithId(hltv.getPlayer);
const getTeam = augmentWithId(hltv.getTeam);

export const resolvers = {
  Player: {
    team(parent) {
      return getTeam(parent.team.id);
    }
  },
  Team: {
    players(parent) {
      return Promise.all(parent.players.map(player => getPlayer(player.id)));
    }
  },
  TeamRanking: {
    team(parent) {
      return getTeam(parent.team.id);
    }
  },
  Query: {
    player(parent, args) {
      return getPlayer(args.id);
    },
    team(parent, args) {
      return getTeam(args.id);
    },
    async teamRankings(parent, args) {
      const teamRankings = await hltv.getTeamRanking();
      return teamRankings.slice(0, args.limit);
    }
  }
};
