<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class FactoryMakeCommand extends BaseCommand
{
    protected $name = 'module:make-factory';
    protected $description = 'Create Factory';
    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::factory;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (!$this->showConfirm('Factory')) {
            $this->warn('Factory');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::FACTORY, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>' . $status . '</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a factory with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a factory with this name.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['model', 'm', InputOption::VALUE_OPTIONAL, 'The model that the factory applies to'],
        ];
    }
}
