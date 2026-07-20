<?php

namespace Strides\Module\Tests\Unit\Commands\Repository;

use ReflectionException;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Tests\AssertsGeneratedModules;
use Strides\Module\Tests\TestCase;

class MakeRepositoryTest extends TestCase
{
    use AssertsGeneratedModules;

    /**
     * @throws ReflectionException
     */
    public function test_create_repository()
    {
        $moduleName = 'Category';
        $fileName = 'CategoryRepository';

        $this->clearModule($moduleName);

        $this->artisan('module:make-repository', [
            'moduleName' => $moduleName,
        ]);

        $this->assertClassExists(BuilderKeysEnum::repository, $moduleName, $fileName, [
            'query' => [],
        ]);
    }

    /**
     * @throws ReflectionException
     */
    public function test_create_repository_by_name()
    {
        $moduleName = 'Category';
        $fileName = 'PostHandler';

        $this->clearModule($moduleName);

        $this->artisan('module:make-repository', [
            'moduleName' => $moduleName,
            'fileName' => $fileName,
        ]);

        $this->assertClassExists(BuilderKeysEnum::repository, $moduleName, $fileName, [
            'query' => [],
        ]);
    }
}
