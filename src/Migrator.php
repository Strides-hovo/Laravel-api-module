<?php

namespace Strides\Module;

use ErrorException;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Support\Facades\Artisan;
use Strides\Module\Contracts\MigrationFacadeInterface;
use Strides\Module\Contracts\MigrationInfoFacadeInterface;
use Strides\Module\Enums\MigrationCommandsEnum;
use Strides\Module\Exceptions\MigrationException;

class Migrator
{

    public function __construct(
        private readonly ?string                      $moduleName,
        private readonly MigrationCommandsEnum        $command,
        private readonly MigrationFacadeInterface     $facade,
        private readonly MigrationInfoFacadeInterface $infoFacade
    )
    {}

    /**
     * Migration Command Handler.
     *
     * @param array $options An array of options specific to the executed migration command.
     * @return string The result of executing migration actions as a string.
     * @throws ErrorException
     */

    public function handle(array $options): string
    {
        $filteredOptions = $this->getOptions($options);
        $message = '';
        foreach ($filteredOptions as $option) {
            $message = $this->getMessage($option, $message);
        }
        return $message;
    }


    /**
     * Get options based on the current migration command.
     *
     * @param array $options The array of options passed to the migration command.
     * @return array An array of filtered options relevant to the current migration command.
     */
    private function getOptions(array $options): array
    {
        return match ($this->command) {
            MigrationCommandsEnum::rollback => $this->facade->getRollbackOption($this->moduleName, $options),
            MigrationCommandsEnum::seed => $this->facade->getSeedOption($this->moduleName, $options),
            MigrationCommandsEnum::refresh => $this->facade->getRefreshOption($this->moduleName, $options),
            default => $this->facade->getOption($this->moduleName, $options)
        };

    }


    /**
     * Execute the appropriate action based on the current migration command.
     *
     * @param array $option The options array specific to the executed migration command.
     * @return string The output of the executed action as a string.
     */
    private function action(array $option): string
    {
        return match ($this->command) {
            MigrationCommandsEnum::run => $this->run($option),
            MigrationCommandsEnum::rollback => $this->rollback($option),
            MigrationCommandsEnum::status => $this->status($option),
            MigrationCommandsEnum::reset => $this->reset($option),
            MigrationCommandsEnum::refresh => $this->refresh($option),
            MigrationCommandsEnum::seed => $this->seed($option),
        };
    }

    private function run(array $option): string
    {
        $this->facade->validate('--path', $option);
        Artisan::call('migrate', $option);
        return Artisan::output();
    }


    private function rollback(array $option): string
    {
        $this->facade->validate('--path', $option);
        Artisan::call('migrate:rollback', $option);
        return Artisan::output();
    }


    private function status(array $option): string
    {
        $this->facade->validate('--path', $option);
        Artisan::call('migrate:status', $option);
        return Artisan::output();
    }


    private function reset(array $option): string
    {
        $this->facade->validate('--path', $option);
        Artisan::call('migrate:reset', $option);
        return Artisan::output();
    }


    /**
     * Seed the database based on the provided options.
     *
     * @param array $option The options array provided to the seed command.
     * @return string The output of the 'db:seed' command as a string.
     * @throws MigrationException|FileNotFoundException If validation fails or the table does not exist during the seeding operation.
     */
    private function seed(array $option): string
    {
        $this->facade->validate('--class', $option);

        $tableName = $this->facade->getTablename($this->moduleName, $option);

        if (!$this->facade->tableExists($tableName)) {
            $path = dirname(str_replace('\\', DIRECTORY_SEPARATOR, $option['--class']), 2) . DIRECTORY_SEPARATOR . 'Migrations';
            Artisan::call('migrate', ['--path' => $path]);
        }

        Artisan::call('db:seed', $option);
        return Artisan::output();
    }


    /**
     * Refresh the migrations and optionally seed the database based on the provided options.
     *
     * @param array $option The options array provided to the refresh command.
     * @return string A concatenated message containing the output of reset, run, and seed commands.
     * @throws MigrationException|FileNotFoundException If validation fails during the refresh operation.
     */
    private function refresh(array $option)
    {
        $message = '';
        $path = $option['--path'] ?? str_replace('\\', DIRECTORY_SEPARATOR, $option['--class']);
        $resetOption = [
            '--path' => dirname($path, 2) . DIRECTORY_SEPARATOR . "Migrations",
            '--force' => $option['--force'] ?? false
        ];
        $seedOption = [
            '--class' => $option['--class'],
            '--force' => $option['--force'] ?? false
        ];

        if (array_key_exists('--seed', $option)) {
            $message .= $this->reset($resetOption);
            $message .= $this->run($resetOption);
            $message .= $this->seed($seedOption);
        } elseif (array_key_exists('--path', $option)) {
            $message .= $this->reset($resetOption);
            $message .= $this->run($resetOption);
        }

        return $message;
    }

    /**
     * Get a message with information about the performed action.
     *
     * @param mixed $option The options specific to the executed migration command.
     * @param string $message The current message string.
     * @return string The updated message string with information about the action.
     * @throws ErrorException
     */
    private function getMessage(mixed $option, string $message): string
    {
        $info = $this->action($option);
        if ($this->moduleName) {
            $message .= $this->infoFacade->getInfo($info, $this->moduleName);
        } else {
            $message .= $this->infoFacade->getInfo($info, $this->facade->getModuleNameByOption($option));
        }
        return $message;
    }
}
