import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Products
 *     description: Product catalogue operations
 */

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: List products (paginated, filterable by category)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 12
 *         description: Items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         example: laptops
 *         description: Category slug to filter by (e.g. "laptops", "smartphones")
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: laptop
 *         description: Full-text search across product name and description (case-insensitive)
 *     responses:
 *       200:
 *         description: Paginated list of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsPage'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 12));
    const categorySlug = req.query.category as string | undefined;
    const search       = (req.query.search as string | undefined)?.trim() || undefined;

    const where = {
      ...(categorySlug && { category: { slug: categorySlug } }),
      ...(search && {
        OR: [
          { name:        { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details including category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductWithCategory'
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new AppError(400, 'Invalid product ID');

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) throw new AppError(404, 'Product not found');

    res.json(product);
  } catch (err) {
    next(err);
  }
});

export default router;
