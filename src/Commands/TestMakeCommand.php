<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Enums\BuilderKeysEnum;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class TestMakeCommand extends BaseCommand
{
    protected $name = 'module:make-test';
    protected $description = 'Create Test';
    protected BuilderKeysEnum $generatorKey;
    protected BuilderClassNameEnum $buildEnum;
    protected string $type;


    /**
     * @throws BindingResolutionException
     */
    public function handle(): int
    {
        $this->setEnums();
        parent::handle();

        if (!$this->showConfirm('Test')) {
            $this->warn('Created Test canceled.');
            return self::FAILURE;
        }


        if (!in_array($this->type, ['unit', 'feature'])) {
            $this->error("Invalid test type! Use 'unit' or 'feature'.");
            return self::FAILURE;
        }

        $statuses = $this->director->generateComponent($this->buildEnum, $this->data);

        foreach ($statuses as $status) {
            $this->line('Created: <info>' . $status . '</info>');
        }

        return self::SUCCESS;
    }


    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a factory with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a factory with this name.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['type', 't', InputOption::VALUE_OPTIONAL, 'The test type (unit or feature)', 'unit'],
        ];
    }


    private function setEnums()
    {
        $this->type = $this->option('type') ?? 'unit';

        if ($this->type === 'unit') {
            $this->generatorKey = BuilderKeysEnum::unit_test;
            $this->buildEnum = BuilderClassNameEnum::UNIT_TEST;
        } else {
            $this->generatorKey = BuilderKeysEnum::feature_test;
            $this->buildEnum = BuilderClassNameEnum::FEATURE_TEST;
        }
    }

    public function handleCommand(): int
    {
        return self::SUCCESS;
    }
}
