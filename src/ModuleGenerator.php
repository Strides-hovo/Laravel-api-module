<?php

declare(strict_types=1);

namespace Strides\Module;

use Generator;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Support\Facades\Log;
use Strides\Module\Builders\BaseBuilder;
use Strides\Module\Builders\MailBuilder;
use Strides\Module\Contracts\FileGeneratorInterface;
use Strides\Module\Dto\BuilderResultDto;
use Strides\Module\Dto\CommandDto;
use Strides\Module\Dto\ModuleStatusDto;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\Facades\Module;
use Strides\Module\Factories\FileNameFactory;
use Strides\Module\Generators\BuilderResolver;
use Strides\Module\Generators\GeneratorHelper;
use Strides\Module\Generators\GeneratorOptionsResolver;

class ModuleGenerator
{
    public function __construct(private readonly GeneratorHelper $helper) {}

    /**
     * Generates module files for every registered generator type
     * (controller, model, migration, etc.), skipping ones that already exist.
     */
    public function create(string $moduleName, FileGeneratorInterface $fileGenerator, ?string $version): Generator
    {
        $generators = array_map(fn ($setting) => true, ModuleHelper::generators());

        foreach ($generators as $key => $_) {
            if ($key === 'action') {
                continue;
            }

            if ($this->helper->fileExists($key, $moduleName)) {
                yield ModuleStatusDto::fromArray([
                    'key' => $key,
                    'status' => 'missed',
                    'message' => 'This entity was missed, it is already in the module',
                ]);

                continue;
            }

            $builder = $this->resolveBuilder($key, $moduleName, $generators, $version);

            if ($builder === null) {
                Log::warning('No builder registered for generator key.', ['key' => $key]);

                continue;
            }

            if ($builder instanceof MailBuilder) {
                if ($status = $this->handleMailView($builder, $fileGenerator)) {
                    yield $status;
                }
            }

            yield $this->generateAndTrack($builder->getContent(), $fileGenerator, $key);

            // action files are not a standalone generator — they're a side effect
            // of the controller builder (it already collects $relations['actions'])
            if ($key === 'controller' && array_key_exists('action', $generators)) {
                $flag = $this->generateActionsFromController($builder, $moduleName, $fileGenerator);
                if ($flag) {
                    yield ModuleStatusDto::fromArray(['key' => 'actions', 'status' => 'created', 'message' => 'Created successfully']);
                }
            }
        }

        Module::register($moduleName);

    }

    /**
     * Generates the action files collected by the controller builder in $relations['actions'].
     * Returns false on the first failed generation (the whole batch is treated as not created).
     *
     * @throws BindingResolutionException
     * @throws BuilderException
     */
    private function generateActionsFromController(BaseBuilder $controllerBuilder, string $moduleName, FileGeneratorInterface $fileGenerator): bool
    {

        $actionNames = $controllerBuilder->relations['actions'] ?? [];

        foreach ($actionNames as $fileName) {
            $builder = BuilderResolver::make(
                BuilderClassNameEnum::getCaseByName('action'),
                new CommandDto(moduleName: $moduleName, fileName: $fileName, options: [])
            );
            $result = $builder->getContent();

            $file = $fileGenerator->generate(
                filePath: $result->filePath,
                content: $result->content
            );

            if (! $file) {
                return false;
            }
        }

        return true;
    }

    /**
     * Generate and track status
     */
    private function generateAndTrack(BuilderResultDto $content, FileGeneratorInterface $fileGenerator, string $key): ?ModuleStatusDto
    {

        $file = $fileGenerator->generate(
            filePath: $content->filePath,
            content: $content->content
        );

        return $file
            ? ModuleStatusDto::fromArray(['key' => $key, 'status' => 'created', 'message' => 'Created successfully'])
            : null;
    }

    /**
     * @throws BindingResolutionException|BuilderException
     */
    private function resolveBuilder(string $key, string $moduleName, array $generators, string $version): ?BaseBuilder
    {
        $builderClass = BuilderResolver::tryGetClass($key);

        if ($builderClass === null) {
            return null;
        }

        $options = GeneratorOptionsResolver::resolve($key, $moduleName, $generators);
        $options['version'] = $version;
        $generatorKey = BuilderKeysEnum::getCaseByName($key);
        $fileName = FileNameFactory::make(moduleName: $moduleName, type: $generatorKey);

        return BuilderResolver::make($builderClass, new CommandDto(
            moduleName: $moduleName,
            fileName: ModuleHelper::singular($fileName),
            options: $options
        ));
    }

    /**
     * MailBuilder also needs a blade view generated alongside the mail class itself —
     * an extra file the other generators don't have, hence the separate handling.
     */
    private function handleMailView(MailBuilder $builder, FileGeneratorInterface $fileGenerator): ?ModuleStatusDto
    {
        $builder->setOptions(['view' => true]);
        $view = $builder->getRequestView();

        $file = $fileGenerator->generate(
            filePath: $view->filePath,
            content: $view->content
        );

        return $file
            ? ModuleStatusDto::fromArray(['key' => 'mail view', 'status' => 'created', 'message' => 'Created successfully'])
            : null;
    }
}
