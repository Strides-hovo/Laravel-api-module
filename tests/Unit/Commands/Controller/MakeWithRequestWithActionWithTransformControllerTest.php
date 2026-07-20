<?php

declare(strict_types=1);

namespace Strides\Module\Tests\Unit\Commands\Controller;

use Illuminate\Support\Str;
use ReflectionException;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;
use Strides\Module\Tests\AssertsGeneratedModules;
use Strides\Module\Tests\TestCase;

/**
 * Testing file exists| class exists | method exists| parameters exists
 */
class MakeWithRequestWithActionWithTransformControllerTest extends TestCase
{
    use AssertsGeneratedModules;

    /**
     * @throws ReflectionException
     * @runInSeparateProcess
     * @preserveGlobalState disabled
     */
    public function test_create_by_module_name()
    {
        $moduleName = 'Category';
        $fileName = 'CategoryController';
        $requestName = Str::replaceLast('Controller', 'Request', $fileName);
        $actionIndexName = Str::replaceLast('Controller', 'IndexAction', $fileName);
        $transformerName = Str::replaceLast('Controller', 'Transformer', $fileName);

        $this->clearModule($moduleName);

        $this->artisan('module:make-controller', [
            'moduleName' => $moduleName,
            '--request' => true,
            '--action' => true,
            '--transformer' => true,
        ]);

        $this->assertClassExists(BuilderKeysEnum::controller, $moduleName, $fileName);
        $this->assertClassExists(BuilderKeysEnum::request, $moduleName, $requestName);
        $this->assertClassExists(BuilderKeysEnum::action, $moduleName, $actionIndexName);
        $this->assertClassExists(BuilderKeysEnum::transformer, $moduleName, $transformerName);

    }

    /**
     * @throws ReflectionException
     * @runInSeparateProcess
     * @preserveGlobalState disabled
     */
    public function test_create_by_file_name_in_blog_module()
    {

        $moduleName = 'Category';
        $fileName = 'PostController';
        $requestName = Str::replaceLast('Controller', 'Request', $fileName);
        $actionIndexName = Str::replaceLast('Controller', 'IndexAction', $fileName);
        $actionStoreName = Str::replaceLast('Controller', 'StoreAction', $fileName);
        $actionUpdateName = Str::replaceLast('Controller', 'UpdateAction', $fileName);
        $actionDestroyName = Str::replaceLast('Controller', 'DestroyAction', $fileName);
        $transformerName = Str::replaceLast('Controller', 'Transformer', $fileName);

        $requestNamespace = ModuleHelper::namespace($moduleName, BuilderKeysEnum::request, $requestName);
        $actionIndexNamespace = ModuleHelper::namespace($moduleName, BuilderKeysEnum::action, $actionIndexName);
        $actionStoreNamespace = ModuleHelper::namespace($moduleName, BuilderKeysEnum::action, $actionStoreName);
        $actionUpdateNamespace = ModuleHelper::namespace($moduleName, BuilderKeysEnum::action, $actionUpdateName);
        $actionDestroyNamespace = ModuleHelper::namespace($moduleName, BuilderKeysEnum::action, $actionDestroyName);

        $this->clearModule($moduleName);

        $this->artisan('module:make-controller', [
            'moduleName' => $moduleName,
            'fileName' => $fileName,
            '--request' => true,
            '--action' => true,
            '--transformer' => true,
        ]);

        /** Controller */
        $this->assertClassExists(BuilderKeysEnum::controller, $moduleName, $fileName, [
            'index' => [$requestNamespace, $actionIndexNamespace],
            'store' => [$requestNamespace, $actionStoreNamespace],
            'update' => ['string|int', $requestNamespace, $actionUpdateNamespace],
            'destroy' => ['string|int', $actionDestroyNamespace],
        ]);

        /** Request */
        $this->assertClassExists(BuilderKeysEnum::request, $moduleName, $requestName, [
            'rules' => [],
            'authorize' => [],
        ]);

        /** Actions */
        $this->assertClassExists(BuilderKeysEnum::action, $moduleName, $actionIndexName, [
            'handle' => ['array'],
        ]);

        $this->assertClassExists(BuilderKeysEnum::action, $moduleName, $actionStoreName, [
            'handle' => ['array'],
        ]);

        $this->assertClassExists(BuilderKeysEnum::action, $moduleName, $actionUpdateName, [
            'handle' => ['string|int','array'],
        ]);

        $this->assertClassExists(BuilderKeysEnum::action, $moduleName, $actionDestroyName, [
            'handle' => ['string|int'],
        ]);

        /** Transformer */
        $this->assertClassExists(BuilderKeysEnum::transformer, $moduleName, $transformerName, [
            'transformModel' => [''],
        ]);
    }
}
