<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;

class RequestMakeCommand extends BaseCommand
{
    protected $name = 'module:make-request';

    protected $description = 'Created Request';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::request;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (! $this->showConfirm('Request')) {
            $this->warn('request creation cancelled.');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::REQUEST, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>'.$status.'</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a request with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a request with this name.'],
        ];
    }
}
