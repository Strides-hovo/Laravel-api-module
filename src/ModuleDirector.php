<?php

declare(strict_types=1);

namespace Strides\Module;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Builders\BaseBuilder;
use Strides\Module\Builders\MailBuilder;
use Strides\Module\Builders\RepositoryBuilder;
use Strides\Module\Builders\ServiceBuilder;
use Strides\Module\Dto\CommandDto;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Exceptions\BuilderException;

/**
 * Orchestrates the overall file generation flow, determining the correct builders
 * to use and processing potential sub-relations (e.g. controllers requiring actions/requests).
 */
class ModuleDirector
{
    /**
     * Set up the director with the underlying file writer service.
     */
    public function __construct(private readonly FileGenerator $fileGenerator) {}

    /**
     * Generate a primary module component and dynamically build any nested sub-relations.
     *
     * @return array<string>
     *
     * @throws BindingResolutionException
     */
    public function generateComponent(BuilderClassNameEnum $builderClass, CommandDto $dto): array
    {
        $statuses = [];
        $builder = $this->getBuilder($builderClass, $dto);
        if ($builder instanceof RepositoryBuilder || $builder instanceof ServiceBuilder) {
            $builder->isSolo = true;
        }
        if ($builder instanceof MailBuilder && isset($dto->options['view'])) {
            $view = $builder->getRequestView();

            $statuses[] = $this->fileGenerator->generate(
                dirName: $view->dirName,
                fileName: $view->fileName,
                content: $view->content
            );
        }

        $buildResult = $builder->getContent();

        $statuses[] = $this->fileGenerator->generate(
            dirName: $buildResult->dirName,
            fileName: $buildResult->fileName,
            content: $buildResult->content
        );

        return array_merge($statuses, $this->processRelations($builder, $dto));
    }

    /**
     * Walk a builder's relations tree and recursively generate every nested component
     * (e.g. controller -> request -> ... ), propagating the user-supplied options
     * down to each generated relation instead of overwriting them.
     *
     * @return array<string>
     *
     * @throws BindingResolutionException
     */
    private function processRelations(BaseBuilder $builder, CommandDto $dto): array
    {
        $statuses = [];

        foreach ($builder->relations as $relation => $className) {
            try {
                $relationStr = (string) $relation;

                // Handle multiple actions
                if ($relationStr === 'actions' && is_array($className)) {
                    foreach ($className as $actionClassName) {
                        if (is_string($actionClassName)) {
                            $statuses = array_merge($statuses, $this->generateRelated('action', $actionClassName, $dto));
                        }
                    }

                    continue;
                }

                if (is_string($className)) {
                    $statuses = array_merge($statuses, $this->generateRelated($relationStr, $className, $dto));
                }
            } catch (BuilderException) {
                continue;
            }
        }

        return $statuses;
    }

    /**
     * Handle generation for linked/related component classes (e.g., matching requests/actions),
     * then recurse into that related builder's own relations so nothing gets lost
     * (e.g. a generated Controller's Request/Service/Resource actually gets written to disk).
     *
     * @return array<string>
     *
     * @throws BindingResolutionException|BuilderException
     */
    private function generateRelated(string $relation, string $className, CommandDto $parentDto): array
    {
        $relatedBuilderClass = BuilderClassNameEnum::getCaseByName($relation);

        $relatedDto = new CommandDto(moduleName: $parentDto->moduleName, fileName: $className, options: $parentDto->options);
        $relatedBuilder = $this->getBuilder($relatedBuilderClass, $relatedDto);
        $result = $relatedBuilder->getContent();

        $status = $this->fileGenerator->generate(
            dirName: $result->dirName,
            fileName: $result->fileName,
            content: $result->content
        );

        // Recurse: generate this related builder's own relations too (e.g. Controller -> Request/Resource/Actions).
        return array_merge([$status], $this->processRelations($relatedBuilder, $relatedDto));
    }

    /**
     * Resolve the specific builder instance out of the Laravel container.
     *
     * @throws BindingResolutionException
     */
    public function getBuilder(BuilderClassNameEnum $builderClass, CommandDto $dto): BaseBuilder
    {
        $builderClassName = $builderClass->value;

        return app()->makeWith($builderClassName, [
            'dto' => $dto,
            CommandDto::class => $dto,
        ]);
    }
}
