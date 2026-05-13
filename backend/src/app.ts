import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import categoriesRouter from './routes/categories';
import productsRouter   from './routes/products';
import { errorHandler } from './middleware/errorHandler';

const app  = express();
const PORT = process.env.PORT ?? 3001;

// ── Security & parsing middleware ────────────────────────────────────────────
// CSP is configured to allow Swagger UI (needs unsafe-inline for its embedded scripts/styles)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:  ["'self'"],
        scriptSrc:   ["'self'", "'unsafe-inline'"],
        styleSrc:    ["'self'", "'unsafe-inline'"],
        imgSrc:      ["'self'", 'data:', 'https:'],
        fontSrc:     ["'self'", 'data:'],
        connectSrc:  ["'self'"],
      },
    },
  }),
);
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ── Swagger / OpenAPI ────────────────────────────────────────────────────────
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'TechShop API',
      version:     '1.0.0',
      description: 'REST API for TechShop electronics e-commerce MVP',
    },
    servers: [{ url: `http://localhost:${PORT}`, description: 'Local development' }],
    components: {
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: { error: { type: 'string' } },
        },
        Category: {
          type: 'object',
          properties: {
            id:          { type: 'integer' },
            name:        { type: 'string' },
            slug:        { type: 'string' },
            description: { type: 'string', nullable: true },
            createdAt:   { type: 'string', format: 'date-time' },
          },
        },
        ProductWithCategory: {
          type: 'object',
          properties: {
            id:          { type: 'integer' },
            name:        { type: 'string' },
            description: { type: 'string', nullable: true },
            price:       { type: 'number', format: 'double' },
            stock:       { type: 'integer' },
            imageUrl:    { type: 'string', nullable: true },
            categoryId:  { type: 'integer', nullable: true },
            category:    { $ref: '#/components/schemas/Category', nullable: true },
            createdAt:   { type: 'string', format: 'date-time' },
            updatedAt:   { type: 'string', format: 'date-time' },
          },
        },
        ProductsPage: {
          type: 'object',
          properties: {
            data:       { type: 'array', items: { $ref: '#/components/schemas/ProductWithCategory' } },
            total:      { type: 'integer' },
            page:       { type: 'integer' },
            limit:      { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
      },
      responses: {
        InternalError: {
          description: 'Unexpected server error',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
      },
    },
  },
  // swagger-jsdoc reads JSDoc comments from source files as plain text
  // process.cwd() = /app in Docker; src/ is mounted from host
  apis: [
    path.join(process.cwd(), 'src', 'routes', '*.ts'),
    path.join(process.cwd(), 'src', 'routes', '*.js'),
  ],
});

// customCss: ' ' prevents swagger-ui-express from injecting literal "undefined" into the style block
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCss: ' ' }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/categories', categoriesRouter);
app.use('/api/products',   productsRouter);

// Health check — used by Docker healthcheck and load balancers
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Error handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`TechShop API  →  http://localhost:${PORT}`);
  console.log(`Swagger UI    →  http://localhost:${PORT}/api-docs`);
});
