import { Router } from "express";
import { Player } from "../interfaces/foot/players";
import { FootballPlayersController } from "../controllers/footPlayers";
import { LeagueInfo } from "../interfaces/foot/leagues";

export default function routerFootballPlayers(
  db: Player[],
  leagues: LeagueInfo[],
) {
  const router = Router();
  const controller = new FootballPlayersController(db, leagues);

  router.get("/", controller.getInfoDataset);

  router.get("/info", controller.getInfoBy)

  router.get("/players", controller.getPlayers);

  router.get("/team/national", controller.getNationalTeam);

  router.get("/players/search", controller.searchPlayers);

  router.get("/club/search", controller.searchClub);

  return router;
}
