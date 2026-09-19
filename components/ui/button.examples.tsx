/**
 * Button Component Examples
 * Visual reference for all button variants, sizes, and states
 * 
 * This file demonstrates the AquaSense Design System button implementation
 * with all the variants and states as specified in requirements 14.1-14.7
 */

import { Button } from './button'
import { Mail, Trash2, Save } from 'lucide-react'

export function ButtonExamples() {
  return (
    <div className="p-8 space-y-12 bg-background">
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Button</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Button Sizes</h2>
        <div className="flex flex-wrap items-end gap-4">
          <Button size="sm">Small (44px)</Button>
          <Button size="md">Medium (48px)</Button>
          <Button size="lg">Large (56px)</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Loading State</h2>
        <div className="flex flex-wrap gap-4">
          <Button loading variant="primary">
            Loading...
          </Button>
          <Button loading variant="secondary">
            Processing
          </Button>
          <Button loading variant="destructive">
            Deleting...
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Disabled State</h2>
        <div className="flex flex-wrap gap-4">
          <Button disabled variant="primary">
            Disabled Primary
          </Button>
          <Button disabled variant="secondary">
            Disabled Secondary
          </Button>
          <Button disabled variant="ghost">
            Disabled Ghost
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Buttons with Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button icon={<Mail className="h-4 w-4" />} variant="primary">
            Send Email
          </Button>
          <Button icon={<Save className="h-4 w-4" />} variant="secondary">
            Save Draft
          </Button>
          <Button icon={<Trash2 className="h-4 w-4" />} variant="destructive">
            Delete Item
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Combined States</h2>
        <div className="flex flex-wrap gap-4">
          <Button 
            size="sm" 
            variant="secondary" 
            icon={<Mail className="h-4 w-4" />}
          >
            Small with Icon
          </Button>
          <Button 
            size="lg" 
            variant="primary" 
            icon={<Save className="h-4 w-4" />}
          >
            Large with Icon
          </Button>
          <Button size="sm" loading>
            Small Loading
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Touch Target Verification</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button size="sm" className="border border-dashed border-accent">
              44px Minimum
            </Button>
            <span className="text-sm text-muted-foreground">
              Small buttons meet the 44x44px minimum touch target requirement (Req 14.5)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button size="md" className="border border-dashed border-accent">
              48px Default
            </Button>
            <span className="text-sm text-muted-foreground">
              Medium buttons provide comfortable 48px touch target (Req 14.5)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button size="lg" className="border border-dashed border-accent">
              56px Large
            </Button>
            <span className="text-sm text-muted-foreground">
              Large buttons offer prominent 56px touch target (Req 14.5)
            </span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">
          Requirements Coverage Summary
        </h2>
        <div className="bg-card rounded-lg p-6 space-y-3 text-sm">
          <p>✅ <strong>14.1:</strong> Primary button uses primary color with appropriate contrast</p>
          <p>✅ <strong>14.2:</strong> Secondary button uses outline/ghost styles</p>
          <p>✅ <strong>14.3:</strong> Hover states applied to all variants</p>
          <p>✅ <strong>14.4:</strong> Rounded corners (rounded-md) consistent with design language</p>
          <p>✅ <strong>14.5:</strong> Minimum 44x44px touch targets on mobile (sm: 44px, md: 48px, lg: 56px)</p>
          <p>✅ <strong>14.6:</strong> Loading states with animated spinner indicators</p>
          <p>✅ <strong>14.7:</strong> Disabled states with reduced opacity (opacity-50)</p>
        </div>
      </section>
    </div>
  )
}
