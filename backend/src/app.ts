import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiDist from 'swagger-ui-dist';

import categoriesRouter from './routes/categories';
import productsRouter   from './routes/products';
import authRouter       from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

// Absolute path to swagger-ui-dist static files (bundled JS + CSS)
const swaggerDistPath = swaggerUiDist.getAbsoluteFSPath();

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
app.use(cookieParser());
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
      securitySchemes: {
        cookieAuth: { type: 'apiKey', in: 'cookie', name: 'token' },
      },
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
        UserResponse: {
          type: 'object',
          properties: {
            id:        { type: 'integer' },
            email:     { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName:  { type: 'string' },
            role:      { type: 'string', enum: ['customer', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            email:     { type: 'string', format: 'email', example: 'jane@example.com' },
            password:  { type: 'string', minLength: 8, example: 'Str0ngPass!' },
            firstName: { type: 'string', example: 'Jane' },
            lastName:  { type: 'string', example: 'Doe' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', format: 'email', example: 'admin@techshop.com' },
            password: { type: 'string', example: 'Admin1234!' },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Validation error',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
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

// ── Swagger / API docs ────────────────────────────────────────────────────────

// Serve raw OpenAPI spec (used by the UI and useful for tooling)
app.get('/api-docs/spec.json', (_req, res) => res.json(swaggerSpec));

// Serve swagger-ui-dist static assets (JS, CSS) at /api-docs/assets/*
app.use('/api-docs/assets', express.static(swaggerDistPath));

// Serve the Swagger UI HTML page
// Uses absolute asset paths (/api-docs/assets/...) to avoid relative-path issues
app.get('/api-docs', (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TechShop API Docs</title>
  <link rel="stylesheet" href="/api-docs/assets/swagger-ui.css">
  <style>body { margin: 0; }</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="/api-docs/assets/swagger-ui-bundle.js"></script>
  <script src="/api-docs/assets/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function () {
      window.ui = SwaggerUIBundle({
        url: '/api-docs/spec.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        plugins: [SwaggerUIBundle.plugins.DownloadUrl],
        layout: 'StandaloneLayout'
      });
    };
  </script>
</body>
</html>`);
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/categories', categoriesRouter);
app.use('/api/products',   productsRouter);
app.use('/api/auth',       authRouter);

// Root redirect → API docs
app.get('/', (_req, res) => res.redirect('/api-docs'));

// Health check — used by Docker healthcheck and load balancers
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Error handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`TechShop API  →  http://localhost:${PORT}`);
  console.log(`Swagger UI    →  http://localhost:${PORT}/api-docs`);
});
