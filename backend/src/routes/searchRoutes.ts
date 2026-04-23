import { Router } from 'express';
import searchController from '../controllers/searchController.js';
import { authenticateJWT } from '../middlewares/auth.js';
import { isolateOrganization } from '../middlewares/rbac.js';
import { requireTenantContext } from '../middleware/tenantContext.js';
import { z } from 'zod';

const router = Router();

export const TransactionQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type TransactionQueryParams = z.infer<typeof TransactionQuerySchema>;

/**
 * @swagger
 * tags:
 *   name: Data Search
 *   description: Search and filter employees and transactions
 */

// Apply global authentication and isolation to all search routes
router.use(authenticateJWT);
router.use(isolateOrganization);
router.use(requireTenantContext);

/**
 * @swagger
 * /api/v1/search/organizations/{organizationId}/employees:
 *   get:
 *     summary: Search and filter employees
 *     tags: [Data Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get(
  '/organizations/:organizationId/employees',
  searchController.searchEmployees.bind(searchController)
);

/**
 * @swagger
 * /api/v1/search/organizations/{organizationId}/transactions:
 *   get:
 *     summary: Search and filter transactions with pagination
 *     tags: [Data Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of results to skip
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed, cancelled]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Filter by start date (ISO 8601)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: Filter by end date (ISO 8601)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: {}
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     hasMore:
 *                       type: boolean
 */
router.get(
  '/organizations/:organizationId/transactions',
  searchController.searchTransactions.bind(searchController)
);

export default router;
