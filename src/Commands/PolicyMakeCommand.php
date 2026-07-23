<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class PolicyMakeCommand extends BaseCommand
{
    protected $name = 'module:make-policy';

    protected $description = 'Create Policy';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::policy;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (! $this->showConfirm('Policy')) {
            $this->warn('Policy creation cancelled');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::POLICY, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>'.$status.'</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a policy with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a policy with this name.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['model', 'm', InputOption::VALUE_OPTIONAL, 'The model that the policy applies to'],
            ['guard', 'g', InputOption::VALUE_OPTIONAL, 'The guard that the policy relies on'],
            ['force', 'f', InputOption::VALUE_NONE, 'Force the operation to run without confirmation prompt.'],
        ];
    }
}
