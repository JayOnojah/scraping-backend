import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { AppDataSource } from '../..';
import { Scrape } from './scrape.entity';
import * as cheerio from 'cheerio';
import axios from 'axios';

class ScrapeController {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.scrapeMedGasPrice =
      this.scrapeMedGasPrice.bind(this);
    this.parseMedGasPrice =
      this.parseMedGasPrice.bind(this);
  }

  // Method for the get route
  public async getAll(
    req: Request,
    res: Response,
  ): Promise<Response> {
    let allScrape: Scrape[];

    try {
      allScrape = await AppDataSource.getRepository(
        Scrape,
      ).find({
        order: {
          date: 'ASC',
        },
      });

      allScrape = instanceToPlain(allScrape) as Scrape[];

      return res.json(allScrape).status(200);
    } catch (_errors) {
      return res
        .json({ error: 'Internal Server Error' })
        .status(500);
    }
  }

  public async scrapeMedGasPrice() {
    try {
      const response = await axios.get(
        'https://snowtrace.io/',
      );

      const medGasPrice = this.parseMedGasPrice(
        response.data,
      );

      const newScrape = new Scrape();

      newScrape.price = medGasPrice;
      newScrape.date = new Date(Date.now()).toISOString();

      let createdScrape: Scrape;

      createdScrape = await AppDataSource.getRepository(
        Scrape,
      ).save(newScrape);

      createdScrape = instanceToPlain(
        createdScrape,
      ) as Scrape;
      console.log(createdScrape);
    } catch (error) {
      console.error('Error scraping Med Gas Price:', error);
    }
  }

  public parseMedGasPrice(html: string): number {
    const $ = cheerio.load(html);
    const medGasPriceString = $(
      'div.text-right span.text-link',
    ).text();

    const medGasPrice = parseFloat(
      medGasPriceString.replace(/[^\d.-]/g, ''),
    );

    return medGasPrice;
  }
}

export const scrapeController = new ScrapeController();
