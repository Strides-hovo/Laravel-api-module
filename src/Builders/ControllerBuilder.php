<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Builders\Resolvers\Controller\ControllerMethodsResolver;
use Strides\Module\Builders\Resolvers\Controller\DestroyMethodResolver;
use Strides\Module\Builders\Resolvers\Controller\IndexMethodResolver;
use Strides\Module\Builders\Resolvers\Controller\StoreMethodResolver;
use Strides\Module\Builders\Resolvers\Controller\UpdateMethodResolver;
use Strides\Module\Contracts\HasRelationsInterface;
use Strides\Module\Dto\CommandDto;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

/**
 * Controller class builder that compiles method stubs, formats dependencies,
 * and sets up API route relations dynamically.
 */
class ControllerBuilder extends BaseBuilder implements HasRelationsInterface
{
    /**
     * @var array<string, mixed>
     */
    public array $relations = [];

    /**
     * Initialize the controller builder and inject the method-specific template resolvers.
     */
    public function __construct(
        CommandDto                      $dto,
        protected IndexMethodResolver   $indexMethod,
        protected StoreMethodResolver   $storeMethod,
        protected UpdateMethodResolver  $updateMethod,
        protected DestroyMethodResolver $destroyMethod,
    ) {
        parent::__construct($dto);
    }

    /**
     * Boot baseline dependencies using parsed command options.
     */
    public function init(): void
    {
        $this->setRelations($this->options);
    }

    /**
     * Get the defined dependency array mapping.
     *
     * @return array<string, mixed>
     */
    public function getRelations(): array
    {
        return $this->relations;
    }

    /**
     * Parse array configurations to determine dynamic relation classes to load.
     *
     * @param array<string, mixed> $options
     */
    public function setRelations(array $options): void
    {
        foreach ($options as $key => $value) {
            if (!$value) {
                continue;
            }

            match ($key) {
                'r', 'request' => $this->relations['request'] = $this->getControllerRelation(BuilderKeysEnum::request, 'Request'),
                'a', 'action' => $this->relations['actions'] = [
                    'index' => $this->getControllerRelation(BuilderKeysEnum::action, 'IndexAction'),
                    'store' => $this->getControllerRelation(BuilderKeysEnum::action, 'StoreAction'),
                    'update' => $this->getControllerRelation(BuilderKeysEnum::action, 'UpdateAction'),
                    'destroy' => $this->getControllerRelation(BuilderKeysEnum::action, 'DestroyAction'),
                ],
                's', 'service' => $this->relations['service'] = $this->getControllerRelation(BuilderKeysEnum::service, 'Service'),
                'e', 'resource' => $this->relations['resource'] = $this->getControllerRelation(BuilderKeysEnum::resource, 'Resource'),
                't', 'transformer' => $this->relations['transformer'] = $this->getControllerRelation(BuilderKeysEnum::transformer, 'Transformer'),
                'T', 'test' => $this->relations['test'] = $this->getControllerRelation(BuilderKeysEnum::unit_test, 'Test'),
                'all' => $this->setAllRelation(),
                default => null,
            };

            if (!empty($this->relations['actions'])) {
                unset($this->relations['service']);
            }

            if (!empty($this->relations['transformer'])) {
                unset($this->relations['resource']);
            }
        }

    }

    /**
     * Get the filepath targeting the main controller stub template.
     */
    protected function getStubPath(): string
    {
        return (string)Config::get('module-stub.controller.main');
    }

    /**
     * Retrieve the generator key identification code.
     */
    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::controller;
    }

    /**
     * Collect the replacement mapping values to format the main controller class template.
     *
     * @return array<string, string>
     */
    protected function getReplacements(): array
    {
        return [
            '{{ namespace }}' => ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::controller),
            '{{ class }}' => $this->fileName,
            '{{ imports }}' => $this->buildImports(),
            '{{ body }}' => $this->buildBody(),
        ];
    }

    /**
     * Compile each target controller method into one unified body string.
     */
    protected function buildBody(): string
    {
        /** @var ControllerMethodsResolver[] $methods */
        $methods = [
            'index' => $this->indexMethod,
            'store' => $this->storeMethod,
            'update' => $this->updateMethod,
            'destroy' => $this->destroyMethod,
        ];

        $result = [];

        foreach ($methods as $name => $resolver) {
            $stubPath = (string)Config::get("module-stub.controller.{$name}");
            $stub = is_file($stubPath) ? (string)file_get_contents($stubPath) : '';
            $result[] = $resolver->resolve($stub, $this->moduleName, $this->relations);
        }

        return implode("\n\n", $result);
    }

    /**
     * Build the FQCN "use" statements based on the computed dynamic dependencies.
     */
    protected function buildImports(): string
    {
        $imports = [];

        $keyToEnum = [
            'request' => BuilderKeysEnum::request,
            'actions' => BuilderKeysEnum::action,
            'service' => BuilderKeysEnum::service,
            'resource' => BuilderKeysEnum::resource,
            'transformer' => BuilderKeysEnum::transformer,
            'repository' => BuilderKeysEnum::repository,
        ];

        foreach ($this->relations as $relation => $className) {
            if ($relation === 'actions' && is_iterable($className)) {
                foreach ($className as $actionClass) {
                    $fqcn = ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::action, (string)$actionClass);
                    $imports[] = "use {$fqcn};";
                }
            } elseif (isset($keyToEnum[$relation]) && is_string($className)) {
                $fqcn = ModuleHelper::namespace($this->moduleName, $keyToEnum[$relation], $className);
                $imports[] = "use {$fqcn};";
            }
        }

        return implode("\n", $imports);
    }

    /**
     * Preset standard full API relations on request.
     */
    private function setAllRelation(): void
    {
        $this->relations = [
            'request' => $this->getControllerRelation(BuilderKeysEnum::request, 'Request'),
            'transformer' => $this->getControllerRelation(BuilderKeysEnum::transformer, 'Transformer'),
            'actions' => [
                'index' => $this->getControllerRelation(BuilderKeysEnum::action, 'IndexAction'),
                'store' => $this->getControllerRelation(BuilderKeysEnum::action, 'StoreAction'),
                'update' => $this->getControllerRelation(BuilderKeysEnum::action, 'UpdateAction'),
                'destroy' => $this->getControllerRelation(BuilderKeysEnum::action, 'DestroyAction'),
            ],
            'repository' => ModuleHelper::repositoryClassName($this->moduleName),
        ];
    }
}
