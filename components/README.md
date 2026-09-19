# components/

This directory contains reusable React components.

## Purpose

- Shared UI components (buttons, forms, cards, etc.)
- shadcn/ui component integrations
- Layout components (navigation, headers, footers)
- Feature-specific components (shift calendar, clock in/out buttons, etc.)

## Structure

```
components/
├── ui/             # shadcn/ui components and base UI elements
├── layout/         # Layout components (navigation, sidebar, etc.)
├── forms/          # Form components and form field wrappers
└── features/       # Feature-specific components
```

## Guidelines

- Use TypeScript for all components
- Follow React best practices (composition, hooks, etc.)
- Components should be mobile-first responsive
- Use shadcn/ui for consistent styling
