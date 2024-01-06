<?php

namespace Strides\Module\Facades\Migration;

use Strides\Module\Contracts\MigrationInfoFacadeInterface;
use Strides\Module\Enums\MigrationCommandsEnum;

class MigrationInfoFacade implements MigrationInfoFacadeInterface
{

    public function __construct(private readonly MigrationCommandsEnum $command)
    {
    }

    /**
     * Создает соабшение зависимо от резултата комад миграции
     */
    public function getInfo(string $output, string $moduleName): string
    {

        if (str_contains($output, 'Nothing to')) {
            return $this->getError($moduleName) . "\n";
        } elseif (str_contains($output, '(')) {
            return $output . "\n";
        } elseif (str_contains($output, 'migrations')) {
            return $this->getSuccess($moduleName) . "\n";
        } elseif (str_contains($output, 'Seeding')) {
            return $this->getSuccess($moduleName) . "\n";
        }
        return $output . " {$moduleName} \n";
    }


    /**
     * Возвращает сообщение об успешном выполнении операции миграции
     */
    private function getSuccess(string $moduleName): string
    {
        $action = $this->command->value;
        return $moduleName ? $action . " Migration for module: <info> {$moduleName} </info>" : $action . ' Migration for all modules';
    }


    /**
     * Возвращает сообщение о том, что нет миграций для выполнения.
     */
    private function getError(string $moduleName): string
    {
        $action = $this->command->value;
        return $moduleName ? "Nothing to {$action} for module: <info> {$moduleName} </info>" : 'INFO  Nothing to migrate.';

    }
}
