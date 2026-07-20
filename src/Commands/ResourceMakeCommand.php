<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class ResourceMakeCommand extends BaseCommand
{
    protected $name = 'module:make-resource';
    protected $description = 'Created Resource';
    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::resource;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (!$this->showConfirm('Resource')) {
            $this->warn('resource creation cancelled.');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::RESOURCE, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>' . $status . '</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a resource with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a resource with this name.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['collection', 'c', InputOption::VALUE_NONE, 'Create collection' ],
        ];
    }
}
