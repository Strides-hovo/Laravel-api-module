<?php

namespace Strides\Module\Commands;

use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\Exceptions\FileGeneratorException;
use Strides\Module\ModuleDirector;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class ControllerMakeCommand extends BaseMakeCommand
{

    protected $name = 'module:make-controller';
    protected $description = 'Created Controller';
    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::controller;

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::REQUIRED, 'Create a module|controller with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a controller with this name.'],
        ];
    }


    protected function getOptions(): array
    {
        return [
            ['request', 'r', InputOption::VALUE_NONE, 'Flag to create associated migrations', null],
            ['resource', 's', InputOption::VALUE_NONE, 'Create a new seeder for the model', null],
            ['collection', 'c', InputOption::VALUE_NONE, 'Flag to create All', null],
            ['repository', 'p', InputOption::VALUE_NONE, 'Create a new factory for the model', null],
            ['model', 'm', InputOption::VALUE_NONE, 'Specify the model name.'],
            ['all', 'a', InputOption::VALUE_NONE, 'Specify the model name.'],
        ];
    }


    /**
     * @throws FileGeneratorException
     * @throws BuilderException
     */
    public function handle(): void
    {
        parent::handle();
        if (!$this->showConfirm('Контроллер')) {
            return;
        }
        $statuses = ModuleDirector::create(BuilderClassNameEnum::CONTROLLER, $this->data);
        foreach ($statuses as $status) {
            $this->line('Created: <info>' . $status . '</info>');
        }
    }
}
