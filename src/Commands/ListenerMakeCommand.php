<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class ListenerMakeCommand extends BaseCommand
{
    protected $name = 'module:make-listener';

    protected $description = 'Create Listener';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::listener;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (! $this->showConfirm('Listener')) {
            $this->warn('Listener creation cancelled');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::LISTENER, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>'.$status.'</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a listener with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a listener with this name.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['event', 'e', InputOption::VALUE_OPTIONAL, 'Using Event'],
            ['force', 'f', InputOption::VALUE_NONE, 'Force the operation to run without confirmation prompt.'],
        ];
    }
}
