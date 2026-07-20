<?php

namespace Strides\Module\Tests\Unit\Commands\Action;

use ReflectionException;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Tests\AssertsGeneratedModules;
use Strides\Module\Tests\TestCase;

class MakeActionTest extends TestCase
{
    use AssertsGeneratedModules;

    /**
     * @throws ReflectionException
     */
    public function test_create_action()
    {
        $moduleName = 'Category';
        $fileName = 'CategoryAction';

        $this->clearModule($moduleName);

        $this->artisan('module:make-action', [
            'moduleName' => $moduleName,
        ]);

        $this->assertClassExists(BuilderKeysEnum::action, $moduleName, $fileName, [
            'handle' => [],
        ]);
    }

    /**
     * @throws ReflectionException
     */
    public function test_create_action_by_name()
    {
        $moduleName = 'Category';
        $fileName = 'PostHandler';

        $this->clearModule($moduleName);

        $this->artisan('module:make-action', [
            'moduleName' => $moduleName,
            'fileName' => $fileName,
        ]);

        $this->assertClassExists(BuilderKeysEnum::action, $moduleName, $fileName, [
            'handle' => [],
        ]);
    }
}
