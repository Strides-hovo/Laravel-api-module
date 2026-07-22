<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;

class EventMakeCommand extends BaseCommand
{
    protected $name = 'module:make-event';

    protected $description = 'Create Event';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::event;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (! $this->showConfirm('Event')) {
            $this->warn('Event creation cancelled');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::EVENT, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>'.$status.'</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a event with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a event with this name.'],
        ];
    }
}
