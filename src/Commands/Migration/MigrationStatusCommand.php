<?php

declare(strict_types=1);

namespace Strides\Module\Commands\Migration;

use Strides\Module\Commands\MigrationActionCommand;
use Symfony\Component\Console\Input\InputArgument;

class MigrationStatusCommand extends MigrationActionCommand
{
    protected $name = 'module:migrate-status';
    protected $description = 'Show Migration status';

    public function handleCommand(): int
    {
        $this->call('migrate:status', [
            '--path' => $this->relativePath,
        ]);

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Get Status a migration with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a migration with this name.'],
        ];
    }
}
