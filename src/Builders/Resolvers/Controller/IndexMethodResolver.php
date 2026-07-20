<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers\Controller;

use Illuminate\Support\Str;

/**
 * Resolves parameters, business execution bodies, and collection signatures for the 'index' controller method.
 */
class IndexMethodResolver extends ControllerMethodsResolver
{
    protected string $method = 'index';

    /**
     * Map database records collections using default API resources.
     *
     * @param array<string, mixed> $relations
     * @return self
     */
    protected function setResource(array $relations): self
    {
        $hasResource = !empty($relations['resource']);
        $hasAction = !empty($relations['actions']['index'] ?? null);
        $hasService = !empty($relations['service']);

        if (!$hasAction && !$hasService) {
            return $this;
        }

        if ($hasResource) {
            $resource = $relations['resource'];
            $sourceCall = $this->sourceCall($relations, 'filter');
            $this->body = "return {$resource}::collection({$sourceCall});";
        }

        return $this;
    }

    /**
     * Compile response formatting using customized collection transformers.
     *
     * @param array<string, mixed> $relations
     * @param string $moduleName
     * @return self
     */
    protected function setTransform(array $relations, string $moduleName): self
    {
        $hasTransformer = !empty($relations['transformer']);
        $hasAction = !empty($relations['actions']['index'] ?? null);
        $hasService = !empty($relations['service']);

        if ($hasTransformer && ($hasAction || $hasService)) {
            $transformer = $relations['transformer'];
            $pureName = Str::afterLast($moduleName, '/');
            $itemVar = Str::plural(lcfirst($pureName));

            $sourceCall = $this->sourceCall($relations, 'filter');
            $this->body = "\${$itemVar} = {$sourceCall};\nreturn {$transformer}::collection(\${$itemVar}, 200);";
        }

        return $this;
    }

    /**
     * Define target collection return types (Resources vs Transformers).
     *
     * @param array<string, mixed> $relations
     * @return void
     */
    protected function setReturnType(array $relations): void
    {
        $hasResource = !empty($relations['resource']);
        $hasTransformer = !empty($relations['transformer']);

        if ($hasResource) {
            $this->returnType = '\Illuminate\Http\Resources\Json\AnonymousResourceCollection';
        } elseif ($hasTransformer) {
            $this->returnType = '\Strides\Module\Transformers\TransformerCollection';
        }
    }
}
