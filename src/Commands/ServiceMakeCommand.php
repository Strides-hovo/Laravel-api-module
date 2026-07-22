<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;

class ServiceMakeCommand extends BaseCommand
{
    protected $name = 'module:make-service';

    protected $description = 'Created Service';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::service;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (! $this->showConfirm('Service')) {
            $this->warn('Service creation cancelled.');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::SERVICE, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>'.$status.'</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a service with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a service with this name.'],
        ];
    }
}
