import express, { type Request, type Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { createYoga } from "graphql-yoga";
import { openApiDocument } from "./config/index.js";
import { createGraphQLContext, graphQLSchema } from "./graphql/schema.js";
import genreRoutes from "./routes/genreRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import { correlationIdMiddleware } from "./middleware/correlationId.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const yoga = createYoga<{ req: Request; res: Response }>({
  schema: graphQLSchema,
  graphqlEndpoint: "/graphql",
  graphiql: true,
  context: ({ req, res }) => {
    return createGraphQLContext(req, res);
  },
});

app.use(correlationIdMiddleware);
app.use(requestLogger);

app.use(
  cors({
    origin: '*', //DEV ONLY: Include Origins in higher envs
    credentials: true,
  })
);

app.use(express.json());
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.get("/", (_req, res) => {
  res.redirect("/swagger");
});

app.get("/health", (_req, res) => {
  res.json({ status: "Healthy" });
});

app.use("/graphql", yoga as express.RequestHandler);
app.use("/genres", genreRoutes);
app.use("/movies", movieRoutes);
app.use(errorHandler);

export default app;
