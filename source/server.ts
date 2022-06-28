import http from 'http';
import bodyParser from 'body-parser';
import express from 'express';
import logging from './config/logging';
import config from './config/config';
import JSONdb from 'simple-json-db';
export const db = new JSONdb('./source/data/db.json');
import movieRoutes from './routes/movie';

const NAMESPACE = 'Server';
const server = express();

server.use((req, res, next) => {
  logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

  res.on('finish', () => {
    logging.info(
      NAMESPACE,
      `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
    );
  });

  next();
});

//Parse the request
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

//Rules of API
server.use((req, res, next) => {
  res.header('Access-Control-Alow-Origin', '*');
  res.header('Access-Control-Alow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
    return res.status(200).json({});
  }

  next();
});

//Routes
server.use('/', movieRoutes);

//Error Handling
server.use((req, res, next) => {
  const error = new Error('not found');
  return res.status(404).json({ message: error.message });
});

//Create Server
const httpServer = http.createServer(server);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`));

module.exports = httpServer;
