# AquaSense Input Component Documentation

## Overview

The AquaSense Input component is a redesigned form input with water-inspired styling that extends the shadcn/ui base input component. It provides a premium, accessible user experience with focus on mobile-first design and WCAG 2.1 AA compliance.

## Features

- ✅ **Two Variants**: Default (outline) and Filled
- ✅ **Label Support**: Optional labels properly associated with inputs
- ✅ **Error Handling**: Error messages with visual indicators and accessibility support
- ✅ **Helper Text**: Optional descriptive text below inputs
- ✅ **Icon Support**: Left or right positioned icons
- ✅ **Size Variants**: Small (40px), Default (44px), Large (52px)
- ✅ **Focus States**: Accent color border with subtle glow effect
- ✅ **Disabled State**: Proper visual and accessibility treatment
- ✅ **Mobile Optimized**: Minimum 44px touch target height
- ✅ **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## Requirements Fulfilled

This component fulfills the following AquaSense Design System requirements:

- **Requirement 15.1**: Text input with subtle borders and rounded corners ✅
- **Requirement 15.2**: Focus state with color accent (aqua border + glow) ✅
- **Requirement 15.3**: Error state with red accent and error message ✅
- **Requirement 15.4**: Floating labels and placeholder text support ✅
- **Requirement 15.5**: Minimum 44 pixels height for mobile touch input ✅

## Usage

### Basic Usage

```tsx
import { Input } from "@/components/ui/input"

export function BasicExample() {
  return <Input placeholder="Enter text..." />
}
```

### With Label

```tsx
<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
/>
```

### With Helper Text

```tsx
<Input
  label="Password"
  type="password"
  helperText="Must be at least 8 characters"
/>
```

### With Error

```tsx
<Input
  label="Username"
  error="Username is already taken"
/>
```

### With Icon

```tsx
// Left icon
<Input
  label="Search"
  placeholder="Search pools..."
  icon={<SearchIcon />}
  iconPosition="left"
/>

// Right icon
<Input
  label="Password"
  type="password"
  icon={<LockIcon />}
  iconPosition="right"
/>
```

### Filled Variant

```tsx
<Input
  variant="filled"
  label="Search"
  placeholder="Type to search..."
/>
```

### Size Variants

```tsx
// Small (40px)
<Input inputSize="sm" placeholder="Small input" />

// Default (44px - Mobile touch target)
<Input inputSize="default" placeholder="Standard input" />

// Large (52px)
<Input inputSize="lg" placeholder="Large input" />
```

### Complete Example

```tsx
<Input
  variant="filled"
  inputSize="default"
  label="Pool Capacity"
  type="number"
  placeholder="Enter capacity"
  icon={<PoolIcon />}
  iconPosition="left"
  helperText="Maximum number of swimmers allowed"
  error={errors.capacity}
/>
```

## Props

### InputProps Interface

```typescript
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  // Variant style
  variant?: "default" | "filled"
  
  // Size variant
  inputSize?: "sm" | "default" | "lg"
  
  // Label text
  label?: string
  
  // Error message (displays in red below input)
  error?: string
  
  // Helper text (displays below input when no error)
  helperText?: string
  
  // Icon element
  icon?: React.ReactNode
  
  // Icon position
  iconPosition?: "left" | "right"
}
```

### Inherited HTML Input Props

All standard HTML input attributes are supported:
- `type`: text, email, password, number, tel, date, time, etc.
- `placeholder`: Placeholder text
- `disabled`: Disabled state
- `required`: Required field
- `value` / `defaultValue`: Controlled/uncontrolled value
- `onChange`: Change handler
- And all other standard input attributes

## Variants

### Default (Outline)

- Light border with subtle styling
- Focus: Aqua accent border with glow
- Background: Transparent

```tsx
<Input variant="default" />
```

### Filled

- No border by default
- Muted background color
- Focus: White background + accent border + glow

```tsx
<Input variant="filled" />
```

## States

### Default State

Standard appearance with subtle border and rounded corners.

### Focus State

