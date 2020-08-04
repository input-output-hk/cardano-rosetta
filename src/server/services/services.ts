import fs from 'fs';
import path from 'path';
import { Logger } from 'pino';
import { Repositories } from '../db/repositories';
import { ErrorFactory } from '../utils/errors';
import accountService, { AccountService } from './account-service';
import blockService, { BlockService } from './block-service';
import constructionService, { ConstructionService } from './construction-service';
import networkService, { NetworkService } from './network-service';
import cardanoService, { CardanoService } from './cardano-services';

export interface Services
  extends AccountService,
    BlockService,
    ConstructionService,
    NetworkService,
    CardanoService,
    // eslint-disable-next-line @typescript-eslint/ban-types
    NodeJS.Dict<Function> {}

const loadTopologyFile = () => {
  const topologyPath = process.env.TOPOLOGY_FILE_PATH;
  if (topologyPath === undefined) {
    throw ErrorFactory.topoloyFileNotFound();
  }
  return JSON.parse(fs.readFileSync(path.resolve(topologyPath)).toString());
};

const loadPageSize = (logger: Logger): number => {
  const pageSize = process.env.PAGE_SIZE;
  logger.debug(`Loading page size: ${pageSize}`);
  if (pageSize === undefined) {
    logger.error('Page size config not found');
    throw ErrorFactory.pageSizeNotFund();
  }
  return Number(pageSize);
};

const loadTTLOffset = (logger: Logger): number => {
  const ttlOffset = process.env.TTL_OFFSET;
  logger.debug(`Loading ttl offset: ${ttlOffset}`);
  if (ttlOffset === undefined) {
    logger.error('TTL offset config not found');
    throw ErrorFactory.ttlOffsetNotFound();
  }
  return Number(ttlOffset);
};

/**
 * Configures all the services required by the app
 *
 * @param repositories repositories to be used by the services
 */
export const configure = (repositories: Repositories, logger: Logger): Services => {
  const blockServiceInstance = blockService(
    repositories.blockchainRepository,
    loadPageSize(logger),
    repositories.networkRepository,
    logger
  );
  const cardanoServiceInstance = cardanoService(logger);
  return {
    ...accountService(repositories.networkRepository, blockServiceInstance, logger),
    ...blockServiceInstance,
    ...constructionService(
      cardanoServiceInstance,
      repositories.networkRepository,
      blockServiceInstance,
      loadTTLOffset(logger),
      logger
    ),
    ...networkService(repositories.networkRepository, blockServiceInstance, loadTopologyFile(), logger),
    ...cardanoServiceInstance
  };
};
