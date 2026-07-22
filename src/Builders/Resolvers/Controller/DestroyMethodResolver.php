<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers\Controller;

/**
 * Resolves the logic, parameters, and return signatures specific to the 'destroy' controller method stub.
 */
class DestroyMethodResolver extends ControllerMethodsResolver
{
    protected string $method = 'destroy';

    /**
     * @var array<int, string>
     */
    protected array $params = ['int|string $id'];

    /**
     * Skip request parameters configuration since 'destroy' only expects the model identifier.
     *
     * @param  array<string, mixed>  $relations
     */
    protected function setRequest(array $relations): static
    {
        return $this;
    }

    /**
     * Compile destruction execution body routing logic and responses.
     *
     * @param  array<string, mixed>  $relations
     */
    protected function setResource(array $relations): self
    {
        $hasAction = ! empty($relations['actions']['destroy'] ?? null);
        $hasService = ! empty($relations['service']);

        if (! $hasAction && ! $hasService) {
            $this->body = '// @Todo';

            return $this;
        }

        if ($hasAction) {
            $this->body = "\$action->handle(\$id); \n return response()->json(null, 204);";
        } elseif ($hasService) {
            $this->body = "\$service->destroy(\$id); \n return response()->json(null, 204);";
        }

        return $this;
    }

    /**
     * Skip custom transformer registration as destruction yields a structured empty JSON response.
     *
     * @param  array<string, mixed>  $relations
     */
    protected function setTransform(array $relations, string $moduleName): self
    {
        return $this;
    }

    /**
     * Define the target return type signature.
     *
     * @param  array<string, mixed>  $relations
     */
    protected function setReturnType(array $relations): void
    {
        $this->returnType = '\Illuminate\Http\JsonResponse';
    }
}
