import { Player } from "../interfaces/foot/players";

interface Entity {
  id: number;
  name: string;
  flag: string | null;
  iso: string | null;
}

export class FootballPlayersService {
  constructor(protected db: Player[]) {}

  private uniqueBy(
    idKey: keyof Player,
    nameKey: keyof Player,
    flag = false,
  ): Entity[] {
    const map = new Map<number, Entity>();

    for (const player of this.db) {
      const id = player[idKey];
      const name = player[nameKey];

      if (typeof id !== "number" || typeof name !== "string") {
        continue;
      }

      map.set(id, {
        id,
        name,
        flag: flag ? player.nationality_flag_url : null,
        iso: flag ? player.nationality_alpha2 : null,
      });
    }

    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  public clubs(): Entity[] {
    return this.uniqueBy("club_team_id", "club_name");
  }

  public nationalities(): Entity[] {
    return this.uniqueBy("nationality_id", "nationality_name", true);
  }

  public leagues(): Entity[] {
    return this.uniqueBy("league_id", "league_name");
  }
  private getPlayersBy<K extends keyof Player>(
    key: K,
    value: Player[K],
  ): Player[] {
    return this.db.filter((player) => player[key] === value);
  }

  public getPlayersByClub(clubId: number): Player[] {
    return this.getPlayersBy("club_team_id", clubId);
  }

  public getPlayersByLeague(leagueId: number): Player[] {
    return this.getPlayersBy("league_id", leagueId);
  }

  public getPlayersByNationality(nationalityId: number): Player[] {
    return this.getPlayersBy("nationality_id", nationalityId);
  }

  public getNationalTeam(nationalityId: number): Player[] {
    return this.db.filter(
      (player) =>
        player.nationality_id === nationalityId &&
        player.nation_team_id !== null,
    );
  }
  public searchPlayers(query: string): Player[] {
    const search = query.trim().toLowerCase();

    if (!search) {
      return [];
    }

    return this.db.filter((player) =>
      player.short_name_normalized.includes(search),
    );
  }

  public searchClub(query: string) {
    const search = query.trim().toLowerCase();

    if (!search) {
      return [];
    }

    const players = this.db.filter((player) => {
      const normalized = player.club_name_normalized ?? "";
      const name = player.club_name?.trim().toLowerCase() ?? "";

      return normalized.includes(search) || name.includes(search);
    });
    //return players.map((p) => p.club_name);
    const clubs = players.reduce((acc, player) => {
      if (player.club_team_id != null) {
        acc.set(player.club_team_id, {
          teamId: player.club_team_id,
          name: player.club_name,
        });
      }
      return acc;
    }, new Map());

    return [...clubs.values()];
  }
  public getInfoDataset() {
    return {
      countPlayers: this.db.length,
      countClubs: this.clubs().length,
      countLeagues: this.leagues().length,
      countNational: this.nationalities().length,
    };
  }
}
