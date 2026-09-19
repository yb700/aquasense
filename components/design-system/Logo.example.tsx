import React from 'react';
import { Logo } from './Logo';

/**
 * Logo Component Usage Examples
 * 
 * This file demonstrates how to use the Logo component in different scenarios.
 */

export const LogoExamples = () => {
  return (
    <div className="p-8 space-y-12 bg-gray-50">
      {/* Full Logo Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Full Logo Variant</h2>
        <p className="text-gray-600">Complete logo with icon and wordmark</p>
        
        <div className="space-y-4 bg-white p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 w-20">Default:</span>
            <Logo variant="full" />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 w-20">Small:</span>
            <Logo variant="full" size={150} />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 w-20">Large:</span>
            <Logo variant="full" size={300} />
          </div>
        </div>
      </section>

      {/* Icon Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Icon Variant</h2>
        <p className="text-gray-600">Symbol only - perfect for favicons, app icons, or compact spaces</p>
        
        <div className="space-y-4 bg-white p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 w-20">16px:</span>
            <Logo variant="icon" size={16} />
            <span className="text-xs text-gray-400">(minimum recommended size)</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 w-20">32px:</span>
            <Logo variant="icon" size={32} />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 w-20">Default:</span>
            <Logo variant="icon" />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 w-20">64px:</span>
            <Logo variant="icon" size={64} />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 w-20">128px:</span>
            <Logo variant="icon" size={128} />
          </div>
        </div>
      </section>

      {/* Wordmark Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Wordmark Variant</h2>
        <p className="text-gray-600">Text branding with wave decoration</p>
        
        <div className="space-y-4 bg-white p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 w-20">Small:</span>
            <Logo variant="wordmark" size={100} />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 w-20">Default:</span>
            <Logo variant="wordmark" />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 w-20">Large:</span>
            <Logo variant="wordmark" size={200} />
          </div>
        </div>
      </section>

      {/* With Custom Classes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Custom Styling</h2>
        <p className="text-gray-600">Logos with custom CSS classes</p>
        
        <div className="space-y-4 bg-white p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 w-20">Opacity:</span>
            <Logo variant="full" className="opacity-50" />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 w-20">Hover:</span>
            <Logo variant="icon" size={48} className="hover:scale-110 transition-transform duration-300 cursor-pointer" />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 w-20">Drop Shadow:</span>
            <Logo variant="icon" size={64} className="drop-shadow-lg" />
          </div>
        </div>
      </section>

      {/* Usage in Navigation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Navigation Examples</h2>
        <p className="text-gray-600">Common use cases in navigation</p>
        
        {/* Desktop Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Logo variant="full" size={160} />
            <nav className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Dashboard</a>
              <a href="#" className="hover:text-gray-900">Shifts</a>
              <a href="#" className="hover:text-gray-900">Incidents</a>
            </nav>
          </div>
        </div>
        
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <Logo variant="icon" size={32} />
            <button className="p-2 text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Dark Background */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">On Dark Background</h2>
        <p className="text-gray-600">Logo variants on dark surfaces</p>
        
        <div className="bg-gray-900 p-8 rounded-lg space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 w-20">Full:</span>
            <Logo variant="full" size={180} />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 w-20">Icon:</span>
            <Logo variant="icon" size={48} />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 w-20">Wordmark:</span>
            <Logo variant="wordmark" size={120} />
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Code Examples</h2>
        
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm space-y-4">
          <div>
            <div className="text-gray-400 mb-1">// Default full logo</div>
            <div className="text-green-400">&lt;Logo /&gt;</div>
          </div>
          
          <div>
            <div className="text-gray-400 mb-1">// Icon variant at 32px</div>
            <div className="text-green-400">&lt;Logo variant=&quot;icon&quot; size={'{32}'} /&gt;</div>
          </div>
          
          <div>
            <div className="text-gray-400 mb-1">// Wordmark with custom styling</div>
            <div className="text-green-400">&lt;Logo variant=&quot;wordmark&quot; size={'{120}'} className=&quot;hover:opacity-80&quot; /&gt;</div>
          </div>
          
          <div>
            <div className="text-gray-400 mb-1">// Full logo scaled to 250px width</div>
            <div className="text-green-400">&lt;Logo variant=&quot;full&quot; size={'{250}'} /&gt;</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LogoExamples;
