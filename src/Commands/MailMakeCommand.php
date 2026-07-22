<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class MailMakeCommand extends BaseCommand
{
    protected $name = 'module:make-mail';

    protected $description = 'Create Mail';

    protected BuilderKeysEnum $generatorKey = BuilderKeysEnum::mail;

    /**
     * @throws BindingResolutionException
     */
    public function handleCommand(): int
    {
        if (! $this->showConfirm('Mail')) {
            $this->warn('Mail creation cancelled');

            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent(BuilderClassNameEnum::MAIL, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>'.$status.'</info>');
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a mail with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a mail with this name.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['view', null, InputOption::VALUE_NONE, 'Create view'],
        ];
    }
}
