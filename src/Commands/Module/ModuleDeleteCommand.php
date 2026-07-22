<?php

declare(strict_types=1);

namespace Strides\Module\Commands\Module;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Facades\Module;
use Strides\Module\ModuleHelper;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class ModuleDeleteCommand extends Command
{
    protected $name = 'module:delete';
    protected $description = 'Delete a module without deleting its physical files';

    private string $moduleName;

    public function handle(): int
    {
        $this->setModuleName();

        if (!Module::exists($this->moduleName)) {
            $this->error("Module [{$this->moduleName}] does not exist.");
            return self::FAILURE;
        }

        $dropDb = (bool)$this->option('db');
        $force = (bool)$this->option('force');

        $tables = [];
        if ($dropDb) {
            $dir = $this->getMigrationDir();
            $tables = $this->getTablesName($dir);
        }


        if (!$force && !$this->confirmDeletion($tables)) {
            $this->info("Module [{$this->moduleName}] deletion canceled.");
            return self::SUCCESS;
        }


        if ($dropDb && !empty($tables)) {
            $this->backup($tables);
            $this->trashTables($tables);
        }


        Module::delete($this->moduleName);

        $this->info("Module [{$this->moduleName}] deleted successfully.");
        $this->line("<comment>Note:</comment> Module files are kept. Use <info>php artisan module:make {$this->moduleName}</info> to recreate.");

        return self::SUCCESS;
    }



    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::REQUIRED, 'The name of the module to delete.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['force', 'f', InputOption::VALUE_NONE, 'Force the operation to run without confirmation prompt.'],
            ['db', null, InputOption::VALUE_NONE, 'Rollback module database migrations.'],
        ];
    }



    private function confirmDeletion(array $tables): bool
    {
        $message = "Are you sure you want to remove the module [{$this->moduleName}]?";

        if (!empty($tables)) {
            $tablesList = implode(', ', $tables);
            $message .= " Associated database tables ({$tablesList}) will be rolled back.";
        }

        return $this->confirm($message);
    }

    public function setModuleName(): void
    {
        $argument = $this->argument('moduleName');
        $this->moduleName = is_string($argument) ? Str::ucfirst($argument) : '';
    }


    private function getTablesName(string $dirPath): array
    {
        if (!File::isDirectory($dirPath)) {
            return [];
        }

        $tables = [];
        $files = File::files($dirPath);

        foreach ($files as $file) {
            if ($file->getExtension() !== 'php') {
                continue;
            }

            $content = File::get($file->getRealPath());
            $content = preg_replace('/\s+/u', ' ', $content);

            if (preg_match('/Schema\s*::\s*(?:create|table)\s*\(\s*[\'"`]([^\'"`]+)[\'"`]/i', $content, $matches)) {
                $tables[] = $matches[1];
            }
        }

        return array_unique($tables);
    }

    private function trashTables(array $tables): void
    {

        $hasExistingTables = false;
        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                $hasExistingTables = true;
                break;
            }
        }

        if ($hasExistingTables) {
            $relativePath = ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::migration);

            $this->call('migrate:rollback', [
                '--path' => $relativePath,
                '--force' => true,
            ]);
        }
    }

    private function getMigrationDir(): string
    {
        return ModuleHelper::normalizePath(
            ModuleHelper::module($this->moduleName, ModuleHelper::generator(BuilderKeysEnum::migration))
        );
    }

    private function backup(array $tables): void
    {
        foreach ($tables as $table) {
            if (!Schema::hasTable($table)) {
                continue;
            }

            $fileName = "module-backups/{$table}_" . now()->format('Y_m_d_His') . '.jsonl';

            $disk = Storage::disk('local');
            $disk->makeDirectory('module-backups');
            $fullPath = $disk->path($fileName);

            $fileHandle = fopen($fullPath, 'w');

            if ($fileHandle === false) {
                $this->error("Failed to create backup file for table: {$table}");
                continue;
            }

            foreach (DB::table($table)->cursor() as $row) {
                fwrite($fileHandle, json_encode($row, JSON_UNESCAPED_UNICODE) . PHP_EOL);
            }

            fclose($fileHandle);

            $this->info("Backup for table [{$table}] saved: storage/app/{$fileName}");
        }
    }
}