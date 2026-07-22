<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;

class SeederMakeCommand extends BaseCommand
{
    protected $name = 'module:make-seeder';

    protected $description = 'Create Seeder';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::seeder;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (! $this->showConfirm('Seeder')) {
            $this->warn('Seeder creation cancelled.');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::SEEDER, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>'.$status.'</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a seeder with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a seeder with this name.'],
        ];
    }
}
