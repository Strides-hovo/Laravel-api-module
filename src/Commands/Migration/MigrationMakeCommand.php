<?php

declare(strict_types=1);

namespace Strides\Module\Commands\Migration;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Commands\BaseCommand;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class MigrationMakeCommand extends BaseCommand
{
    protected $name = 'module:make-migration';

    protected $description = 'Create Migration';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::migration;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (! $this->showConfirm('Migration')) {
            $this->warn('Created migration canceled.');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::MIGRATION, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>'.$status.'</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a migration with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a migration with this name.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['table', 't', InputOption::VALUE_OPTIONAL, 'The table that the model applies to'],
        ];
    }
}
