import cors from 'cors';
import dotenv from 'dotenv';
import * as cron from 'node-cron';
import { DataSource } from 'typeorm';
import bodyParser from 'body-parser';
import express, { Express } from 'express';
import { Scrape } from './src/scrape/scrape.entity';
import { scrapeController } from './src/scrape/scrape.controller';
import { scrapeRouter } from './src/scrape/scrape.router';

const app: Express = express();
dotenv.config();

// Parse request Body
app.use(bodyParser.json());

// Use CORS install types as well
app.use(cors());

//Create Dababase Connection
export const AppDataSource = new DataSource({
  port: 3306,
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [Scrape],
  synchronize: true,
});

AppDataSource.initialize()
  .then(() => {
    app.listen(process.env.PORT);
    console.log('Database Connection Successful!');
  })
  .catch((err) => {
    console.error(err);
  });

app.use('/', scrapeRouter);

// Schedule the scraping task to run every half hour
cron.schedule(
  '*/30 * * * *',
  scrapeController.scrapeMedGasPrice,
);
