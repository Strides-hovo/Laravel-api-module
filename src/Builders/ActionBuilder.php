<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Builders\Resolvers\Action\ActionsClassesResolver;
use Strides\Module\Builders\Resolvers\Action\DestroyClassResolver;
use Strides\Module\Builders\Resolvers\Action\IndexClassResolver;
use Strides\Module\Builders\Resolvers\Action\ShowClassResolver;
use Strides\Module\Builders\Resolvers\Action\StoreClassResolver;
use Strides\Module\Builders\Resolvers\Action\UpdateClassResolver;
use Strides\Module\Dto\BuilderResultDto;
use Strides\Module\Enums\ActionMethodEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class ActionBuilder extends BaseBuilder
{
    /**
     * Соответствие метода экшена своему резолверу мини-стаба.
     *
     * @var array<string, class-string<ActionsClassesResolver>>
     */
    private const RESOLVERS = [
        'index' => IndexClassResolver::class,
        'store' => StoreClassResolver::class,
        'update' => UpdateClassResolver::class,
        'destroy' => DestroyClassResolver::class,
        'show'   => ShowClassResolver::class
    ];

    public function getContent(): BuilderResultDto
    {
        $method = ActionMethodEnum::fromClassName($this->fileName);

        $stub = (string) file_get_contents($this->getStubPath($method));
        $finalContent = $this->resolveContent($stub, $method);

        $modDir = ModuleHelper::module($this->moduleName);
        $buildDir = ModuleHelper::generator(BuilderKeysEnum::action);

        $dir = ModuleHelper::normalizePath($modDir.DIRECTORY_SEPARATOR.$buildDir);
        $fileName = $dir.DIRECTORY_SEPARATOR.$this->fileName.'.php';

        return new BuilderResultDto(
            dirName: $dir,
            fileName: $fileName,
            content: $finalContent
        );
    }

    protected function resolveContent(string $stub, ?ActionMethodEnum $method): string
    {
        $resolverClass = $method ? self::RESOLVERS[$method->name] : null;

        if ($resolverClass) {
            $resolver = new $resolverClass;

            return $resolver->resolve($stub, $this->moduleName, $this->fileName);
        }

        // Кастомное имя экшена (не Index/Store/Update/Destroy) — используем generic-шаблон.
        $replacements = $this->getReplacements();

        return str_replace(
            array_keys($replacements),
            array_values($replacements),
            $stub
        );
    }

    protected function getStubPath(?ActionMethodEnum $method = null): string
    {
        if ($method) {
            return Config::get(
                "module-stub.action.{$method->name}",
                dirname(__DIR__).'/stubs/mini/action/'.$method->name.'.stub'
            );
        }

        return Config::get('module-stub.action.main', dirname(__DIR__).'/stubs/action.stub');
    }

    /**
     * @return array<string, string>
     */
    protected function getReplacements(): array
    {
        return [
            '{{ namespace }}' => ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::action),
            '{{ class }}' => $this->fileName,
            '{{ repository_use }}' => ModuleHelper::repositoryUseStatement($this->moduleName),
            '{{ repository_param }}' => ModuleHelper::repositoryParam($this->moduleName),
        ];
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::action;
    }
}
