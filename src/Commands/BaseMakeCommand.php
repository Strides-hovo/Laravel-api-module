<?php

namespace Strides\Module\Commands;

use Illuminate\Console\Command;

class BaseMakeCommand extends Command
{

    protected array $data;

    public function handle(): void
    {
        $moduleName = $this->argument('moduleName');
        $fileName = $this->argument('fileName');
        $replacements = array_filter($this->options(), fn($option) => $option);

        $this->data = array_filter(
            compact('moduleName', 'fileName', 'replacements'),
            fn($v) => $v
        );
    }
}