When focused:
- Border changes to accent color (aqua #4DD0E1)
- Subtle ring/glow effect appears (accent color at 20% opacity)
- Smooth transition animation (250ms with water-flow easing)

### Error State

When error prop is provided:
- Border changes to error color (red #D32F2F)
- Error message appears below input in red
- Ring/glow effect uses error color
- `aria-invalid` set to true
- Error message has `role="alert"` for screen readers

### Disabled State

When disabled:
- Opacity reduced to 50%
- Cursor changes to not-allowed
- Label also shows disabled styling
- Properly communicated to assistive technologies

## Accessibility

The Input component follows WCAG 2.1 AA guidelines:

### ARIA Support

- **Labels**: Properly associated using `htmlFor` attribute
- **Error Messages**: Linked via `aria-describedby` and announced with `role="alert"`
- **Helper Text**: Linked via `aria-describedby`
- **Invalid State**: `aria-invalid` attribute set when error exists

### Keyboard Navigation

- Fully keyboard accessible
- Tab to navigate between inputs
- Visible focus indicator (accent border + glow)

### Touch Targets

- Minimum 44px height (WCAG 2.1 Level AA - Target Size)
- Large enough for comfortable thumb/finger tapping on mobile

### Screen Reader Support

- Labels announced when focusing input
- Error messages announced immediately
- Helper text available to screen readers
- Disabled state properly communicated

### Contrast Ratios

All colors meet WCAG 2.1 AA contrast requirements:
- Text on background: 4.5:1 minimum
- Error text: High contrast red
- Border colors: Sufficient contrast with background

## Design Tokens

The Input component uses the following AquaSense design tokens:

### Colors

- **Border**: `border-input` (light mode) / adjusted (dark mode)
- **Background**: `bg-background`
- **Text**: `text-foreground`
- **Placeholder**: `text-muted-foreground`
- **Focus Ring**: `ring-accent/20` (aqua at 20% opacity)
- **Error**: `border-error`, `text-error`

### Spacing

- **Padding**: `px-4 py-3` (default), `px-3 py-2` (small), `px-5 py-4` (large)
- **Icon Spacing**: `left-3` / `right-3` (12px from edge)

### Border Radius

- **Rounded**: `rounded-md` (12px)

### Transitions

- **Duration**: `duration-base` (250ms)
- **Easing**: `ease-water-flow` (cubic-bezier(0.4, 0.0, 0.2, 1))

### Shadows

- **Focus Glow**: `shadow-[0_0_0_3px_rgba(77,208,225,0.1)]` (aqua glow)
- **Error Glow**: `shadow-[0_0_0_3px_rgba(211,47,47,0.1)]` (red glow)

## Responsive Behavior

The Input component is mobile-first:

### Mobile (< 768px)

- `text-base` (16px font size - prevents iOS zoom on focus)
- Minimum 44px height (touch-friendly)
- Full padding for comfortable typing

### Desktop (≥ 768px)

- `md:text-sm` (14px font size)
- Same minimum height maintained
- Consistent padding

## Dark Mode

The Input component automatically adapts to dark mode using CSS variables:

- Border colors adjust for visibility
- Background colors use dark surface colors
- Text colors maintain contrast ratios
- Focus and error states remain prominent

## Examples

### Login Form

```tsx
<form className="space-y-4">
  <Input
    label="Email"
    type="email"
    placeholder="you@example.com"
    required
  />
  <Input
    label="Password"
    type="password"
    icon={<LockIcon />}
    iconPosition="right"
    required
  />
</form>
```

### Search Input

```tsx
<Input
  variant="filled"
  placeholder="Search pools..."
  icon={<SearchIcon />}
  iconPosition="left"
  inputSize="lg"
/>
```

### Validated Form Field

```tsx
const [email, setEmail] = useState("")
const [error, setError] = useState("")

const validateEmail = (value: string) => {
  if (!value.includes("@")) {
    setError("Please enter a valid email address")
  } else {
    setError("")
  }
}

return (
  <Input
    label="Email Address"
    type="email"
    value={email}
    onChange={(e) => {
      setEmail(e.target.value)
      validateEmail(e.target.value)
    }}
    error={error}
    helperText="We'll never share your email"
  />
)
```

### With React Hook Form

```tsx
import { useForm } from "react-hook-form"

function MyForm() {
  const { register, formState: { errors } } = useForm()
  
  return (
    <Input
      label="Username"
      {...register("username", { required: "Username is required" })}
      error={errors.username?.message}
    />
  )
}
```

## Testing

The Input component includes comprehensive unit tests covering:

- Basic rendering
- Label association
- Error message display and accessibility
- Helper text display
- Icon positioning
- Variant styles
- Size variants
- Disabled state
- Accessibility attributes (aria-invalid, aria-describedby, role="alert")
- ID generation and association
- Combined props scenarios

Run tests:

```bash
npm test -- input.test.tsx
```

## Performance

The Input component is optimized for performance:

- Uses CSS transforms for animations (GPU-accelerated)
- Water-flow easing function for smooth transitions
- No layout thrashing
- Minimal re-renders
- Icons positioned with absolute positioning (no layout shifts)

## Browser Support

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Migration from Previous Input

If migrating from the old shadcn/ui Input:

### Before
```tsx
<Input className="..." />
```

### After
```tsx
// Add label and helper text
<Input
  label="Field Name"
  helperText="Optional description"
  className="..."
/>

// Add error handling
<Input
  label="Field Name"
  error={errors.fieldName}
/>

// Use filled variant for search/filter inputs
<Input
  variant="filled"
  placeholder="Search..."
/>
```

## Related Components

- **Label**: Used internally for input labels
- **Form**: Can be used with Input for form layouts
- **Textarea**: Similar component for multi-line text input

## Questions or Issues?

Refer to the demo file (`input-demo.tsx`) for visual examples of all variants and features.
