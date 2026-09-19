// Session type for organization context
export interface OrganizationContext {
  organizationId: string;
}

// Global context storage (to be set by request handlers)
let currentOrganizationContext: OrganizationContext | null = null;

/**
 * Set the organization context for the current request
 * This should be called at the beginning of API route handlers after authentication
 */
export function setOrganizationContext(context: OrganizationContext | null) {
  currentOrganizationContext = context;
}

/**
 * Get the current organization context
 */
export function getOrganizationContext(): OrganizationContext | null {
  return currentOrganizationContext;
}

/**
 * Clear the organization context
 * This should be called at the end of request handlers
 */
export function clearOrganizationContext() {
  currentOrganizationContext = null;
}

// Models that require organization filtering
const ORGANIZATION_MODELS = [
  'shift',
  'leaveRequest',
  'clockEntry',
  'incident',
  'cleaningTask',
  'cleaningLog',
  'user',
];

// Models that should auto-assign organizationId on create
const AUTO_ASSIGN_MODELS = [
  'shift',
  'leaveRequest',
  'clockEntry',
  'incident',
  'cleaningTask',
  'cleaningLog',
];

/**
 * Prisma Client Extension for multi-tenant data isolation
 * 
 * This extension:
 * 1. Automatically filters queries by organizationId for multi-tenant models
 * 2. Automatically assigns organizationId on create operations
 * 
 * Validates Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 * 
 * Note: Uses Prisma Client Extensions (v5+) instead of deprecated middleware API
 */
export function createMultiTenantExtension() {
  return {
    name: 'multi-tenant-extension',
    query: {
      $allOperations({ operation, model, args, query }: any) {
        const context = getOrganizationContext();

        // Skip extension if no organization context is set
        if (!context) {
          return query(args);
        }

        // Only apply to models that have organizationId
        if (!model || !ORGANIZATION_MODELS.includes(model)) {
          return query(args);
        }

        // Handle findMany, findFirst, findUnique - inject organizationId filter
        if (operation === 'findMany' || operation === 'findFirst' || operation === 'findUnique') {
          args.where = {
            ...args.where,
            organizationId: context.organizationId,
          };
        }

        // Handle create - auto-assign organizationId
        if (operation === 'create' && AUTO_ASSIGN_MODELS.includes(model)) {
          args.data = {
            ...args.data,
            organizationId: context.organizationId,
          };
        }

        // Handle createMany - auto-assign organizationId to all records
        if (operation === 'createMany' && AUTO_ASSIGN_MODELS.includes(model)) {
          if (args.data) {
            // Handle array of records
            if (Array.isArray(args.data)) {
              args.data = args.data.map((record: any) => ({
                ...record,
                organizationId: context.organizationId,
              }));
            } else {
              // Handle single record
              args.data = {
                ...args.data,
                organizationId: context.organizationId,
              };
            }
          }
        }

        // Handle update and updateMany - ensure organizationId filter
        if (operation === 'update' || operation === 'updateMany') {
          args.where = {
            ...args.where,
            organizationId: context.organizationId,
          };
        }

        // Handle delete and deleteMany - ensure organizationId filter
        if (operation === 'delete' || operation === 'deleteMany') {
          args.where = {
            ...args.where,
            organizationId: context.organizationId,
          };
        }

        // Handle count - ensure organizationId filter
        if (operation === 'count') {
          args.where = {
            ...args.where,
            organizationId: context.organizationId,
          };
        }

        return query(args);
      },
    },
  };
}
