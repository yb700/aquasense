import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * LoadingSpinner Component Examples
 * 
 * Demonstrates various use cases of the LoadingSpinner component
 * with different sizes, colors, and labels.
 */

export const LoadingSpinnerExamples = () => {
  return (
    <div className="space-y-8 p-8 bg-background">
      <section>
        <h2 className="text-2xl font-bold mb-4">Size Variants</h2>
        <div className="flex items-end gap-8">
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-muted-foreground">Small (24px)</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner size="md" />
            <span className="text-sm text-muted-foreground">Medium (40px)</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner size="lg" />
            <span className="text-sm text-muted-foreground">Large (64px)</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">With Labels</h2>
        <div className="flex flex-wrap gap-8">
          <LoadingSpinner size="sm" label="Loading..." />
          <LoadingSpinner size="md" label="Please wait" />
          <LoadingSpinner size="lg" label="Processing data" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Color Variants</h2>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner color="#4DD0E1" label="Accent (default)" />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner color="#0A3D62" label="Primary" />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner color="#1B7FBD" label="Secondary" />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner color="#76E4C3" label="Highlight" />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner color="#D32F2F" label="Error" />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner color="#1ABC9C" label="Success" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Size Variants</h2>
        <div className="flex flex-wrap gap-8">
          <LoadingSpinner size="sm" />
          <LoadingSpinner size="md" />
          <LoadingSpinner size="lg" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">In Context: Button Loading States</h2>
        <div className="flex flex-wrap gap-4">
          <button
            disabled
            className="px-4 py-2 bg-primary text-white rounded flex items-center gap-2 opacity-75 cursor-not-allowed"
          >
            <LoadingSpinner size="sm" color="#FFFFFF" />
            <span>Loading...</span>
          </button>
          
          <button
            disabled
            className="px-6 py-3 bg-secondary text-white rounded flex items-center gap-2 opacity-75 cursor-not-allowed"
          >
            <LoadingSpinner size="sm" color="#FFFFFF" />
            <span>Processing Payment</span>
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">In Context: Card Loading States</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-white dark:bg-card rounded-md shadow-md">
            <div className="flex flex-col items-center justify-center py-8">
              <LoadingSpinner size="lg" label="Loading dashboard data..." />
            </div>
          </div>
          
          <div className="p-6 bg-white dark:bg-card rounded-md shadow-md">
            <div className="flex flex-col items-center justify-center py-8">
              <LoadingSpinner size="md" label="Fetching reports..." />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">In Context: Inline Loading</h2>
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-card rounded-md shadow flex items-center gap-3">
            <LoadingSpinner size="sm" />
            <span className="text-sm">Syncing data with server...</span>
          </div>
          
          <div className="p-4 bg-white dark:bg-card rounded-md shadow flex items-center gap-3">
            <LoadingSpinner size="sm" color="#1ABC9C" />
            <span className="text-sm">Upload in progress: 45%</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">In Context: Full Page Loading</h2>
        <div className="relative h-64 bg-white dark:bg-card rounded-md shadow-md">
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="lg" label="Loading page content..." />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Custom Styling</h2>
        <div className="flex flex-wrap gap-8">
          <LoadingSpinner
            size="md"
            label="Custom margin"
            className="m-4"
          />
          
          <LoadingSpinner
            size="md"
            label="With padding"
            className="p-4 bg-gray-100 dark:bg-gray-800 rounded"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Real-World Use Cases</h2>
        <div className="space-y-4">
          {/* Form submission */}
          <div className="p-4 bg-white dark:bg-card rounded-md shadow">
            <h3 className="font-semibold mb-2">Form Submission</h3>
            <button
              disabled
              className="px-4 py-2 bg-primary text-white rounded flex items-center gap-2 opacity-75"
            >
              <LoadingSpinner size="sm" color="#FFFFFF" />
              Submitting form...
            </button>
          </div>

          {/* Data fetch */}
          <div className="p-4 bg-white dark:bg-card rounded-md shadow">
            <h3 className="font-semibold mb-2">Fetching Data</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <LoadingSpinner size="sm" />
              Loading shift schedule...
            </div>
          </div>

          {/* File upload */}
          <div className="p-4 bg-white dark:bg-card rounded-md shadow">
            <h3 className="font-semibold mb-2">File Upload</h3>
            <div className="flex items-center gap-3">
              <LoadingSpinner size="sm" color="#1ABC9C" />
              <div className="flex-1">
                <p className="text-sm font-medium">Uploading image.jpg</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-highlight h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Page transition */}
          <div className="p-4 bg-white dark:bg-card rounded-md shadow">
            <h3 className="font-semibold mb-2">Page Transition</h3>
            <div className="h-32 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded">
              <LoadingSpinner size="lg" label="Loading dashboard..." />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoadingSpinnerExamples;
