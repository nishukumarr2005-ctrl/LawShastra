const json = (schema = { type: 'object' }) => ({
  required: true,
  content: { 'application/json': { schema } },
})
const ok = (description = 'Success') => ({
  description,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } },
})
const bearer = [{ bearerAuth: [] }]
const idParam = { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
const slugParam = { name: 'slug', in: 'path', required: true, schema: { type: 'string' } }

const crudPaths = (base, tag, itemSchemaName, secured = false) => ({
  [`${base}`]: {
    get: { tags: [tag], summary: `List ${tag}`, ...(secured ? { security: bearer } : {}), responses: { 200: ok() } },
    post: { tags: [tag], summary: `Create ${tag.slice(0, -1) || tag}`, ...(secured ? { security: bearer } : {}), requestBody: json({ $ref: `#/components/schemas/${itemSchemaName}` }), responses: { 200: ok(), 201: ok('Created') } },
  },
  [`${base}/{id}`]: {
    get: { tags: [tag], summary: `Get ${tag.slice(0, -1) || tag}`, ...(secured ? { security: bearer } : {}), parameters: [idParam], responses: { 200: ok(), 404: ok('Not found') } },
    put: { tags: [tag], summary: `Update ${tag.slice(0, -1) || tag}`, ...(secured ? { security: bearer } : {}), parameters: [idParam], requestBody: json({ $ref: `#/components/schemas/${itemSchemaName}` }), responses: { 200: ok() } },
    delete: { tags: [tag], summary: `Delete ${tag.slice(0, -1) || tag}`, ...(secured ? { security: bearer } : {}), parameters: [idParam], responses: { 200: ok() } },
  },
})

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'LawShastra API',
    version: '1.0.0',
    description: 'API documentation for the LawShastra legal learning platform (Cloudflare Workers + D1). Base URL includes /api/v1.',
  },
  servers: [{ url: '/api/v1', description: 'Current origin /api/v1' }],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Public' },
    { name: 'Categories' },
    { name: 'Laws' },
    { name: 'Courses' },
    { name: 'Admin Dashboard' },
    { name: 'Admin Users' },
    { name: 'Admin Categories' },
    { name: 'Admin CMS' },
  ],
  paths: {
    // Health (served outside /api/v1 at /api/health, included for reference)
    '/api/health': {
      get: { tags: ['Health'], summary: 'Health check', servers: [{ url: '/' }], responses: { 200: ok('API is healthy') } },
    },

    // Auth
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Admin login',
        requestBody: json({
          type: 'object',
          required: ['email', 'password'],
          properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } },
        }),
        responses: { 200: ok('Logged in'), 401: ok('Invalid credentials') },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register (placeholder endpoint)',
        requestBody: json({ type: 'object', properties: { email: { type: 'string' } } }),
        responses: { 201: ok('Registration endpoint ready') },
      },
    },
    '/auth/me': {
      get: { tags: ['Auth'], summary: 'Get current user', security: bearer, responses: { 200: ok(), 401: ok('Unauthorized') } },
    },
    '/auth/logout': {
      post: { tags: ['Auth'], summary: 'Logout', responses: { 200: ok() } },
    },

    // Public
    '/public/catalog': { get: { tags: ['Public'], summary: 'Get public catalog (categories, subcategories, published laws)', responses: { 200: ok() } } },
    '/public/cms': { get: { tags: ['Public'], summary: 'Get public CMS data', responses: { 200: ok() } } },
    '/public/categories': { get: { tags: ['Public'], summary: 'Get live/published categories', responses: { 200: ok() } } },

    // Legacy/public-facing resources
    ...crudPaths('/categories', 'Categories', 'Category'),
    '/laws': {
      get: { tags: ['Laws'], summary: 'List laws', responses: { 200: ok() } },
      post: { tags: ['Laws'], summary: 'Create law', requestBody: json({ $ref: '#/components/schemas/Law' }), responses: { 201: ok('Created') } },
    },
    '/laws/slug/{slug}': {
      get: { tags: ['Laws'], summary: 'Get law by slug', parameters: [slugParam], responses: { 200: ok(), 404: ok('Not found') } },
    },
    '/laws/{id}': {
      put: { tags: ['Laws'], summary: 'Update law', parameters: [idParam], requestBody: json({ $ref: '#/components/schemas/Law' }), responses: { 200: ok() } },
      delete: { tags: ['Laws'], summary: 'Delete law', parameters: [idParam], responses: { 200: ok() } },
    },
    ...crudPaths('/courses', 'Courses', 'Course'),

    // Admin
    '/admin/dashboard': { get: { tags: ['Admin Dashboard'], summary: 'Get admin dashboard data', security: bearer, responses: { 200: ok(), 401: ok() } } },

    '/admin/users': {
      get: { tags: ['Admin Users'], summary: 'List users', security: bearer, responses: { 200: ok() } },
      post: { tags: ['Admin Users'], summary: 'Create user', security: bearer, requestBody: json({ $ref: '#/components/schemas/UserInput' }), responses: { 201: ok('Created') } },
    },
    '/admin/users/roles': { get: { tags: ['Admin Users'], summary: 'Get role definitions and permissions', security: bearer, responses: { 200: ok() } } },
    '/admin/users/{id}': {
      get: { tags: ['Admin Users'], summary: 'Get user', security: bearer, parameters: [idParam], responses: { 200: ok(), 404: ok() } },
      put: { tags: ['Admin Users'], summary: 'Update user', security: bearer, parameters: [idParam], requestBody: json({ $ref: '#/components/schemas/UserInput' }), responses: { 200: ok() } },
      delete: { tags: ['Admin Users'], summary: 'Delete user', security: bearer, parameters: [idParam], responses: { 200: ok() } },
    },

    ...crudPaths('/admin/categories', 'Admin Categories', 'Category', true),

    // Admin CMS (generic CRUD + actions)
    '/admin/bootstrap': { get: { tags: ['Admin CMS'], summary: 'Bootstrap admin CMS data', security: bearer, responses: { 200: ok() } } },
    ...crudPaths('/admin/subcategories', 'Admin CMS', 'GenericItem', true),
    ...crudPaths('/admin/articles', 'Admin CMS', 'GenericItem', true),
    ...crudPaths('/admin/pages', 'Admin CMS', 'GenericItem', true),
    ...crudPaths('/admin/media', 'Admin CMS', 'GenericItem', true),
    ...crudPaths('/admin/tags', 'Admin CMS', 'GenericItem', true),
    ...crudPaths('/admin/homepage-blocks', 'Admin CMS', 'GenericItem', true),
    ...crudPaths('/admin/banners', 'Admin CMS', 'GenericItem', true),
    ...crudPaths('/admin/menus', 'Admin CMS', 'GenericItem', true),
    ...crudPaths('/admin/visibility', 'Admin CMS', 'GenericItem', true),
    ...crudPaths('/admin/seo', 'Admin CMS', 'GenericItem', true),
    ...crudPaths('/admin/feature-flags', 'Admin CMS', 'GenericItem', true),
    ...crudPaths('/admin/roles', 'Admin CMS', 'GenericItem', true),
    '/admin/feature-flags/{id}/toggle': { post: { tags: ['Admin CMS'], summary: 'Toggle feature flag', security: bearer, parameters: [idParam], responses: { 200: ok() } } },
    '/admin/settings': {
      get: { tags: ['Admin CMS'], summary: 'Get site settings', security: bearer, responses: { 200: ok() } },
      put: { tags: ['Admin CMS'], summary: 'Update site settings', security: bearer, requestBody: json({ $ref: '#/components/schemas/GenericItem' }), responses: { 200: ok() } },
    },
    '/admin/activity-logs': {
      get: { tags: ['Admin CMS'], summary: 'List activity logs', security: bearer, responses: { 200: ok() } },
      post: { tags: ['Admin CMS'], summary: 'Create activity log entry', security: bearer, requestBody: json({ $ref: '#/components/schemas/GenericItem' }), responses: { 201: ok() } },
    },
    '/admin/notifications': {
      get: { tags: ['Admin CMS'], summary: 'List notifications', security: bearer, responses: { 200: ok() } },
      post: { tags: ['Admin CMS'], summary: 'Create notification', security: bearer, requestBody: json({ $ref: '#/components/schemas/GenericItem' }), responses: { 201: ok() } },
    },
    '/admin/notifications/{id}/read': { post: { tags: ['Admin CMS'], summary: 'Mark notification read', security: bearer, parameters: [idParam], responses: { 200: ok() } } },
    '/admin/backups': { get: { tags: ['Admin CMS'], summary: 'List backups', security: bearer, responses: { 200: ok() } } },
    '/admin/backups/run': { post: { tags: ['Admin CMS'], summary: 'Run backup', security: bearer, responses: { 200: ok() } } },
    '/admin/maintenance': { get: { tags: ['Admin CMS'], summary: 'List maintenance tasks', security: bearer, responses: { 200: ok() } } },
    '/admin/maintenance/{id}/toggle': { post: { tags: ['Admin CMS'], summary: 'Toggle maintenance task', security: bearer, parameters: [idParam], responses: { 200: ok() } } },
    '/admin/maintenance/{id}/run': { post: { tags: ['Admin CMS'], summary: 'Run maintenance task', security: bearer, parameters: [idParam], responses: { 200: ok() } } },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {},
          errors: { type: 'array', items: { type: 'object' } },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string', nullable: true },
          status: { type: 'string', example: 'LIVE' },
        },
      },
      Chapter: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          content: { type: 'string', description: 'HTML or plain text content' },
        },
      },
      Law: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          shortTitle: { type: 'string', nullable: true },
          slug: { type: 'string' },
          categoryId: { type: 'integer' },
          jurisdiction: { type: 'string', example: 'India' },
          summary: { type: 'string' },
          status: { type: 'string', example: 'DRAFT' },
          subcategories: { type: 'array', items: { type: 'string' } },
          chapters: { type: 'array', items: { $ref: '#/components/schemas/Chapter' } },
        },
      },
      Course: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          category: { type: 'string' },
          level: { type: 'string' },
          duration: { type: 'string' },
          status: { type: 'string' },
          summary: { type: 'string', nullable: true },
        },
      },
      UserInput: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
          role: { type: 'string' },
        },
      },
      GenericItem: { type: 'object', additionalProperties: true, description: 'CMS resource payload (varies by endpoint)' },
    },
  },
}
