<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Contracts\HasRelationsInterface;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Factories\FileNameFactory;

class ModelBuilder extends BaseBuilder implements HasRelationsInterface
{
    private string $model = "\\Illuminate\Database\Eloquent\Model";

    protected function getStubPath(): string
    {
        return Config::get('module-stub.model.main');
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::model;
    }

    protected function getReplacements(): array
    {
        return array_merge(parent::getReplacements(), [
            '{{ model }}' => $this->model,
        ]);
    }

    public function setRelations(array $options): void
    {
        foreach ($options as $key => $value) {
            if (!$value) {
                continue;
            }

            match ($key) {
                'migration', 'm' => $this->relations['migration'] = FileNameFactory::make($this->moduleName, BuilderKeysEnum::migration),
                'controller', 'c' => $this->relations['controller'] = $this->getModelRelation(BuilderKeysEnum::controller, 'Controller'),
                'request', 'R' => $this->relations['request'] = $this->getModelRelation(BuilderKeysEnum::request, 'Request'),
                'resource', 'r' => $this->relations['resource'] = $this->getModelRelation(BuilderKeysEnum::resource, 'Resource'),
                'service', 'S' => $this->relations['service'] = $this->getModelRelation(BuilderKeysEnum::service, 'Service'),
                'transformer', 't' => $this->relations['transformer'] = $this->getModelRelation(BuilderKeysEnum::transformer, 'Transformer'),
                'policy' => $this->relations['policy'] = $this->getModelRelation(BuilderKeysEnum::policy, 'Policy'),
                'factory', 'f' => $this->relations['factory'] = $this->getModelRelation(BuilderKeysEnum::factory, 'Factory'),
                'seed', 's' => $this->relations['seeder'] = $this->getModelRelation(BuilderKeysEnum::seeder, 'Seeder'),
                'test' => $this->relations['unit_test'] = $this->getModelRelation(BuilderKeysEnum::unit_test, 'Test'),
                'a', 'action' => $this->relations['actions'] = [
                    'index' => $this->getControllerRelation(BuilderKeysEnum::action, 'IndexAction', $this->fileName),
                    'store' => $this->getControllerRelation(BuilderKeysEnum::action, 'StoreAction', $this->fileName ),
                    'update' => $this->getControllerRelation(BuilderKeysEnum::action, 'UpdateAction',$this->fileName),
                    'destroy' => $this->getControllerRelation(BuilderKeysEnum::action, 'DestroyAction',$this->fileName),
                ],

                'morph-pivot' => $this->morphPivot(),
                'pivot', 'p' => $this->pivot(),
                'all' => $this->setAllRelation(),

                default => null
            };
        }
        if (isset($options['controller'])){
            unset($this->relations['actions']);
        }
    }

    public function getRelations(): array
    {
        return $this->relations;
    }

    public function init(): void
    {
        $this->setRelations($this->options);
    }

    private function getModelRelation(BuilderKeysEnum $key, string $replacer): string
    {
        $relationClass = $this->fileName . $replacer;

        return FileNameFactory::make($this->moduleName, $key, $relationClass);
    }

    private function setAllRelation(): void
    {
        $this->relations = [
            'migration' => FileNameFactory::make($this->moduleName, BuilderKeysEnum::migration),
            'controller' => $this->getModelRelation(BuilderKeysEnum::controller, 'Controller'),
            'policy' => $this->getModelRelation(BuilderKeysEnum::policy, 'Policy'),
            'factory' => $this->getModelRelation(BuilderKeysEnum::factory, 'Factory'),
            'seeder' => $this->getModelRelation(BuilderKeysEnum::seeder, 'Seeder'),
            'unit_test' => $this->getModelRelation(BuilderKeysEnum::unit_test, 'Test'),
            'service' => $this->getModelRelation(BuilderKeysEnum::service, 'Service'),
            'request' => $this->getModelRelation(BuilderKeysEnum::request, 'Request'),
            'transformer' => $this->getModelRelation(BuilderKeysEnum::transformer, 'Transformer'),
        ];
    }

    private function pivot(): void
    {
        $this->model = "\\Illuminate\Database\Eloquent\Relations\Pivot";
    }

    private function morphPivot(): void
    {
        $this->model = "\\Illuminate\Database\Eloquent\Relations\MorphPivot";
    }
}
