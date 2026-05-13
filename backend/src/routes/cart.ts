import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

/**
 * @openapi
 * tags:
 *   - name: Cart
 *     description: Shopping cart operations (requires authentication)
 */

async function getOrCreateCart(userId: number) {
  return prisma.cart.upsert({
    where:  { userId },
    create: { userId },
    update: {},
    include: {
      items: {
        include: { product: { include: { category: true } } },
        orderBy: { id: 'asc' },
      },
    },
  });
}

/**
 * @openapi
 * /api/cart:
 *   get:
 *     summary: Get the current user's cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Cart with items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await getOrCreateCart(req.user!.sub);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/cart/items:
 *   post:
 *     summary: Add a product to the cart (or increment quantity if already present)
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCartItemRequest'
 *     responses:
 *       200:
 *         description: Updated cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Not authenticated
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
router.post('/items', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = z.object({
      productId: z.number().int().positive(),
      quantity:  z.number().int().positive().default(1),
    }).safeParse(req.body);
    if (!parsed.success) throw new AppError(400, parsed.error.errors.map((e) => e.message).join('; '));

    const { productId, quantity } = parsed.data;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError(404, 'Product not found');

    const cart = await prisma.cart.upsert({
      where:  { userId: req.user!.sub },
      create: { userId: req.user!.sub },
      update: {},
    });

    await prisma.cartItem.upsert({
      where:  { cartId_productId: { cartId: cart.id, productId } },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity: { increment: quantity } },
    });

    const updated = await getOrCreateCart(req.user!.sub);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/cart/items/{id}:
 *   patch:
 *     summary: Update quantity of a cart item
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: CartItem ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartItemRequest'
 *     responses:
 *       200:
 *         description: Updated cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.patch('/items/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemId = parseInt(req.params.id);
    if (isNaN(itemId)) throw new AppError(400, 'Invalid item ID');

    const parsed = z.object({ quantity: z.number().int().positive() }).safeParse(req.body);
    if (!parsed.success) throw new AppError(400, parsed.error.errors.map((e) => e.message).join('; '));

    const cart = await prisma.cart.findUnique({ where: { userId: req.user!.sub } });
    if (!cart) throw new AppError(404, 'Cart item not found');

    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
    if (!item) throw new AppError(404, 'Cart item not found');

    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: parsed.data.quantity } });

    const updated = await getOrCreateCart(req.user!.sub);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/cart/items/{id}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: CartItem ID
 *     responses:
 *       200:
 *         description: Updated cart after removal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.delete('/items/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemId = parseInt(req.params.id);
    if (isNaN(itemId)) throw new AppError(400, 'Invalid item ID');

    const cart = await prisma.cart.findUnique({ where: { userId: req.user!.sub } });
    if (!cart) throw new AppError(404, 'Cart item not found');

    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
    if (!item) throw new AppError(404, 'Cart item not found');

    await prisma.cartItem.delete({ where: { id: itemId } });

    const updated = await getOrCreateCart(req.user!.sub);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
