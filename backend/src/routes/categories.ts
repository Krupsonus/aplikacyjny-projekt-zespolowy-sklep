import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Categories
 *     description: Product category operations
 */

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: List all product categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Array of categories ordered by name
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

export default router;
