<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Strides\Module\Contracts\FileGeneratorInterface;
use Strides\Module\ModuleGenerator;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class ModuleMakeCommand extends Command
{
    protected $name = 'module:make-module';

    protected $description = 'Create Module';

    private string $moduleName;

    public function handle(ModuleGenerator $generator, FileGeneratorInterface $fileGenerator): int
    {
        $argument = $this->argument('moduleName');
        $moduleNameParam = is_string($argument) || is_null($argument) ? $argument : null;

        if (! $this->setModuleName($moduleNameParam)) {
            $this->error('The module name is required!');

            return self::FAILURE;
        }

        $option = $this->option('mversion');
        $version = $this->normalizeVersion($option);

        $this->comment("Creating module {$this->moduleName} $version");
        $statuses = $generator->create($this->moduleName, $fileGenerator, $version);

        foreach ($statuses as $status) {
            $type = Str::ucfirst($status->key);
            $message = $status->status === 'created' ? "<info>{$status->message} </info>" : "<fg=yellow>{$status->message}</>";
            $this->line(string: "<fg=blue>INFO </> <fg=blue>[</>{$type}<fg=blue>]</> $message");
        }

        return self::SUCCESS;
    }

    private function normalizeVersion(null|int|string $version): ?string
    {
        if (is_null($version)) {
            return null;
        }

        if (is_numeric($version)) {
            $number = (int) $version;
        } else {
            $number = (int) preg_replace('/^[a-zA-Z]+/', '', trim($version));
        }

        if ($number < 2) {
            return null;
        }

        return 'V'.$number;
    }

    private function setModuleName(?string $moduleName): bool
    {
        if (empty($moduleName)) {
            $askedName = $this->ask('Please enter the module name:');
            if (empty($askedName)) {
                return false;
            }
            $moduleName = $askedName;
        }
        $this->moduleName = Str::title($moduleName);

        return true;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a Module with this name.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['force', null, InputOption::VALUE_NONE, 'Force the operation to run when in production'],
            ['mversion', 'M', InputOption::VALUE_OPTIONAL, 'Generate module by version'],
        ];
    }
}
