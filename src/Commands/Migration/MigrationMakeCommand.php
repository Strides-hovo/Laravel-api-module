<?php

namespace Strides\Module\Commands\Migration;

use Strides\Module\Commands\BaseMakeCommand;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\Exceptions\FileGeneratorException;
use Strides\Module\ModuleDirector;
use Symfony\Component\Console\Input\InputArgument;

class MigrationMakeCommand extends BaseMakeCommand
{

    protected $name = 'module:make-migration';
    protected $description = 'Created Migration';


    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::REQUIRED, 'Create a module|model with this name.'],
            ['fileName', InputArgument::REQUIRED, 'Create a model with this name.'],
        ];
    }


    /**
     * @throws FileGeneratorException
     * @throws BuilderException
     */
    public function handle(): void
    {
        parent::handle();
        $statuses = ModuleDirector::create(BuilderClassNameEnum::MIGRATION, $this->data);
        foreach ($statuses as $status) {
            $this->line('Created: <info>' . $status . '</info>');
        }
    }

    protected function checkExistence(): bool
    {
        return false;
    }
}
