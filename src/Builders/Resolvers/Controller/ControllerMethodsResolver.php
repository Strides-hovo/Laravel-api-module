<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers\Controller;

use Strides\Module\Builders\Resolvers\MethodResolverInterface;

/**
 * Base method resolver class tasked with building dynamic parameter signatures and method bodies for controllers.
 */
abstract class ControllerMethodsResolver implements MethodResolverInterface
{
    /**
     * @var array<int, string>
     */
    protected array $params = [];

    protected string $returnType = 'mixed';

    protected string $body = '// @Todo';

    protected string $method = ''; // index, store, update, destroy

    /**
     * Resolve and compile the target stub method with parameters, return type, and bodies.
     *
     * @param  array<string, mixed>  $relations
     */
    public function resolve(string $stub, string $moduleName, array $relations): string
    {

        $this->Replacements($moduleName, $relations);
        $parameters = implode(', ', $this->params);

        return strtr($stub, [
            '{{ parameters }}' => $parameters,
            '{{ return_type }}' => $this->returnType,
            '{{ body }}' => $this->body,
        ]);
    }

    /**
     * Compute sequential parameters replacements for the generated method signature.
     *
     * @param  array<string, mixed>  $relations
     */
    protected function Replacements(string $moduleName, array $relations): void
    {
        $this
            ->setRequest($relations)
            ->setAction($relations)
            ->setService($relations)
            ->setResource($relations)
            ->setTransform($relations, $moduleName)
            ->setReturnType($relations);
    }

    /**
     * Evaluate and append the request parameter class signature.
     *
     * @param  array<string, mixed>  $relations
     */
    protected function setRequest(array $relations): static
    {
        $hasRequest = ! empty($relations['request']);
        $this->params[] = $hasRequest
            ? $relations['request'].' $request'
            : '\Illuminate\Http\Request $request';

        return $this;
    }

    /**
     * Evaluate and inject the Action parameter dependency when present.
     *
     * @param  array<string, mixed>  $relations
     */
    protected function setAction(array $relations): static
    {
        $hasAction = ! empty($relations['actions'][$this->method] ?? null);
        if ($hasAction) {
            $this->params[] = $relations['actions'][$this->method].' $action';
        }

        return $this;
    }

    /**
     * Evaluate and inject the Service dependency if no matching Action matches.
     *
     * @param  array<string, mixed>  $relations
     */
    protected function setService(array $relations): static
    {
        $hasAction = ! empty($relations['actions'][$this->method] ?? null);
        $hasService = ! empty($relations['service']);

        if ($hasService && ! $hasAction) {
            $this->params[] = $relations['service'].' $service';
        }

        return $this;
    }

    /**
     * @param  array<string, mixed>  $relations
     */
    abstract protected function setResource(array $relations): self;

    /**
     * @param  array<string, mixed>  $relations
     */
    abstract protected function setTransform(array $relations, string $moduleName): self;

    /**
     * @param  array<string, mixed>  $relations
     */
    abstract protected function setReturnType(array $relations): void;

    /**
     * Determine whether to route execution context through actions or services and format call strings.
     *
     * @param  array<string, mixed>  $relations
     */
    protected function sourceCall(array $relations, string $method, bool $withId = false): string
    {
        $hasAction = ! empty($relations['actions'][$this->method] ?? null);
        $hasService = ! empty($relations['service']);

        $inputCall = ! empty($relations['request']) ? '$request->validated()' : '$request->all()';
        $idArg = $withId ? '$id, ' : '';

        if ($hasAction) {
            return "\$action->handle({$idArg}{$inputCall})";
        } elseif ($hasService) {
            return "\$service->{$method}({$idArg}{$inputCall})";
        }

        return '//@Todo';
    }
}
