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
    ign: String
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
  hltvUrl: 'https://hltv.org', // https://d1j2e1aix8fg66.cloudfront.net
  loadPage: async url => {
    const response = await promisify(request)(url);
    return response.body;
  }
});

async function getPlayer(id) {
  const player = await hltv.getPlayer({id});
  return {
    id,
    ...player
  };
}

async function getTeam(id) {
  const team = await hltv.getTeam({id});
  return {
    id,
    ...team
  };
}

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
    teamRankings() {
      return hltv.getTeamRanking();
    }
  }
};
