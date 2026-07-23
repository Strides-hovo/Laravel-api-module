<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class ModelMakeCommand extends BaseCommand
{
    protected $name = 'module:make-model';

    protected $description = 'Create Model';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::model;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (! $this->showConfirm('Model')) {
            $this->warn('Model creation cancelled');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::MODEL, $this->data);

        foreach ($statuses as $status) {
            $this->line("<fg=blue>INFO</> <fg=blue>[</>{$status}.php<fg=blue>]</> <info>created successfully.</info>");
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a model with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a model with this name.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['migration', 'm', InputOption::VALUE_NONE, 'Create a new migration file for the model'],
            ['controller', 'c', InputOption::VALUE_NONE, 'Create a new controller file for the model'],
            ['request', 'R', InputOption::VALUE_NONE, 'Create a new request file for the model'],
            ['resource', 'r', InputOption::VALUE_NONE, 'Create a new resource file for the model'],
            ['service', 'S', InputOption::VALUE_NONE, 'Create a new service file for the model'],
            ['transformer', 't', InputOption::VALUE_NONE, 'Create a new transformer file for the model'],
            ['action', 'a', InputOption::VALUE_NONE, 'Create a new actions file for the model'],
            ['policy', null, InputOption::VALUE_NONE, 'Create a new policy for the model'],
            ['factory', 'f', InputOption::VALUE_NONE, 'Create a new factory file for the model'],
            ['seed', 's', InputOption::VALUE_NONE, 'Create a new seeder file for the model'],
            ['morph-pivot', null, InputOption::VALUE_NONE, 'Indicates if the generated model should be a custom polymorphic intermediate table mode'],
            ['pivot', 'p', InputOption::VALUE_NONE, 'Indicates if the generated model should be a custom intermediate table model'],
            ['test', null, InputOption::VALUE_NONE, 'Generate an accompanying Test test for the Model'],
            ['force', null, InputOption::VALUE_NONE, 'Force the operation to run without confirmation prompt.'],
            ['all', null, InputOption::VALUE_NONE, 'Generate a migration, seeder, factory, policy, test, controller'],
        ];
    }
}
