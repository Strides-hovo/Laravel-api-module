<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;

class NotificationMakeCommand extends BaseCommand
{
    protected $name = 'module:make-notification';

    protected $description = 'Create Notification';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::notification;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (! $this->showConfirm('Notification')) {
            $this->warn('notification creation cancelled');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::NOTIFICATION, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>'.$status.'</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a notification with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a notification with this name.'],
        ];
    }
}
