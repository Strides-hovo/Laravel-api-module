<?php

declare(strict_types=1);

namespace Strides\Module\Tests\Unit\Commands\Model;

use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;
use Strides\Module\Tests\AssertsGeneratedModules;
use Strides\Module\Tests\TestCase;

class MakeEmptyTest extends TestCase
{
    // use AssertsGeneratedModules;

    /**
     * @runInSeparateProcess
     *
     * @preserveGlobalState disabled
     * */
    public function test_create_by_module_name()
    {

        $moduleName = 'Category';
        $fileName = 'Category';

        $this->clearModule($moduleName);

        $this->artisan('module:make-model', [
            'moduleName' => $moduleName,
        ]);

        $this->assertModelCreated($moduleName, $fileName);
    }

    public function test_create_by_file_name()
    {
        $moduleName = 'Category';
        $fileName = 'Product';

        $this->clearModule($moduleName);

        $this->artisan('module:make-model', [
            'moduleName' => $moduleName,
            'fileName' => $fileName,
        ]);

        $this->assertModelCreated($moduleName, $fileName);
    }

    private function assertModelCreated(string $moduleName, string $fileName): void
    {
        $path = $this->getFilePath(BuilderKeysEnum::model, $moduleName, $fileName);

        $this->assertFileExists($path);

        require_once $path;

        $namespace = ModuleHelper::namespace($moduleName, BuilderKeysEnum::model, $fileName);
        $this->assertTrue(class_exists($namespace), "Class {$namespace} was not found or is invalid.");
    }
}
