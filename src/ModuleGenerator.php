<?php

declare(strict_types=1);

namespace Strides\Module;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Builders\BaseBuilder;
use Strides\Module\Dto\CommandDto;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\Facades\Module;
use Strides\Module\Factories\FileNameFactory;
use Strides\Module\Generators\BuilderResolver;
use Strides\Module\Generators\GeneratorOptionsResolver;

class ModuleGenerator
{
    /**
     * @throws BindingResolutionException|BuilderException
     */
    public static function create(string $moduleName): array
    {
        $generators = array_map(fn ($setting) => true, ModuleHelper::generators());
        $fileGenerator = new FileGenerator();
        $statuses = [];

        foreach ($generators as $key => $value) {
            if ($key === 'action') {
                continue;
            }

            $builder = self::resolveBuilder($key, $moduleName, $generators);

            if ($builder === null) {
                \Illuminate\Support\Facades\Log::warning('No builder registered for generator key.', ['key' => $key]);
                continue;
            }

            $content = $builder->getContent();

            $statuses[$key] = $fileGenerator->generate(
                dirName: $content->dirName,
                fileName: $content->fileName,
                content: $content->content
            );

            if ($key === 'controller' && array_key_exists('action', $generators)) {
                $statuses['action'] = self::generateActionsFromController($builder, $moduleName, $fileGenerator);
            }
        }

        Module::register($moduleName);

        return $statuses;
    }

    /**
     * @throws BindingResolutionException|BuilderException
     */
    private static function resolveBuilder(string $key, string $moduleName, array $generators): ?BaseBuilder
    {
        $builderClass = BuilderResolver::tryGetClass($key);

        if ($builderClass === null) {
            return null;
        }

        $options = GeneratorOptionsResolver::resolve($key, $moduleName, $generators);
        $generatorKey = BuilderKeysEnum::getCaseByName($key);
        $fileName = FileNameFactory::make(moduleName: $moduleName, type: $generatorKey);

        return BuilderResolver::make($builderClass, new CommandDto(
            moduleName: $moduleName,
            fileName: ModuleHelper::singular($fileName),
            options: $options
        ));
    }

    /**
     * @return array<string, string>
     * @throws BindingResolutionException|BuilderException
     */
    private static function generateActionsFromController(BaseBuilder $controllerBuilder, string $moduleName, FileGenerator $fileGenerator): array
    {
        $actionStatuses = [];
        $actionNames = $controllerBuilder->relations['actions'] ?? [];

        foreach ($actionNames as $method => $fileName) {
            $builder = BuilderResolver::make(
                BuilderClassNameEnum::getCaseByName('action'),
                new CommandDto(moduleName: $moduleName, fileName: $fileName, options: [])
            );
            $result = $builder->getContent();

            $actionStatuses[$method] = $fileGenerator->generate(
                dirName: $result->dirName,
                fileName: $result->fileName,
                content: $result->content
            );
        }

        return $actionStatuses;
    }
}
