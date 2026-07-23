<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers\Controller;

use Illuminate\Support\Str;

class ShowMethodResolver extends ControllerMethodsResolver
{
    protected string $method = 'show';

    protected array $params = ['int|string $id'];


    protected function setRequest(array $relations): static
    {
        return $this;
    }
    protected function setResource(array $relations): self
    {
        $hasResource = ! empty($relations['resource']);
        $hasAction = ! empty($relations['actions']['show'] ?? null);
        $hasService = ! empty($relations['service']);

        if (! $hasAction && ! $hasService) {
            $this->body = '// @Todo';

            return $this;
        }

        if ($hasResource) {
            $resource = $relations['resource'];

            $sourceCall = $this->sourceCall($relations, 'show', true);
            $this->body = "return new {$resource}({$sourceCall});";
        }

        return $this;
    }

    protected function setTransform(array $relations, string $moduleName): self
    {
        $action = $relations['actions']['show'] ?? null;
        $service = $relations['service'] ?? null;
        $transformer = $relations['transformer'] ?? null;

        $hasTransformer = ! empty($relations['transformer']);
        $hasAction = ! empty($action);
        $hasService = ! empty($service);

        if ($hasTransformer && ($hasAction || $hasService)) {

            $pureName = Str::afterLast($moduleName, '/');
            $itemVar = lcfirst($pureName);

            if ($hasAction){
                $sourceCall = "\$action->handle(\$id)";
                $this->body = "\${$itemVar} = {$sourceCall};\nreturn {$transformer}::make(\${$itemVar}, 200);";
            }
            elseif ($hasService){
                $sourceCall = "\$service->{$this->method}(\$id)";
                $this->body = "\${$itemVar} = {$sourceCall};\nreturn {$transformer}::make(\${$itemVar}, 200);";
            }

        }

        return $this;
    }

    protected function setReturnType(array $relations): void
    {
        $hasResource = ! empty($relations['resource']);
        $hasTransformer = ! empty($relations['transformer']);

        if ($hasResource) {
            $this->returnType = $relations['resource'];
        } elseif ($hasTransformer) {
            $this->returnType = '\Strides\Module\Transformers\ModuleTransformer';
        }
    }
}
