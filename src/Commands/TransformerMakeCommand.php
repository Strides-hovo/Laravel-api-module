<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;

class TransformerMakeCommand extends BaseCommand
{
    protected $name = 'module:make-transformer';
    protected $description = 'Created Transformer';
    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::transformer;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (!$this->showConfirm('Transformer')) {
            $this->warn('Transformer creation cancelled.');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::TRANSFORMER, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>' . $status . '</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a transformer with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a transformer with this name.'],
        ];
    }

}
