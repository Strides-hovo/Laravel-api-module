<?php

declare(strict_types=1);

namespace Strides\Module\Commands\Migration;

use Illuminate\Console\Command;
use Strides\Module\Contracts\MigrationFacadeInterface;
use Strides\Module\Contracts\MigrationInfoFacadeInterface;
use Strides\Module\Enums\MigrationCommandsEnum;
use Strides\Module\Migrator;

abstract class BaseActionCommand extends Command
{

    abstract protected function getMigrationCommand(): MigrationCommandsEnum;


    /**
     * Выполняет команду.
     */
    public function handle()
    {
        try {
            $options = array_filter($this->options(), fn($v) => $v);

            $migratorFacade = app(MigrationFacadeInterface::class, ['command' => $this->getMigrationCommand()]);
            $migratorInfo = app(MigrationInfoFacadeInterface::class, ['command' => $this->getMigrationCommand()]);
            $migrator = app(Migrator::class, [
                'moduleName' => $this->argument('moduleName'),
                'command' => $this->getMigrationCommand(),
                'facade' => $migratorFacade,
                'infoFacade' => $migratorInfo,
            ]);

            $message = $migrator->handle($options);
            return $this->comment($message);
        } catch (\Throwable $e) {
            $this->renderException($e);
            $this->error($e->getMessage());
        }
    }

    private function renderException(\Throwable $e)
    {
        $info = str_repeat('*', 20) . ' (Command ' . $this->getMigrationCommand()->name . ') ' . $e->getMessage() . ' ' . str_repeat('*', 20);
        \Log::error($e->getTraceAsString() . $info);
    }


}
