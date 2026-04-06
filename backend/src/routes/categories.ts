import { Hono } from 'hono';
import { db } from '../db/index';
import { categories } from '../db/schema';

const categoriesRouter = new Hono();

categoriesRouter.get('/', async (c) => {
  const all = await db.select().from(categories).orderBy(categories.name);
  return c.json(all);
});

export default categoriesRouter;
