import express, { Express } from "express";
import cors from "cors";
import sequelize from "./config/database";
import constants from "./config/constants";
import routerAuthenticate from "./routes/user";
import initRelations from "./models/relations";
import { readJson } from "./utils/json";
import { Player } from "./interfaces/foot/players";
import routerFootballPlayers from "./routes/footballPlayers";
import path from "path";
import { LeagueInfo } from "./interfaces/foot/leagues";
const app = express();

async function configGlobal(app: Express) {
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
}
async function configRouter(app: Express) {
  const urlApi = "/api";
  // chargement du dataset json "./data/players.json"
  const playersDatasetFc26 = await readJson<Player[]>(
    path.resolve("src/data/players.json"),
  );
  const leaguesDataset26 = await readJson<LeagueInfo[]>(
    path.resolve("src/data/leagues.json"),
  );
  app.use(`${urlApi}/auth`, routerAuthenticate);
  app.use(
    `${urlApi}/football`,
    routerFootballPlayers(playersDatasetFc26, leaguesDataset26),
  );
}
async function startServer(app: Express) {
  try {
    await configGlobal(app);
    await configRouter(app);

    await sequelize.authenticate();
    initRelations();
    await sequelize.sync();

    // ✅ utilise le port fourni par la plateforme
    const PORT = parseInt(process.env.PORT || "") || constants.PORT || 3000;
    const HOST = process.env.HOST || "0.0.0.0";

    app.listen(PORT, HOST, () => {
      console.log(`🚀 Serveur en route : http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erreur lors du démarrage du serveur :", error);
  }
}

export { app, startServer };
process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection :", err);
  process.exit(1);
});
