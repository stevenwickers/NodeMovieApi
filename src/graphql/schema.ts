import { createSchema } from "graphql-yoga";
import type { Request, Response } from "express";
import { GraphQLError, GraphQLScalarType, Kind } from "graphql";

import { MovieRepository } from "../repositories/movieRepository.js";
import { moviePatchRequestSchema } from "../schemas/moviePatchRequest.js";
import { buildMovieFilters } from "../utils/movieFilters.js";

type GraphQLContext = {
  req: Request;
  res: Response;
  repo: MovieRepository;
};

const typeDefs = /* GraphQL */ `
  scalar UUID

  type MovieResponse {
    id: UUID!
    movieName: String!
    releaseDate: String!
    worldwideGross: Float
    productionBudget: Float
    domesticGross: Float
    genres: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  type PagedMovieResponse {
    items: [MovieResponse!]!
    page: Int!
    pageSize: Int!
    totalCount: Int!
    totalPages: Int!
    sortBy: String!
    sortDirection: String!
    usedDefaultSort: Boolean!
  }

  input MovieFiltersInput {
    search: String
    searchMode: String
    page: Int
    pageSize: Int
    sortBy: String
    sortDirection: String
    releaseDateFrom: String
    releaseDateTo: String
    worldwideGrossMin: Float
    worldwideGrossMax: Float
    productionBudgetMin: Float
    productionBudgetMax: Float
    domesticGrossMin: Float
    domesticGrossMax: Float
    genres: [String!]
  }

  input MoviePatchRequestInput {
    movieName: String
    releaseDate: String
    worldwideGross: Float
    productionBudget: Float
    domesticGross: Float
    genres: [String]
    genreNames: [String]
  }

  input MoviePatchInput {
    movieName: String
    releaseDate: String
    worldwideGross: Float
    productionBudget: Float
    domesticGross: Float
    genres: [String]
    genreNames: [String]
  }

  type Query {
    movies(filters: MovieFiltersInput): PagedMovieResponse!
    movieById(id: UUID!): MovieResponse
  }

  type Mutation {
    updateMovie(id: UUID!, patch: MoviePatchRequestInput!): MovieResponse!
  }
`;

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const parseUuid = (value: unknown): string => {
  if (typeof value !== "string" || !uuidPattern.test(value)) {
    throw new GraphQLError("UUID must be a valid UUID string.");
  }

  return value;
};

const uuidScalar = new GraphQLScalarType({
  name: "UUID",
  description: "A UUID string.",
  serialize: parseUuid,
  parseValue: parseUuid,
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError("UUID must be a valid UUID string.");
    }

    return parseUuid(ast.value);
  },
});

export const graphQLSchema = createSchema({
  typeDefs,
  resolvers: {
    UUID: uuidScalar,
    Query: {
      movies: async (
        _parent: unknown,
        args: { filters?: Record<string, unknown> },
        context: GraphQLContext
      ) => {
        const filters = buildMovieFilters(args.filters ?? {});
        context.req.log?.info({ filters }, "Fetching movies with GraphQL.");
        return context.repo.fetch(filters);
      },
      movieById: async (
        _parent: unknown,
        args: { id: string },
        context: GraphQLContext
      ) => {
        context.req.log?.info({ movieId: args.id }, "Fetching movie by id with GraphQL.");
        return context.repo.fetchById(args.id);
      },
    },
    Mutation: {
      updateMovie: async (
        _parent: unknown,
        args: { id: string; patch: Record<string, unknown> },
        context: GraphQLContext
      ) => {
        const patch = moviePatchRequestSchema.parse(args.patch);

        context.req.log?.info({ movieId: args.id, patch }, "Patching movie with GraphQL.");

        const movie = await context.repo.patch(args.id, patch);

        if (!movie) {
          throw new Error(`Movie with id ${args.id} was not updated.`);
        }

        return movie;
      },
    },
  },
});

export function createGraphQLContext(req: Request, res: Response): GraphQLContext {
  return {
    req,
    res,
    repo: new MovieRepository(),
  };
}
