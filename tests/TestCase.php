<?php

declare(strict_types=1);

namespace Strides\Module\Tests;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\File;
use Orchestra\Testbench\TestCase as BaseTest;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;
use Strides\Module\Providers\ModuleServiceProvider;

abstract class TestCase extends BaseTest
{
    protected const MODULE_NAME = 'Blog';

    protected function setUp(): void
    {
        parent::setUp();
        $this->refreshApplication();
    }

    /**
     * @param  Application  $app
     * @return array<int, class-string>
     */
    protected function getPackageProviders($app): array
    {
        return [
            ModuleServiceProvider::class,
        ];
    }

    /**
     * @param  Application  $app
     */
    protected function getEnvironmentSetUp($app): void
    {
        $app['config']->set('database.default', 'testbench');
        $app['config']->set('database.connections.testbench', [
            'driver' => 'sqlite',
            'database' => ':memory:',
            'prefix' => '',
        ]);
    }

    protected function clearModule(string $moduleName): void
    {
        $jsonFile = base_path('modules_name.json');
        File::put($jsonFile, json_encode([]));

        $modelDir = ModuleHelper::module($moduleName);

        if (File::isDirectory($modelDir)) {
            File::deleteDirectory($modelDir);
        }
    }

    protected function getFilePath(BuilderKeysEnum $key, string $moduleName, string $fileName): string
    {
        $modulePath = ModuleHelper::module($moduleName);
        $generatorPath = ModuleHelper::generator($key);

        return ModuleHelper::normalizePath(
            $modulePath.DIRECTORY_SEPARATOR.$generatorPath.DIRECTORY_SEPARATOR.$fileName.'.php'
        );
    }
}
