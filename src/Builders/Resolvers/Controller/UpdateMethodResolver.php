<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers\Controller;

use Illuminate\Support\Str;

class UpdateMethodResolver extends ControllerMethodsResolver
{
    protected string $method = 'update';
    protected array $params = ['int|string $id'];

    protected function setResource(array $relations): self
    {
        $hasResource = !empty($relations['resource']);
        $hasAction = !empty($relations['actions']['update'] ?? null);
        $hasService = !empty($relations['service']);

        if (!$hasAction && !$hasService) {
            $this->body = '// @Todo';

            return $this;
        }

        if ($hasResource) {
            $resource = $relations['resource'];

            $sourceCall = $this->sourceCall($relations, 'update', true);
            $this->body = "return new {$resource}({$sourceCall});";
        }

        return $this;
    }

    protected function setTransform(array $relations, string $moduleName): self
    {
        $hasTransformer = !empty($relations['transformer']);
        $hasAction = !empty($relations['actions']['update'] ?? null);
        $hasService = !empty($relations['service']);

        if ($hasTransformer && ($hasAction || $hasService)) {
            $transformer = $relations['transformer'];
            $pureName = Str::afterLast($moduleName, '/');
            $itemVar = lcfirst($pureName);

            $sourceCall = $this->sourceCall($relations, 'update', true);
            $this->body = "\${$itemVar} = {$sourceCall};\nreturn {$transformer}::make(\${$itemVar}, 200);";
        }

        return $this;
    }

    protected function setReturnType(array $relations): void
    {
        $hasResource = !empty($relations['resource']);
        $hasTransformer = !empty($relations['transformer']);

        if ($hasResource) {
            $this->returnType = $relations['resource'];
        } elseif ($hasTransformer) {
            $this->returnType = '\Strides\Module\Transformers\ModuleTransformer';
        }
    }
}
