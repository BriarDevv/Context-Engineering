<!-- lint fixture: intentionally violates the standard (over cap, inferable
     content, non-canonical section, drifted command). Do not imitate. -->
# bloated-fixture

This repository contains the source code for our application, organized in
folders. The main folder is src, which contains the code. There is also a
tests folder, which contains the tests.

## Architecture overview

The application follows a layered architecture. The presentation layer talks
to the service layer, which talks to the data layer. Each layer is in its own
folder. The folders are organized by feature. Each feature has its own folder.

Here is the full file tree:

- src/
  - app/
    - page.tsx — the home page
    - layout.tsx — the layout
    - about/
      - page.tsx — the about page
    - products/
      - page.tsx — the products page
      - [slug]/
        - page.tsx — the product detail page
    - cart/
      - page.tsx — the cart page
    - checkout/
      - page.tsx — the checkout page
  - components/
    - Button.tsx — a button component
    - Card.tsx — a card component
    - Header.tsx — the header component
    - Footer.tsx — the footer component
    - Modal.tsx — a modal component
    - Spinner.tsx — a loading spinner
  - lib/
    - utils.ts — utility functions
    - api.ts — api helpers
    - constants.ts — constants
  - hooks/
    - useCart.ts — cart hook
    - useAuth.ts — auth hook
- tests/
  - unit/ — unit tests
  - e2e/ — end to end tests

## Commands

- `npm run dev` — starts the development server
- `npm run build` — builds the application
- `npm run test` — runs the tests
- `npm run lint` — lints the code

## Coding standards

Always write clean code. Follow the existing patterns in the codebase. Use
meaningful variable names. Keep functions small. Do not repeat yourself.
Write comments only when necessary. Prefer composition over inheritance.
Use TypeScript strict mode. Never use the any type. Always handle errors.
Always write tests for new code. Keep components pure when possible.

## Gotchas

- The development server sometimes needs a restart.
- Remember that the code is in the src folder.
- The tests are in the tests folder.
- We use TypeScript, so the files end in .ts and .tsx.
- The package manager is npm, so use npm commands.
- The framework is Next.js, which uses file-based routing.
- React components must return JSX.
- CSS is done with Tailwind, so use className.
- The linter will complain about unused variables.
- Git is used for version control.

## Hard constraints

- Never write bad code.
- Always follow best practices.
- Do not break the build.
- Keep the code clean at all times.
- Make sure everything works before committing.

## More notes

Some additional notes about the project that did not fit anywhere else:
remember to update dependencies regularly, check the console for errors,
and keep an eye on bundle size. The team prefers small pull requests.
When in doubt, ask. Documentation is important, so document everything.
The roadmap is maintained elsewhere. Deployment happens from the main
branch. Environment variables are configured in the hosting provider.
Secrets must not be committed, obviously. The design system is evolving.
Performance matters, so measure before optimizing. Accessibility matters
too, so use semantic HTML. SEO is handled by the framework mostly. Images
should be optimized. Fonts are self-hosted. Analytics are anonymized.

## Team conventions

Standups are on Mondays. The board is in the project tool. Branches are
named after tickets. Reviews need one approval. Releases are weekly.
The changelog is generated. Feature flags gate risky work. Errors go to
the tracker. Logs are structured. Dashboards exist for the main flows.
