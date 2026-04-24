import app from "./app.js";
import { env, logger } from "./config/index.js";

app.listen(env.port, () => {
  logger.info(`Listening on ${env.port}`);
});