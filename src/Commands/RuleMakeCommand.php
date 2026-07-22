<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;

class RuleMakeCommand extends BaseCommand
{
    protected $name = 'module:make-rule';

    protected $description = 'Create Rule';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::rule;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (! $this->showConfirm('Rule')) {
            $this->warn('rule creation cancelled.');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::RULE, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>'.$status.'</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a rule with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a rule with this name.'],
        ];
    }
}
