<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;

class MiddlewareMakeCommand extends BaseCommand
{
    protected $name = 'module:make-middleware';

    protected $description = 'Create Middleware';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::middleware;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {

        if (! $this->showConfirm('Middleware')) {
            $this->warn('middleware creation cancelled.');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::MIDDLEWARE, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>'.$status.'</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a middleware with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a middleware with this name.'],
        ];
    }
}
