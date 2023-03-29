import {
  AWSPluginAux,
  LoggerPluginAux,
  LogLevel,
  middleware,
  MySQLPluginAux,
  TracerPluginAux,
} from 'serverless-simple-middleware';

export type Aux = AWSPluginAux &
  TracerPluginAux &
  LoggerPluginAux &
  MySQLPluginAux;

const dbConfiguration = {
  database: 'database name',
};

export const handler = middleware.build<Aux>([
  middleware.aws({
    config: undefined,
  }),
  middleware.trace({
    route: 'es:index/event',
    queueName: 'event_queue',
    system: 'AppName',
    awsConfig: undefined,
    region: 'ap-northeast-2',
  }),
  middleware.logger({
    name: __filename,
    level: LogLevel.Stupid,
  }),
  middleware.mysql({
    config: dbConfiguration,
  }),
]);
