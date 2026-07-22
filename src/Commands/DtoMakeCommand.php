<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;

class DtoMakeCommand extends BaseCommand
{
    protected $name = 'module:make-dto';

    protected $description = 'Create Dto';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::dto;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (! $this->showConfirm('Dto')) {
            $this->warn('Dto creation cancelled');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::DTO, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>'.$status.'</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a dto with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a dto with this name.'],
        ];
    }
}
