import React from 'react';
import { CircularProgress } from './CircularProgress';

/**
 * CircularProgress Component Usage Examples
 * 
 * This file demonstrates how to use the CircularProgress component in different scenarios.
 */

export const CircularProgressExamples = () => {
  return (
    <div className="p-8 space-y-12 bg-gray-50">
      {/* Basic Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Basic Usage</h2>
        <p className="text-gray-600">Simple progress indicators with different values</p>
        
        <div className="flex flex-wrap gap-8 bg-white p-6 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={0} />
            <span className="text-sm text-gray-500">0% Complete</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={25} />
            <span className="text-sm text-gray-500">25% Complete</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={50} />
            <span className="text-sm text-gray-500">50% Complete</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={75} />
            <span className="text-sm text-gray-500">75% Complete</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={100} />
            <span className="text-sm text-gray-500">100% Complete</span>
          </div>
        </div>
      </section>

      {/* With Labels */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">With Labels</h2>
        <p className="text-gray-600">Progress indicators with descriptive labels</p>
        
        <div className="flex flex-wrap gap-8 bg-white p-6 rounded-lg">
          <CircularProgress value={45} label="Tasks" />
          <CircularProgress value={80} label="Complete" />
          <CircularProgress value={60} label="Progress" />
          <CircularProgress value={95} label="Upload" />
        </div>
      </section>

      {/* Different Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Size Variants</h2>
        <p className="text-gray-600">CircularProgress at different sizes</p>
        
        <div className="flex flex-wrap items-end gap-8 bg-white p-6 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={70} size={60} />
            <span className="text-sm text-gray-500">Small (60px)</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={70} size={80} />
            <span className="text-sm text-gray-500">Medium (80px)</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={70} size={120} />
            <span className="text-sm text-gray-500">Default (120px)</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={70} size={160} />
            <span className="text-sm text-gray-500">Large (160px)</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={70} size={200} />
            <span className="text-sm text-gray-500">X-Large (200px)</span>
          </div>
        </div>
      </section>

      {/* Different Stroke Widths */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Stroke Width Variants</h2>
        <p className="text-gray-600">Different ring thicknesses</p>
        
        <div className="flex flex-wrap gap-8 bg-white p-6 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={65} strokeWidth={4} />
            <span className="text-sm text-gray-500">Thin (4px)</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={65} strokeWidth={8} />
            <span className="text-sm text-gray-500">Default (8px)</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={65} strokeWidth={12} />
            <span className="text-sm text-gray-500">Thick (12px)</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={65} strokeWidth={16} />
            <span className="text-sm text-gray-500">Extra Thick (16px)</span>
          </div>
        </div>
      </section>

      {/* Custom Colors */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Custom Colors</h2>
        <p className="text-gray-600">Using different colors from the design system</p>
        
        <div className="flex flex-wrap gap-8 bg-white p-6 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={75} color="#4DD0E1" label="Accent" />
            <span className="text-sm text-gray-500">Aqua (default)</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={75} color="#1B7FBD" label="Primary" />
            <span className="text-sm text-gray-500">Pool Blue</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={75} color="#76E4C3" label="Success" />
            <span className="text-sm text-gray-500">Fresh Mint</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={75} color="#FFC107" label="Warning" />
            <span className="text-sm text-gray-500">Warning</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={75} color="#D32F2F" label="Error" />
            <span className="text-sm text-gray-500">Error Red</span>
          </div>
        </div>
      </section>

      {/* Dashboard Use Cases */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard Examples</h2>
        <p className="text-gray-600">Real-world usage in dashboard metrics</p>
        
        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Task Completion Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Tasks</h3>
            <div className="flex justify-center">
              <CircularProgress value={82} size={140} label="Complete" color="#76E4C3" />
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              18 of 22 tasks completed today
            </p>
          </div>

          {/* Shift Coverage Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shift Coverage</h3>
            <div className="flex justify-center">
              <CircularProgress value={95} size={140} label="Staffed" color="#1B7FBD" />
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              38 of 40 shifts covered this week
            </p>
          </div>

          {/* Maintenance Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance</h3>
            <div className="flex justify-center">
              <CircularProgress value={68} size={140} label="On Track" color="#4DD0E1" />
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              Monthly maintenance checklist
            </p>
          </div>
        </div>
      </section>

      {/* Mini Progress Indicators */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Mini Progress Indicators</h2>
        <p className="text-gray-600">Compact sizes for inline usage</p>
        
        <div className="bg-white p-6 rounded-lg space-y-4">
          <div className="flex items-center gap-4">
            <CircularProgress value={90} size={40} strokeWidth={4} />
            <div>
              <div className="font-medium text-gray-900">Water Quality Check</div>
              <div className="text-sm text-gray-500">pH, chlorine, and temperature</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <CircularProgress value={65} size={40} strokeWidth={4} color="#76E4C3" />
            <div>
              <div className="font-medium text-gray-900">Pool Cleaning</div>
              <div className="text-sm text-gray-500">Daily cleaning checklist</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <CircularProgress value={45} size={40} strokeWidth={4} color="#FFC107" />
            <div>
              <div className="font-medium text-gray-900">Staff Training</div>
              <div className="text-sm text-gray-500">Q2 training completion</div>
            </div>
          </div>
        </div>
      </section>

      {/* On Dark Background */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">On Dark Background</h2>
        <p className="text-gray-600">Progress indicators on dark surfaces</p>
        
        <div className="bg-gray-900 p-8 rounded-lg">
          <div className="flex flex-wrap gap-8 justify-center">
            <CircularProgress value={55} label="Tasks" />
            <CircularProgress value={85} label="Coverage" color="#76E4C3" />
            <CircularProgress value={70} label="Quality" color="#1B7FBD" />
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Code Examples</h2>
        
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm space-y-4">
          <div>
            <div className="text-gray-400 mb-1">// Basic usage</div>
            <div className="text-green-400">&lt;CircularProgress value={'{75}'} /&gt;</div>
          </div>
          
          <div>
            <div className="text-gray-400 mb-1">// With label</div>
            <div className="text-green-400">&lt;CircularProgress value={'{82}'} label=&quot;Complete&quot; /&gt;</div>
          </div>
          
          <div>
            <div className="text-gray-400 mb-1">// Custom size and color</div>
            <div className="text-green-400">&lt;CircularProgress value={'{65}'} size={'{160}'} color=&quot;#76E4C3&quot; /&gt;</div>
          </div>
          
          <div>
            <div className="text-gray-400 mb-1">// With thick stroke</div>
            <div className="text-green-400">&lt;CircularProgress value={'{90}'} strokeWidth={'{12}'} /&gt;</div>
          </div>
          
          <div>
            <div className="text-gray-400 mb-1">// Complete example</div>
            <div className="text-green-400">
              &lt;CircularProgress<br />
              {'  '}value={'{80}'}<br />
              {'  '}size={'{140}'}<br />
              {'  '}strokeWidth={'{10}'}<br />
              {'  '}label=&quot;Progress&quot;<br />
              {'  '}color=&quot;#1B7FBD&quot;<br />
              {'  '}className=&quot;custom-class&quot;<br />
              /&gt;
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CircularProgressExamples;
