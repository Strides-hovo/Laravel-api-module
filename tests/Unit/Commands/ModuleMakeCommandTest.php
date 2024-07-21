<?php

namespace Strides\Module\Tests\Unit\Commands;

use Illuminate\Support\Facades\File;
use Strides\Module\Tests\TestCase;

class ModuleMakeCommandTest extends TestCase
{


    public function test_create_new_module()
    {
        $this->clearModule();

        $this->artisan('module:make-module', [
            'moduleName' => self::MODULE_NAME,
        ])->assertExitCode(0);

        $this->checkFiles();
    }


    public function test_update_exists_module()
    {
        $this->artisan('module:make-module', [
            'moduleName' => self::MODULE_NAME,
        ])
            ->expectsQuestion('Такой Модуль уже существует, вы хотите перезаписать Модуль в ' . self::MODULE_NAME . ' ?', 'yes')
            ->assertExitCode(0);

        $this->checkFiles();

    }

    private function checkFiles(): void
    {
        // Проверка существования файла modules_name.json
        $jsonFile = base_path('modules_name.json');
        $this->assertFileExists($jsonFile);

        // Проверка существования запис о модулье в modules_name.json
        $jsonContent = json_decode(File::get($jsonFile), true);
        $this->assertArrayHasKey(self::MODULE_NAME, $jsonContent);

        // Проверка существования папки модуля
        $modulePath = base_path(self::MODULE_DIR);
        $this->assertDirectoryExists($modulePath);
    }
}