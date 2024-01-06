<?php

namespace Strides\Module\Commands;

use Illuminate\Support\Facades\Config;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\Exceptions\FileGeneratorException;
use Strides\Module\ModuleDirector;
use Symfony\Component\Console\Input\InputArgument;

class ModuleMakeCommand extends BaseMakeCommand
{

    protected $name = 'module:make-module';
    protected $description = 'Created Module';


    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::REQUIRED, 'Create a module|model with this name.'],
        ];
    }


    /**
     * @throws FileGeneratorException
     * @throws BuilderException
     */
    public function handle(): void
    {
        $generators = Config::get("module.paths.generator");
        $options = ['moduleName' => $this->argument('moduleName')];
        $statuses = ModuleDirector::module($options, $generators);
        foreach ($statuses as $status) {
            $this->line('Created: <info>' . $status . '</info>');
        }
    }
}
