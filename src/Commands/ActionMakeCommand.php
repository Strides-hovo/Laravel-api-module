<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;

class ActionMakeCommand extends BaseCommand
{
    protected $name = 'module:make-action';

    protected $description = 'Created Action';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::action;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (! $this->showConfirm('Action')) {
            $this->warn('Action creation cancelled');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::ACTION, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>'.$status.'</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::REQUIRED, 'Create a action with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a action with this name.'],
        ];
    }
}
