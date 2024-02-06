import { Router } from 'express';
import { scrapeController } from './scrape.controller';

/* Fire the router function */
export const scrapeRouter: Router = Router();

// Create a default route.
scrapeRouter.get('/scrape', scrapeController.getAll);
