**IMPORTANT FOR CLAUDE: Reference this file before implementing anything**

# Project: Travel Planning App

## Project Overview

A TypeScript-based travel planning web application built with Remix that allows users to create trips, plan detailed itineraries, and manage packing lists. Focus on clean architecture, type safety, and maintainable code for rapid workshop development.

## Tech Stack

- **Languages**: TypeScript (strict mode)
- **Framework**: Remix (full-stack React)
- **Database**: SQLite with Drizzle ORM
- **Package Manager**: pnpm
- **Styling**: CSS Modules

## Code Style & Conventions

### Import/Module Standards

- Use ES6 imports with explicit file extensions for local modules
- Group imports: external libraries → internal modules → types
- Use barrel exports in shared directories (`shared/types/index.ts`)
- Prefer named imports over default imports for consistency

```typescript
// External imports
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';

// Internal imports
import { getTripById } from '~/features/trips/utils/tripService.js';
import { TripCard } from '~/features/trips/components/TripCard.js';

// Type imports
import type { Trip, CreateTripData } from '~/shared/types/index.js';
```

### Naming Conventions

- **Functions**: `camelCase` - `getUserTrips()`, `validateTripData()`
- **Components**: `PascalCase` - `TripCard`, `PackingList`
- **Hooks**: `camelCase` with `use` prefix - `useTrips()`, `useErrorHandler()`
- **Types/Interfaces**: `PascalCase` - `Trip`, `PackingItem`, `ApiResponse<T>`
- **Constants**: `SCREAMING_SNAKE_CASE` - `MAX_TRIP_DURATION`, `DEFAULT_CATEGORIES`
- **Files**:
  - Components: `PascalCase.tsx` - `TripCard.tsx`
  - Utilities: `camelCase.ts` - `dateUtils.ts`
  - CSS Modules: `kebab-case.module.css` - `trip-card.module.css`

### Patterns to Follow

- **Feature-based architecture**: Group related code by business feature
- **Custom hooks pattern**: Extract business logic into reusable hooks
- **Functional utilities**: Pure functions for data transformation and validation
- **Error boundaries**: Consistent error handling with try-catch and error utilities
- **Type-first development**: Define types before implementation
- **Explicit return types**: All exported functions must have explicit return types
- **Nullish coalescing**: Use `??` operator instead of `||` for safer defaults
- **Shared utilities**: Centralized utility functions in `src/shared/utils/` for reuse across features

```typescript
// Good: Explicit return type and error handling
export async function createTrip(tripData: CreateTripData): Promise<Trip> {
  try {
    const validatedData = validateTripData(tripData);
    const trip = await db.insert(trips).values(validatedData).returning();
    return trip[0];
  } catch (error) {
    throw handleDatabaseError(error);
  }
}
```

## Development Workflow

- **Branch strategy**: Feature branches for development, main for stable code
- **Commit message format**: Conventional Commits (`feat:`, `fix:`, `refactor:`, etc.)
- **PR requirements**: Linting clean, type checking successful

## Environment Setup

- **Node.js**: Latest LTS version
- **Package manager**: pnpm
- **Database**: SQLite file in project root
- **Environment variables**: None required for local development

## Common Commands

```bash
# Development server
pnpm dev

# Build command
pnpm build

# Lint command
pnpm lint

# Type check command
pnpm typecheck

# Database operations
pnpm db:migrate              # Run Drizzle migrations
pnpm db:seed                 # Seed database with sample data
drizzle-kit generate         # Generate new migration
sqlite3 travel-app.db        # Direct database access
```

## Project Structure

Key directories and their purpose:

- `/src/features` - Feature-based modules (trips, activities)
- `/src/shared` - Reusable components, hooks, utilities, and types
  - `/utils` - Utility functions (dateUtils, errorUtils, formatters, validationUtils)
  - `/types` - TypeScript type definitions and interfaces
- `/src/db` - Database schema, migrations, and seed data
- `/src/app` - Remix app structure (routes, root, styles)

## Review Process Guidelines

Before submitting any code, ensure the following steps are completed:

1. **Run all lint and check commands**

   ```bash
   pnpm lint && pnpm typecheck && pnpm format:check
   ```

2. **Review outputs and iterate until all issues are resolved**

3. **Assess compliance**:
   For each standard, explicitly state ✅ or ❌ and explain why:

   - Code style and formatting (ESLint + Prettier)
   - Naming conventions (camelCase functions, PascalCase components)
   - Architecture patterns (feature-based, custom hooks, functional utils)
   - Error handling (try-catch with error utilities)
   - Documentation (JSDoc for complex functions, README updates)

4. **Self-review checklist**:
   - [ ] Code follows feature-based architecture
   - [ ] All functions have explicit return types
   - [ ] Error handling implemented with try-catch
   - [ ] No console.log or debug code
   - [ ] CSS Modules used for styling
   - [ ] TypeScript strict mode compliance
   - [ ] Conventional commit message format

## Known Issues & Workarounds

- **SQLite Concurrency**: Use WAL mode for better read/write performance
- **CSS Module Types**: May need to add type declarations for CSS modules
- **Remix Dev Mode**: Hot reload may occasionally require manual refresh
- **Database Driver**: Using @libsql/client for Remix compatibility (better-sqlite3 bindings fail in dev server)
- **Database Operations**: SQLite CLI used for migrations and seed data:
  ```bash
  # Generate migration first
  npx drizzle-kit generate
  
  # Apply with sqlite3 CLI instead of pnpm db:migrate
  sqlite3 travel-app.db < src/db/migrations/XXXX_migration_name.sql
  
  # Seed data uses TypeScript script + sqlite3 CLI workflow
  # pnpm db:seed handles: generate SQL → apply migration → insert seed data
  ```
- **Stack Validation**: Use /debug route to verify database connection and data integrity
- **Button Component**: Uses `any` type for `as` prop to support Remix Link component compatibility
- **Type Safety**: Description fields use `string | null` to match database schema vs TypeScript `undefined`
- **Remix Route Naming**: Edit routes require underscore syntax `trips.$tripId_.edit.tsx` for flat routes (not nested)
- **Remix Deep Nesting Limits**: Avoid 4+ level nested routes - use flat structure instead (e.g., `activity.$activityId.edit.tsx` not `trips.$tripId.activities.$activityId_.edit.tsx`)
- **Route Consistency**: Maintain consistent patterns across features - all activity routes use `activity.*` flat structure
- **Form Validation**: Use separate validation functions for create vs update operations for better type safety
- **Date Utils**: Export alias functions for commonly used operations (`formatDate`, `isValidDate`, etc.)
- **Feature Modules**: Follow established pattern: `/utils/service.ts`, `/utils/validation.ts`, `/components/`
- **Form Styling**: All forms use clean minimal styling (no white background) with 1rem spacing, 640px mobile breakpoint, and border-top separator above actions for better readability

## References

- [Remix Documentation](https://remix.run/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [FUNCTIONAL.md](./FUNCTIONAL.md) - User stories and requirements
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture and patterns
