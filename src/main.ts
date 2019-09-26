import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { get } from 'config';
(async function bootstrap() {
  const serverConfig: { origin: string; port: number } = get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: serverConfig.origin });
    logger.log(`Accept requests from origin "${serverConfig.origin}"`);
  }
  // "start:dev": "cross-env NODE_ENV=development PORT=5000 tsc-watch -p tsconfig.build.json --onSuccess \"node dist/main.js\"",
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
})();
