<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Builders\Resolvers\Service\DestroyMethodResolver;
use Strides\Module\Builders\Resolvers\Service\IndexMethodResolver;
use Strides\Module\Builders\Resolvers\Service\ServiceMethodResolver;
use Strides\Module\Builders\Resolvers\Service\StoreMethodResolver;
use Strides\Module\Builders\Resolvers\Service\UpdateMethodResolver;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class ServiceBuilder extends BaseBuilder
{
    public bool $isSolo = false;

    /**
     * Соответствие метода сервиса своему резолверу mini-стаба.
     *
     * @var array<string, class-string<ServiceMethodResolver>>
     */
    private const METHOD_RESOLVERS = [
        'index' => IndexMethodResolver::class,
        'store' => StoreMethodResolver::class,
        'update' => UpdateMethodResolver::class,
        'destroy' => DestroyMethodResolver::class,
    ];

    protected function getStubPath(): string
    {
        return $this->isSolo
            ? Config::get('module-stub.service.solo')
            : Config::get('module-stub.service.main');
    }

    protected function getReplacements(): array
    {
        return [
            '{{ namespace }}' => ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::service),
            '{{ class }}' => $this->fileName,
            '{{ repository_use }}' => ModuleHelper::repositoryUseStatement($this->moduleName),
            '{{ repository_param }}' => ModuleHelper::repositoryParam($this->moduleName),
            '{{ body }}' => $this->buildBody(),
        ];
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::service;
    }

    private function buildBody(): string
    {
        $fragments = [];

        foreach (self::METHOD_RESOLVERS as $method => $resolverClass) {
            $stub = (string) file_get_contents($this->getMethodStubPath($method));
            $resolver = new $resolverClass;
            $fragments[] = $resolver->resolve($stub, $this->moduleName);
        }

        return implode("\n\n", $fragments);
    }

    private function getMethodStubPath(string $method): string
    {
        return Config::get(
            "module-stub.service.{$method}",
            dirname(__DIR__)."/stubs/mini/service/{$method}.stub"
        );
    }
}
