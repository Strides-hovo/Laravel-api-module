<?php

namespace Strides\Module\Commands;

use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\Exceptions\FileGeneratorException;
use Strides\Module\ModuleDirector;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class ModelMakeCommand extends BaseMakeCommand
{

    protected $name = 'module:make-model';
    protected $description = 'Created Model';


    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::REQUIRED, 'Create a module|model with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a model with this name.'],
        ];
    }


    protected function getOptions(): array
    {
        return [
            ['migration', 'm', InputOption::VALUE_NONE, 'Flag to create associated migrations', null],
            ['seeder', 's', InputOption::VALUE_NONE, 'Create a new seeder for the model', null],
            ['factory', 'f', InputOption::VALUE_NONE, 'Create a new factory for the model', null],
            ['controller', 'c', InputOption::VALUE_NONE, 'Flag to create associated controllers', null],
            ['all', 'a', InputOption::VALUE_NONE, 'Flag to create all'],
        ];
    }


    /**
     * @throws FileGeneratorException
     * @throws BuilderException
     */
    public function handle(): void
    {
        parent::handle();
        $statuses = ModuleDirector::create(BuilderClassNameEnum::MODEL, $this->data);
        foreach ($statuses as $status) {
            $this->line('Created: <info>' . $status . '</info>');
        }
    }
}
