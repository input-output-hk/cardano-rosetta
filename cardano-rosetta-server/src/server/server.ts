import fastify from 'fastify';
import fastifyBlipp from 'fastify-blipp';
import openapiGlue from 'fastify-openapi-glue';
import StatusCodes from 'http-status-codes';
import ApiError from './api-error';
import { Services } from './services/services';
import * as Controllers from './controllers/controllers';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { CardanoCli } from './utils/cardanonode-cli';
import { CardanoNode } from './utils/cardano-node';

interface ExtraParams {
  networkId: string;
  pageSize: number;
}

/**
 * This function builds a Fastify instance connecting the services with the
 * corresponding fastify route handlers.
 *
 * @param services to be used to handle the requests
 * @param logger true if logger should be enabled, false otherwise
 */
const buildServer = (
  services: Services,
  cardanoCli: CardanoCli,
  cardanoNode: CardanoNode,
  logLevel: string,
  extraParameters: ExtraParams
): fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> => {
  const server = fastify({ logger: { level: logLevel } });
  const { networkId, pageSize } = extraParameters;
  server.register(fastifyBlipp);
  server.register(openapiGlue, {
    specification: `${__dirname}/openApi.json`,
    service: Controllers.configure(services, cardanoCli, cardanoNode, networkId, pageSize),
    noAdditional: true
  });

  // Custom error handling is needed as the specified by Rosetta API doesn't match
  // the fastify default one
  server.setErrorHandler((error: Error, request, reply) => {
    request.log.error(error);
    if (error instanceof ApiError) {
      // rosseta-go-sdk always returns 500
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        ...error,
        message: error.message
      });
    } else
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: `An error occurred for request ${request.id}`,
        details: error.message
      });
  });

  return server;
};

export default buildServer;