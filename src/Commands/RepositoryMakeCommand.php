<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class RepositoryMakeCommand extends BaseCommand
{
    protected $name = 'module:make-repository';
    protected $description = 'Created Repository';
    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::repository;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (!$this->showConfirm('Repository')) {
            $this->warn('repository creation cancelled.');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::REPOSITORY, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>' . $status . '</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a repository with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a repository with this name.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['model', null, InputOption::VALUE_REQUIRED, 'Flag to use model'],
        ];
    }
}
