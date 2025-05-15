# Material Design 3 Migration Plan

This document outlines the plan for migrating the Komuniteti Admin App to use Material Design 3 (MD3) tokens consistently throughout the codebase.

## Goals

1. Improve visual consistency across the app
2. Ensure proper dark mode support
3. Simplify component styling with theme tokens
4. Make the app more maintainable
5. Enhance the user experience

## Tools

We've created two tools to help with this migration:

1. **MD3 Implementation Guide**: `src/styles/MD3_IMPLEMENTATION_GUIDE.md`
2. **MD3 Migration Check Script**: Run with `npm run md3-check`

## Migration Phases

### Phase 1: Foundation (Week 1) ✅ COMPLETED

- [x] Create MD3 theme configuration
- [x] Develop `useThemedStyles` hook
- [x] Create common styles
- [x] Update MobileFrameWrapper component
- [x] Update AccountSwitcher component
- [x] Create migration guide documentation
- [x] Create migration check script
- [x] Migrate ResidentForm component as an example

### Phase 2: Core Components (Week 2) 🔄 IN PROGRESS

- [ ] Update core components:
  - [ ] Button
  - [ ] Card
  - [ ] TextField
  - [ ] Modal
  - [ ] Surface

### Phase 3: Screen Layouts (Week 3-4)

- [ ] Update key screens:
  - [ ] Dashboard
  - [ ] Login & Authentication screens
  - [ ] Building screens (list, detail, form)
  - [ ] Resident screens
  - [ ] Payment screens

### Phase 4: Advanced Components (Week 5-6)

- [ ] Update remaining components:
  - [ ] Charts and data visualization
  - [ ] Forms
  - [ ] Lists
  - [ ] Navigation elements
  - [ ] Dialogs

### Phase 5: Testing & Refinement (Week 7)

- [ ] Test all components in both light and dark mode
- [ ] Ensure tablet layouts work properly
- [ ] Fix any inconsistencies
- [ ] Run accessibility checks
- [ ] Document any remaining issues

## Current Progress

As of our latest scan, we've identified **5,522 issues** across **117 files** that need to be updated:

- Hardcoded colors: 1,795 occurrences in 80 files
- Direct useTheme references: 100 occurrences in 100 files
- Static styles: 96 occurrences in 96 files
- Hardcoded spacing: 2,569 occurrences in 110 files
- Custom shadows: 246 occurrences in 50 files
- isDarkMode references: 716 occurrences in 63 files

We have successfully migrated 3 components:
1. MobileFrameWrapper
2. AccountSwitcher
3. ResidentForm

These components now serve as examples for the rest of the migration process, demonstrating the pattern of theme-aware styling and proper usage of MD3 tokens.

## Next Steps

1. Focus on migrating high-priority components that affect many screens:
   - Navigation components
   - List items
   - Cards and form fields
2. Work on migrating components with the most hardcoded values first
3. Gradually remove all isDarkMode references and move to theme-based styling

## Development Workflow

1. Run `npm run md3-check` to identify components that need migration
2. Start with components with the most hardcoded values
3. Follow the MD3 Implementation Guide
4. Test in both light and dark mode
5. Submit PR for review

## Component Migration Checklist

For each component, follow these steps:

1. Replace `useTheme` with `useThemedStyles`
2. Convert static styles to theme-aware: `styles` -> `styles(theme)`
3. Replace hardcoded colors with theme tokens
4. Replace hardcoded spacing with theme.spacing tokens
5. Use Paper components with proper variants
6. Use Surface with proper elevation for shadows
7. Test in both light and dark mode
8. Verify tablet layout looks correct

## Priority Components

Based on usage and visibility, we should prioritize these components:

1. Navigation elements (tabs, headers)
2. List items and cards (buildings, residents, payments)
3. Forms and input fields
4. Action buttons and FABs
5. Modals and dialogs

## Tracking Progress

We'll track progress by monitoring the output of the `md3-check` script:

```
npm run md3-check
```

The goal is to reduce the number of issues found by this script to zero.

## Resources

- [Material Design 3 Guidelines](https://m3.material.io/)
- [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)
- Local guide: `src/styles/MD3_IMPLEMENTATION_GUIDE.md` 