import HLTV from 'hltv';
import {gql} from 'apollo-server-express';

export const typeDefs = gql`
  enum MatchType {
    Lan
    Online
    BigEvents
    Majors
  }

  enum RankingFilter {
    Top5
    Top10
    Top20
    Top30
    Top50
  }

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

  type PlayerRanking {
    id: ID
    name: String
    rating: Float
    player: Player
  }

  type Country {
    name: String
    code: String
  }

  type Statistics {
    rating: Float
    kills: Int
    headshots: String
    kdRatio: Float
    damagePerRound: Float
  }

  type Query {
    player(id: ID!): Player
    playerRanking(
      startDate: String
      endDate: String
      matchType: MatchType
      rankingFilter: RankingFilter
    ): [PlayerRanking]
    team(id: ID!): Team
    teamRanking(
      year: String
      month: String
      day: String
      country: String
    ): [TeamRanking]
  }
`;

export const resolvers = {
  Player: {
    team(parent) {
      return parent.team && HLTV.getTeam({id: parent.team.id});
    },
    async statistics(parent) {
      const {statistics} = await HLTV.getPlayerStats({id: parent.id});
      return statistics;
    }
  },
  PlayerRanking: {
    player(parent) {
      return HLTV.getPlayer({id: parent.id});
    }
  },
  Team: {
    players(parent) {
      return Promise.all(
        parent.players.map(player => HLTV.getPlayer({id: player.id}))
      );
    }
  },
  TeamRanking: {
    team(parent) {
      return HLTV.getTeam({id: parent.team.id});
    }
  },
  Query: {
    player(parent, args) {
      return HLTV.getPlayer(args);
    },
    playerRanking(parent, args) {
      console.log('player ranking');
      return HLTV.getPlayerRanking(args);
    },
    team(parent, args) {
      return HLTV.getTeam(args);
    },
    teamRanking(parent, args) {
      return HLTV.getTeamRanking(args);
    }
  }
};
