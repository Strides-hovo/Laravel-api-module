import React, { useState } from 'react';
import { PageId } from '../../types';
import { CodeBlock } from '../CodeBlock';

interface TransformerPageProps {
  onNavigate: (pageId: PageId) => void;
  onOpenCli?: () => void;
}

export const TransformerPage: React.FC<TransformerPageProps> = ({ onNavigate, onOpenCli }) => {
  const [activeTab, setActiveTab] = useState<'transformer' | 'controller' | 'request' | 'json'>('transformer');
  
  // Interactive Includes Playground state
  const [includeItems, setIncludeItems] = useState(true);
  const [includeUser, setIncludeUser] = useState(true);
  const [includeCategory, setIncludeCategory] = useState(false);

  const selectedIncludes = [
    includeItems ? 'items' : null,
    includeUser ? 'user' : null,
    includeCategory ? 'category' : null,
  ].filter(Boolean);

  const queryString = selectedIncludes.length > 0 ? `?include=${selectedIncludes.join(',')}` : '';

  const transformerCode = `<?php

declare(strict_types=1);

namespace Modules\\Order\\Http\\Transformers;

use Illuminate\\Database\\Eloquent\\Model;
use Strides\\Module\\Transformers\\ModuleTransformer;

class OrderTransformer extends ModuleTransformer
{
    /**
     * List of relationship names that can be included via URL query parameter.
     * Example request: GET /api/orders/101?include=items,user
     */
    protected array $availableIncludes = [
        'items',
        'user',
        'category',
    ];

    /**
     * Transform the given Eloquent Model or data object into a clean array.
     *
     * @param  Model|mixed  $model
     */
    public function transformModel($model): array
    {
        return [
            'id'           => (int) $model->id,
            'order_number' => (string) $model->order_number,
            'total_amount' => (float) $model->total_amount,
            'status_label' => ucfirst($model->status ?? 'pending'),
            'created_at'   => $model->created_at?->toIso8601String(),
            'updated_at'   => $model->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Optional custom relationship transformer for 'items'.
     */
    public function includeItems($model): array
    {
        return $model->items->map(fn ($item) => [
            'id'         => (int) $item->id,
            'product'    => $item->product_name,
            'quantity'   => (int) $item->quantity,
            'unit_price' => (float) $item->unit_price,
        ])->toArray();
    }

    /**
     * Optional custom relationship transformer for 'user'.
     */
    public function includeUser($model): array
    {
        return [
            'id'    => (int) $model->user->id,
            'name'  => $model->user->name,
            'email' => $model->user->email,
        ];
    }
}`;

  const controllerCode = `<?php

declare(strict_types=1);

namespace Modules\\Order\\Http\\Controllers;

use Illuminate\\Routing\\Controller;
use Modules\\Order\\Actions\\OrderIndexAction;
use Modules\\Order\\Actions\\OrderShowAction;
use Modules\\Order\\Http\\Transformers\\OrderTransformer;
use Strides\\Module\\Transformers\\ModuleTransformer;
use Strides\\Module\\Transformers\\TransformerCollection;

class OrderController extends Controller
{
    /**
     * Display a collection of orders with automatic include query parsing.
     *
     * Response envelope: { "data": [...], "status": true }
     */
    public function index(OrderIndexAction $action): TransformerCollection
    {
        $orders = $action->handle();

        return OrderTransformer::collection($orders, 200);
    }

    /**
     * Display a single order by ID.
     * Automatically inspects ?include=items,user parameters.
     *
     * Response envelope: { "data": {...}, "status": true }
     */
    public function show(int|string $id, OrderShowAction $action): ModuleTransformer
    {
        $order = $action->handle($id);

        return OrderTransformer::make($order, 200);
    }
}`;

  const requestCode = `### 1. Single Order Request without includes
GET http://your-app.test/api/orders/101
Accept: application/json


### 2. Single Order Request WITH relationship includes (items & user)
GET http://your-app.test/api/orders/101?include=items,user
Accept: application/json


### 3. Order Collection Request WITH includes
GET http://your-app.test/api/orders?include=items,category
Accept: application/json`;

  const generateLiveJsonResponse = () => {
    const dataObj: Record<string, any> = {
      id: 101,
      order_number: 'ORD-2026-9842',
      total_amount: 149.99,
      status_label: 'Processing',
      created_at: '2026-07-24T12:00:00+00:00',
      updated_at: '2026-07-24T12:15:00+00:00',
    };

    if (includeItems) {
      dataObj.items = [
        { id: 1, product: 'Wireless Mechanical Keyboard', quantity: 1, unit_price: 99.99 },
        { id: 2, product: 'Ergonomic Gaming Mouse', quantity: 1, unit_price: 50.00 },
      ];
    }

    if (includeUser) {
      dataObj.user = {
        id: 42,
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
      };
    }

    if (includeCategory) {
      dataObj.category = {
        id: 8,
        slug: 'hardware-accessories',
        title: 'Hardware & Accessories',
      };
    }

    return JSON.stringify(
      {
        data: dataObj,
        status: true,
      },
      null,
      2
    );
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#7bd0ff] font-code text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">transform</span>
          <span>CORE CONCEPTS • DATA TRANSFORMATION LAYER</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#f8fafc] tracking-tight">
              Module Transformer
            </h1>
            <p className="text-[#94a3b8] text-base md:text-lg max-w-3xl mt-2 leading-relaxed">
              Extends standard Laravel JSON Resources to wrap API responses into a unified{' '}
              <code className="text-[#ffb690] bg-[#1e293b] px-1.5 py-0.5 rounded font-code text-xs">
                {`{ "data": ..., "status": ... }`}
              </code>{' '}
              payload structure, while functioning as an intelligent query builder for dynamic relationship includes (`?include=...`).
            </p>
          </div>


        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#131b2e] border border-[#334155] rounded-xl p-5 space-y-2 hover:border-[#ffb690]/50 transition-colors shadow-lg">
          <div className="w-10 h-10 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] flex items-center gap-2 justify-center border border-[#38bdf8]/20">
            <span className="material-symbols-outlined text-[22px]">data_object</span>
          </div>
          <h3 className="text-base font-bold text-[#f8fafc]">Standardized Response Envelope</h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Every transformer encapsulates transformed attributes and nested collections into a top-level{' '}
            <code className="text-[#7bd0ff]">data</code> key alongside a <code className="text-[#10b981]">status</code> indicator.
          </p>
        </div>

        <div className="bg-[#131b2e] border border-[#334155] rounded-xl p-5 space-y-2 hover:border-[#ffb690]/50 transition-colors shadow-lg">
          <div className="w-10 h-10 rounded-lg bg-[#a78bfa]/10 text-[#a78bfa] flex items-center justify-center border border-[#a78bfa]/20">
            <span className="material-symbols-outlined text-[22px]">hub</span>
          </div>
          <h3 className="text-base font-bold text-[#f8fafc]">Smart Query Builder Includes</h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Automatically parses request query parameters like <code className="text-[#ffb690]">?include=items,user</code>, dynamically eager-loading and embedding relations without extra code.
          </p>
        </div>

        <div className="bg-[#131b2e] border border-[#334155] rounded-xl p-5 space-y-2 hover:border-[#ffb690]/50 transition-colors shadow-lg md:col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 text-[#10b981] flex items-center justify-center border border-[#10b981]/20">
            <span className="material-symbols-outlined text-[22px]">speed</span>
          </div>
          <h3 className="text-base font-bold text-[#f8fafc]">Zero N+1 Query Overhead</h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Integrates with Eloquent repositories to lazy-load or eager-load requested relation models conditionally when requested in the URL.
          </p>
        </div>
      </section>

      {/* Code & Interactive Tabbed View */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#334155] pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'transformer', label: 'OrderTransformer.php', icon: 'code' },
              { id: 'controller', label: 'OrderController.php', icon: 'route' },
              { id: 'request', label: 'HTTP Requests & Includes', icon: 'http' },
              { id: 'json', label: 'Live JSON Response', icon: 'preview' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#ffb690] text-[#552100] shadow-md'
                    : 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155] hover:text-[#f8fafc]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Tab Content Display */}
        {activeTab === 'transformer' && (
          <div className="space-y-3">
            <p className="text-xs text-[#94a3b8]">
              Define your model transformation and declare available relationship include keys inside the{' '}
              <code className="text-[#ffb690]">$availableIncludes</code> array:
            </p>
            <CodeBlock title="Modules/Order/Http/Transformers/OrderTransformer.php" code={transformerCode} showLineNumbers />
          </div>
        )}

        {activeTab === 'controller' && (
          <div className="space-y-3">
            <p className="text-xs text-[#94a3b8]">
              Return <code className="text-[#7bd0ff]">ModuleTransformer</code> or{' '}
              <code className="text-[#7bd0ff]">TransformerCollection</code> directly from controller methods using static factory functions:
            </p>
            <CodeBlock title="Modules/Order/Http/Controllers/OrderController.php" code={controllerCode} showLineNumbers />
          </div>
        )}

        {activeTab === 'request' && (
          <div className="space-y-3">
            <p className="text-xs text-[#94a3b8]">
              Clients can trigger relation inclusions dynamically by passing comma-separated relation names in the URL:
            </p>
            <CodeBlock title="Modules/Order/Http.http" code={requestCode} showLineNumbers />
          </div>
        )}

        {activeTab === 'json' && (
          <div className="space-y-4 bg-[#131b2e] border border-[#334155] p-5 rounded-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#0b0f19] p-3 rounded-lg border border-[#334155]">
              <span className="text-xs font-bold text-[#f8fafc]">
                Live URL Query String Simulator:
              </span>
              <code className="text-xs font-code bg-[#1e293b] text-[#7bd0ff] px-2.5 py-1 rounded border border-[#334155]">
                GET /api/orders/101{queryString}
              </code>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              <span className="text-[#94a3b8] font-bold">Toggle Query Includes:</span>
              <label className="flex items-center gap-2 text-[#f8fafc] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeItems}
                  onChange={(e) => setIncludeItems(e.target.checked)}
                  className="rounded border-[#334155] bg-[#0b0f19] text-[#ffb690] focus:ring-[#ffb690]"
                />
                <span>items</span>
              </label>

              <label className="flex items-center gap-2 text-[#f8fafc] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUser}
                  onChange={(e) => setIncludeUser(e.target.checked)}
                  className="rounded border-[#334155] bg-[#0b0f19] text-[#ffb690] focus:ring-[#ffb690]"
                />
                <span>user</span>
              </label>

              <label className="flex items-center gap-2 text-[#f8fafc] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCategory}
                  onChange={(e) => setIncludeCategory(e.target.checked)}
                  className="rounded border-[#334155] bg-[#0b0f19] text-[#ffb690] focus:ring-[#ffb690]"
                />
                <span>category</span>
              </label>
            </div>

            <CodeBlock title="Simulated JSON Output Response" code={generateLiveJsonResponse()} showLineNumbers />
          </div>
        )}
      </section>

      {/* Interactive Includes Tester Section */}
      <section className="bg-[#131b2e] border border-[#334155] rounded-xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-[#334155] pb-4">
          <div className="w-9 h-9 rounded-lg bg-[#ffb690]/10 text-[#ffb690] flex items-center justify-center border border-[#ffb690]/20">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#f8fafc]">How the Include & Query Engine Operates</h2>
            <p className="text-xs text-[#94a3b8]">
              Detailed breakdown of response payload construction and eager loading execution
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#cbd5e1] leading-relaxed">
          <div className="space-y-3 bg-[#0b0f19] p-4 rounded-lg border border-[#334155]">
            <h3 className="text-sm font-bold text-[#ffb690] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              1. Enforced Response Envelope
            </h3>
            <p>
              Unlike raw Eloquent models or simple array returns, <code className="text-[#7bd0ff]">ModuleTransformer</code> guarantees that every single resource response and collection follows an explicit API spec:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#94a3b8]">
              <li><strong className="text-[#f8fafc]">data</strong>: Contains object or collection payload transformed through <code className="text-[#ffb690]">transformModel()</code>.</li>
              <li><strong className="text-[#f8fafc]">status</strong>: Standardized boolean indicator or custom status code provided during instantiation.</li>
            </ul>
          </div>

          <div className="space-y-3 bg-[#0b0f19] p-4 rounded-lg border border-[#334155]">
            <h3 className="text-sm font-bold text-[#38bdf8] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">search</span>
              2. Query Includes & Transformer Callbacks
            </h3>
            <p>
              When a client passes <code className="text-[#ffb690]">?include=items,user</code>:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#94a3b8]">
              <li>The engine checks if the key exists inside <code className="text-[#7bd0ff]">$availableIncludes</code>.</li>
              <li>If a custom method like <code className="text-[#7bd0ff]">includeItems($model)</code> is defined, it executes the method.</li>
              <li>If no method is defined, it automatically serializes the Eloquent relation directly.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Helper Methods Reference Table */}
      <section className="bg-[#131b2e] border border-[#334155] rounded-xl p-6 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-[#f8fafc]">Static Factory Methods
          <span className="text-[11px] font-code text-[#94a3b8] hidden md:inline-block ml-5">
            Namespace: <code className="text-[#7bd0ff]">Strides\Module\Transformers</code>
          </span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#334155] text-[#94a3b8] font-code">
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Parameters</th>
                <th className="py-2.5 px-3">Return Type</th>
                <th className="py-2.5 px-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/60 text-[#cbd5e1] font-code">
              <tr>
                <td className="py-3 px-3 text-[#ffb690] font-bold">Transformer::make()</td>
                <td className="py-3 px-3 text-[#7bd0ff]">$model, $status = 200</td>
                <td className="py-3 px-3 text-[#a78bfa]">ModuleTransformer</td>
                <td className="py-3 px-3 text-[#94a3b8] font-sans">
                  Transforms a single Eloquent model or array object into a resource payload envelope.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#ffb690] font-bold">Transformer::collection()</td>
                <td className="py-3 px-3 text-[#7bd0ff]">$items, $status = 200</td>
                <td className="py-3 px-3 text-[#a78bfa]">TransformerCollection</td>
                <td className="py-3 px-3 text-[#94a3b8] font-sans">
                  Transforms an array or Eloquent collection into an array of resources inside <code className="text-[#7bd0ff]">data</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-[#334155] flex justify-between items-center">
        <button
          onClick={() => onNavigate('create-module')}
          className="flex items-center gap-2 text-xs font-bold text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Create Module</span>
        </button>

        <button
          onClick={() => onNavigate('migrations')}
          className="flex items-center gap-2 text-xs font-bold text-[#ffb690] hover:text-[#ffa26b] transition-colors"
        >
          <span>Migrations</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
