<?php

declare(strict_types=1);

namespace Strides\Module\Commands\Module;

use Illuminate\Console\Command;
use Strides\Module\Facades\Module;
use Strides\Module\ModuleHelper;

class ModuleListCommand extends Command
{
    protected $name = 'module:list';
    protected $description = 'List Modules';

    public function handle(): int
    {

        $all = Module::all();

        if (empty($all)) {
            $this->warn('No modules registered. Run <info>php artisan module:make-module {name}</info> to create one.');

            return self::FAILURE;
        }

        $rows = [];
        foreach ($all as $name => $enabled) {
            $modulePath = ModuleHelper::module($name);
            $pathExists = is_dir($modulePath);

            $rows[] = [
                $name,
                $enabled ? '<info>Enabled</info>' : '<comment>Disabled</comment>',
                $pathExists ? '<info>✓</info>' : '<error>✗ Missing</error>',
                $modulePath,
            ];
        }

        $this->table(
            ['Module', 'Status', 'Path exists', 'Path'],
            $rows
        );

        $total = count($all);
        $enabled = count(array_filter($all, fn ($v) => $v === true));
        $missing = count(array_filter($rows, fn ($r) => str_contains($r[2], 'Missing')));

        $this->newLine();
        $this->line("Total: <info>{$total}</info>  Enabled: <info>{$enabled}</info>  Disabled: <comment>" . ($total - $enabled) . '</comment>' . ($missing ? "  <error>Missing: {$missing}</error>" : ''));

        if ($missing > 0) {
            $this->newLine();
            $this->warn('Some module directories are missing. Run <info>php artisan module:optimize</info> to clean up.');
        }

        return self::SUCCESS;
    }
}
