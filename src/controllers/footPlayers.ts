import { Request, Response } from "express";
import { Player } from "../interfaces/foot/players";
import { FootballPlayersService } from "../services/footPlayers";
import { LeagueInfo } from "../interfaces/foot/leagues";

type Filter = "club" | "national" | "league";

export class FootballPlayersController {
  private readonly service: FootballPlayersService;

  constructor(
    protected db: Player[],
    protected leagues: LeagueInfo[],
  ) {
    this.service = new FootballPlayersService(db);
    this.getInfoBy = this.getInfoBy.bind(this);
    this.getInfoDataset = this.getInfoDataset.bind(this);
    this.getPlayers = this.getPlayers.bind(this);
    this.getNationalTeam = this.getNationalTeam.bind(this);
    this.searchPlayers = this.searchPlayers.bind(this);
    this.searchClub = this.searchClub.bind(this);
  }

  private internalError(res: Response, error: unknown) {
    console.error(error);

    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Erreur interne du serveur",
    });
  }
  public async getInfoBy(req: Request, res: Response) {
    try {
      const filter = req.query.filter as Filter | undefined;

      const handlers = {
        club: () => this.service.clubs(),
        national: () => this.service.nationalities(),
        league: () => this.leagues,
      };

      const data = filter ? handlers[filter]?.() : this.service.clubs();

      return res.status(200).json(data);
    } catch (error) {
      return this.internalError(res, error);
    }
  }
  public async getPlayers(req: Request, res: Response) {
    try {
      const filter = req.query.filter as Filter | undefined;
      const id = Number(req.query.idValue);

      if (!filter) {
        return res.status(400).json({
          code: "BAD_REQUEST",
          message: "filter is required",
        });
      }

      if (Number.isNaN(id)) {
        return res.status(400).json({
          code: "BAD_REQUEST",
          message: "idValue must be a number",
        });
      }

      const handlers = {
        club: () => this.service.getPlayersByClub(id),
        national: () => this.service.getPlayersByNationality(id),
        league: () => this.service.getPlayersByLeague(id),
      };

      const handler = handlers[filter];

      if (!handler) {
        return res.status(400).json({
          code: "BAD_REQUEST",
          message: "Invalid filter",
        });
      }

      return res.status(200).json(handler());
    } catch (error) {
      return this.internalError(res, error);
    }
  }
  public async getNationalTeam(req: Request, res: Response) {
    try {
      const id = Number(req.query.idValue);
      if (Number.isNaN(id)) {
        return res.status(400).json({
          code: "BAD_REQUEST",
          message: "idValue must be a number",
        });
      }
      const team = this.service.getNationalTeam(id);

      return res.status(200).json(team);
    } catch (error) {
      return this.internalError(res, error);
    }
  }
  public async searchPlayers(req: Request, res: Response) {
    try {
      const query = req.query.query as string | undefined;

      if (!query) {
        return res.status(400).json({
          code: "BAD_REQUEST",
          message: "query is required",
        });
      }

      const players = this.service.searchPlayers(query);

      return res.status(200).json(players);
    } catch (error) {
      return this.internalError(res, error);
    }
  }
  public async searchClub(req: Request, res: Response) {
    try {
      const query = req.query.query as string | undefined;

      if (!query) {
        return res.status(400).json({
          code: "BAD_REQUEST",
          message: "query is required",
        });
      }

      const club = this.service.searchClub(query);

      return res.status(200).json(club);
    } catch (error) {
      return this.internalError(res, error);
    }
  }
  public async getInfoDataset(_: Request, res: Response) {
    try {
      const players = this.service.getInfoDataset();
      return res.status(200).json(players);
    } catch (error) {
      return this.internalError(res, error);
    }
  }
}
