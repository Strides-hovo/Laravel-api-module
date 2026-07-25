/**
 * PHP/Laravel code-generation templates used by the "Create Module" playground.
 * Pure string templating — not related to MockAPI data at all, kept separate
 * from the documentation dataset on purpose.
 */

export function generateModuleFiles(moduleName: string) {
  const cleanName = moduleName.trim().replace(/[^a-zA-Z0-9]/g, '') || 'Order';
  const camelName = cleanName.charAt(0).toLowerCase() + cleanName.slice(1);
  const snakePlural = cleanName.toLowerCase() + 's';

  return [
    {
      path: `Modules/${cleanName}/Entities/${cleanName}.php`,
      type: 'model' as const,
      content: `<?php

declare(strict_types=1);

namespace Modules\\${cleanName}\\Entities;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class ${cleanName} extends Model
{
    use HasFactory;

    protected $fillable = [];
}`,
    },
    {
      path: `Modules/${cleanName}/Http/Controllers/${cleanName}Controller.php`,
      type: 'controller' as const,
      content: `<?php

declare(strict_types=1);

namespace Modules\\${cleanName}\\Http\\Controllers;

use Illuminate\\Http\\JsonResponse;
use Illuminate\\Routing\\Controller;
use Modules\\${cleanName}\\Actions\\${cleanName}DestroyAction;
use Modules\\${cleanName}\\Actions\\${cleanName}IndexAction;
use Modules\\${cleanName}\\Actions\\${cleanName}ShowAction;
use Modules\\${cleanName}\\Actions\\${cleanName}StoreAction;
use Modules\\${cleanName}\\Actions\\${cleanName}UpdateAction;
use Modules\\${cleanName}\\Http\\Requests\\${cleanName}Request;
use Modules\\${cleanName}\\Http\\Transformers\\${cleanName}Transformer;
use Strides\\Module\\Transformers\\ModuleTransformer;
use Strides\\Module\\Transformers\\TransformerCollection;

class ${cleanName}Controller extends Controller
{
    public function index(${cleanName}Request $request, ${cleanName}IndexAction $action): TransformerCollection
    {
        $${snakePlural} = $action->handle($request->validated());

        return ${cleanName}Transformer::collection($${snakePlural}, 200);
    }

    public function store(${cleanName}Request $request, ${cleanName}StoreAction $action): ModuleTransformer
    {
        $${camelName} = $action->handle($request->validated());

        return ${cleanName}Transformer::make($${camelName}, 201);
    }

    public function show(int|string $id, ${cleanName}ShowAction $action): ModuleTransformer
    {
        $${camelName} = $action->handle($id);

        return ${cleanName}Transformer::make($${camelName}, 200);
    }

    public function update(int|string $id, ${cleanName}Request $request, ${cleanName}UpdateAction $action): ModuleTransformer
    {
        $${camelName} = $action->handle($id, $request->validated());

        return ${cleanName}Transformer::make($${camelName}, 200);
    }

    public function destroy(int|string $id, ${cleanName}DestroyAction $action): JsonResponse
    {
        $action->handle($id);

        return response()->json(null, 204);
    }
}`,
    },
    {
      path: `Modules/${cleanName}/Http/Transformers/${cleanName}Transformer.php`,
      type: 'transformer' as const,
      content: `<?php

declare(strict_types=1);

namespace Modules\\${cleanName}\\Http\\Transformers;

use Illuminate\\Database\\Eloquent\\Model;
use Strides\\Module\\Transformers\\ModuleTransformer;

class ${cleanName}Transformer extends ModuleTransformer
{
    protected array $availableIncludes = [];

    /**
     * @param  Model|mixed  $model
     */
    public function transformModel($model): array
    {
        return [

        ];
    }
}`,
    },
    {
      path: `Modules/${cleanName}/Repositories/${cleanName}Repository.php`,
      type: 'repository' as const,
      content: `<?php

declare(strict_types=1);

namespace Modules\\${cleanName}\\Repositories;

use Illuminate\\Database\\Eloquent\\Collection;
use Modules\\${cleanName}\\Entities\\${cleanName};

class ${cleanName}Repository
{
    public function filter(array $data = []): Collection
    {
        return ${cleanName}::where($data)->get();
    }

    public function all(): Collection
    {
        return ${cleanName}::all();
    }

    public function find(int|string $id): ${cleanName}
    {
        return ${cleanName}::find($id);
    }

    public function create(array $data): ${cleanName}
    {
        return ${cleanName}::create($data);
    }

    public function update(int|string $id, array $data): ${cleanName}
    {
        $model = ${cleanName}::find($id);
        $model->update($data);

        return $model;
    }

    public function delete(int|string $id): bool
    {
        $model = ${cleanName}::find($id);

        return $model->delete();
    }
}`,
    },
    {
      path: `Modules/${cleanName}/Http.http`,
      type: 'http' as const,
      content: `### GET request with a header
GET http://module.test/api/${snakePlural}
Accept: application/json


### Send POST request with json body
POST http://module.test/api/${snakePlural}
Content-Type: application/json

{
  "id": 999,
  "value": "content"
}


### GET request with a header
GET http://module.test/api/${snakePlural}/1
Accept: application/json


### Send PUT request with json body
PUT http://module.test/api/${snakePlural}/1
Content-Type: application/json

{
  "id": 999,
  "value": "content"
}


### Send DELETE request with json body
DELETE http://module.test/api/${snakePlural}/1
Content-Type: application/json`,
    },
  ];
}
