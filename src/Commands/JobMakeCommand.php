<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;

class JobMakeCommand extends BaseCommand
{
    protected $name = 'module:make-job';

    protected $description = 'Create Job';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::job;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (! $this->showConfirm('Job')) {
            $this->warn('Job creation cancelled');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::JOB, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>'.$status.'</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a job with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a job with this name.'],
        ];
    }
}
