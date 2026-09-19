"use client"

/**
 * AquaSense Input Component Demo
 * 
 * This file demonstrates all variants and features of the redesigned Input component.
 * Use this as a reference for implementing inputs throughout the application.
 */

import React from "react"
import { Input } from "./input"

export default function InputDemo() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          AquaSense Input Component
        </h1>
        <p className="text-muted-foreground">
          Water-inspired input component with focus states, error handling, and
          mobile-optimized touch targets (44px minimum height).
        </p>
      </div>

      {/* Default Variant */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Default Variant (Outline)
        </h2>

        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            helperText="We'll never share your email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+45 12 34 56 78"
            icon={<span>📞</span>}
            iconPosition="left"
          />
        </div>
      </section>

      {/* Filled Variant */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Filled Variant
        </h2>

        <div className="space-y-4">
          <Input
            variant="filled"
            label="Search"
            type="search"
            placeholder="Search pools..."
            icon={<span>🔍</span>}
            iconPosition="left"
          />

          <Input
            variant="filled"
            label="Username"
            placeholder="johndoe"
            icon={<span>👤</span>}
            iconPosition="left"
            helperText="Your unique identifier"
          />
        </div>
      </section>

      {/* Error State */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Error State
        </h2>

        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            defaultValue="invalid-email"
            error="Please enter a valid email address"
          />

          <Input
            variant="filled"
            label="Password"
            type="password"
            error="Password must be at least 8 characters"
          />

          <Input
            label="Required Field"
            error="This field is required"
            icon={<span>⚠️</span>}
            iconPosition="right"
          />
        </div>
      </section>

      {/* Disabled State */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Disabled State
        </h2>

        <div className="space-y-4">
          <Input
            label="Disabled Input"
            placeholder="Cannot edit"
            disabled
            defaultValue="Read-only value"
          />

          <Input
            variant="filled"
            label="Disabled Filled"
            placeholder="Cannot edit"
            disabled
            helperText="This field is locked"
          />
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Size Variants</h2>

        <div className="space-y-4">
          <Input
            inputSize="sm"
            label="Small Input (40px)"
            placeholder="Compact input"
          />

          <Input
            inputSize="default"
            label="Default Input (44px - Mobile Touch)"
            placeholder="Standard input"
          />

          <Input
            inputSize="lg"
            label="Large Input (52px)"
            placeholder="Prominent input"
          />
        </div>
      </section>

      {/* Icons */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          With Icons
        </h2>

        <div className="space-y-4">
          <Input
            label="Left Icon"
            placeholder="Search..."
            icon={<span className="text-lg">🔍</span>}
            iconPosition="left"
          />

          <Input
            label="Right Icon"
            placeholder="Password"
            type="password"
            icon={<span className="text-lg">🔒</span>}
            iconPosition="right"
          />

          <Input
            variant="filled"
            label="Location"
            placeholder="Enter address"
            icon={<span className="text-lg">📍</span>}
            iconPosition="left"
            helperText="We use this to find nearby pools"
          />
        </div>
      </section>

      {/* Complex Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Complex Examples
        </h2>

        <div className="space-y-4">
          <Input
            variant="filled"
            label="Pool Capacity"
            type="number"
            placeholder="Enter capacity"
            icon={<span className="text-lg">🏊</span>}
            iconPosition="left"
            helperText="Maximum number of swimmers allowed"
          />

          <Input
            label="Operating Hours"
            type="time"
            defaultValue="09:00"
            helperText="24-hour format"
          />

          <Input
            variant="filled"
            label="Maintenance Date"
            type="date"
            icon={<span className="text-lg">📅</span>}
            iconPosition="left"
          />
        </div>
      </section>

      {/* Focus State Demo */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Focus State (Interactive)
        </h2>
        <p className="text-sm text-muted-foreground">
          Click on any input to see the accent color border and subtle glow effect
        </p>

        <div className="space-y-4">
          <Input
            label="Default Focus State"
            placeholder="Click to focus"
            helperText="Notice the aqua accent border and subtle glow"
          />

          <Input
            variant="filled"
            label="Filled Focus State"
            placeholder="Click to focus"
            helperText="Background changes and accent border appears"
          />
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Accessibility Features
        </h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
          <li>Minimum 44px touch target height for mobile devices</li>
          <li>Labels properly associated with inputs using htmlFor</li>
          <li>Error messages announced to screen readers via aria-invalid and role="alert"</li>
          <li>Helper text linked via aria-describedby</li>
          <li>Keyboard navigable with visible focus indicators</li>
          <li>Disabled state properly communicated to assistive technologies</li>
          <li>WCAG 2.1 AA compliant color contrast ratios</li>
        </ul>
      </section>

      {/* Requirements */}
      <section className="space-y-4 border-t pt-8 mt-12">
        <h3 className="text-lg font-semibold text-foreground">
          Design System Compliance
        </h3>
        <p className="text-sm text-muted-foreground">
          This component fulfills the following requirements:
        </p>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>
            <strong>Requirement 15.1:</strong> Subtle borders and rounded corners
          </li>
          <li>
            <strong>Requirement 15.2:</strong> Focus state with color accent and glow
          </li>
          <li>
            <strong>Requirement 15.3:</strong> Error state with red accent and message
          </li>
          <li>
            <strong>Requirement 15.4:</strong> Floating labels and placeholder text
          </li>
          <li>
            <strong>Requirement 15.5:</strong> Minimum 44 pixels height for mobile
          </li>
        </ul>
      </section>
    </div>
  )
}
