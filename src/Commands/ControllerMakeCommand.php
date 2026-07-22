<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class ControllerMakeCommand extends BaseCommand
{
    protected $name = 'module:make-controller';

    protected $description = 'Created Controller';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::controller;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (! $this->showConfirm('Controller')) {
            $this->warn('Controller creation cancelled.');

            return self::FAILURE;
        }
        $statuses = $this->director->generateComponent(BuilderClassNameEnum::CONTROLLER, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>'.$status.'</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a module|controller with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a controller with this name.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['request', 'r', InputOption::VALUE_NONE, 'Flag to create an associated FormRequest class', null],
            ['resource', 'e', InputOption::VALUE_NONE, 'Flag to create an associated API Resource class', null],
            ['transformer', 't', InputOption::VALUE_NONE, 'Flag to create an associated Resource Transformer class', null],
            ['service', 's', InputOption::VALUE_NONE, 'Flag to create an associated Service class', null],
            ['action', 'a', InputOption::VALUE_NONE, 'Specify the related action name.'],
            ['test', 'T', InputOption::VALUE_NONE, 'Specify the related action name.'],
            ['all', null, InputOption::VALUE_NONE, 'Flag to create all associated classes (request, resource, transformer, service, action).'],
        ];
    }
}
