<?php

declare(strict_types=1);

namespace Strides\Module\Tests\Unit\Commands\Controller;

use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;
use Strides\Module\Tests\AssertsGeneratedModules;
use Strides\Module\Tests\TestCase;

/**
 * Testing file exists | class exists
 */
class MakeEmptyControllerTest extends TestCase
{
    use AssertsGeneratedModules;

    /**
     * @runInSeparateProcess
     *
     * @preserveGlobalState disabled
     * */
    public function test_create_by_module_name()
    {
        $moduleName = 'Category';
        $fileName = 'CategoryController';

        $this->clearModule($moduleName);

        $this->artisan('module:make-controller', [
            'moduleName' => $moduleName,
        ]);

        $this->assertControllerGenerated($moduleName, $fileName);
    }

    public function test_create_by_file_name_in_blog_module()
    {

        $moduleName = 'Blog';
        $fileName = 'CustomController';

        $this->clearModule($moduleName);

        $this->artisan('module:make-controller', [
            'moduleName' => $moduleName,
            'fileName' => $fileName,
        ]);

        $this->assertControllerGenerated($moduleName, $fileName);
    }

    /**
     * Этот метод просто инкапсулирует сложную проверку,
     * но никак не связывает тесты между собой.
     *
     * @runInSeparateProcess
     *
     * @preserveGlobalState disabled
     */
    private function assertControllerGenerated(string $moduleName, string $fileName): void
    {
        $path = $this->getFilePath(BuilderKeysEnum::controller, $moduleName, $fileName);

        // 1. Проверяем, что файл физически создался
        $this->assertFileExists($path);

        // 2. Безопасно загружаем файл (require_once не упадет, если имена совпадут)
        require_once $path;

        // 3. Проверяем валидность пространства имен и класса
        $namespace = ModuleHelper::namespace($moduleName, BuilderKeysEnum::controller, $fileName);
        $this->assertTrue(class_exists($namespace), "Класс {$namespace} не был найден или невалиден.");
    }
}
