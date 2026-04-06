import { Hono } from 'hono';
import { db } from '../db/index';
import { banks } from '../db/schema';

const banksRouter = new Hono();

banksRouter.get('/', async (c) => {
  const all = await db.select().from(banks).orderBy(banks.name);
  return c.json(all);
});

export default banksRouter;
