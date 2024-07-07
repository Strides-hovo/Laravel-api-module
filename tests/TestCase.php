<?php

namespace Strides\Module\Tests;

use Illuminate\Support\Facades\File;
use Orchestra\Testbench\TestCase as Test;
use Strides\Module\Providers\ModuleServiceProvider;


class TestCase extends Test
{
    protected const MODULE_NAME = 'V1/Sister';
    protected const MODULE_DIR = 'Modules/' . self::MODULE_NAME;
    protected const FILENAME = 'Sister';



    public function setup(): void
    {
        parent::setUp();
        $this->refreshApplication();
    }


    protected function getPackageProviders($app): array
    {
        return [
            ModuleServiceProvider::class
        ];
    }


    protected function _ArrayHasKey(string $key, array $content): static
    {
        $this->assertArrayHasKey($key, $content);
        return $this;
    }


    protected function keysExists(array $keys, array $content): void
    {
        foreach ($keys as $key) {
            $this->assertArrayHasKey($key, $content);
        }
    }

    protected function getEnvironmentSetUp($app): void
    {
        $app['config']->set('database.default', 'testbench');
        $app['config']->set('database.connections.testbench', [
            'driver' => 'sqlite',
            'database' => ':memory',
            'prefix' => '',
        ]);
    }


    protected function clearModule(): void
    {
        $jsonFile = base_path('modules_name.json');
        File::put($jsonFile, json_encode([]));

        if (File::exists(base_path(self::MODULE_DIR))) {
            File::deleteDirectory(base_path(self::MODULE_DIR));
        }
    }
}
