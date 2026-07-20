<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;

class CommandMakeCommand extends BaseCommand
{
    protected $name = 'module:make-command';
    protected $description = 'Create Command';
    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::command;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (!$this->showConfirm('Command')) {
            $this->warn('Command creation cancelled.');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::COMMAND, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>' . $status . '</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a command with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a command with this name.'],
        ];
    }
}
