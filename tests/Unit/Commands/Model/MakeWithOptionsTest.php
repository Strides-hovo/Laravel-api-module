<?php

declare(strict_types=1);

namespace Strides\Module\Tests\Unit\Commands\Model;

use ReflectionException;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Factories\FileNameFactory;
use Strides\Module\ModuleHelper;
use Strides\Module\Tests\AssertsGeneratedModules;
use Strides\Module\Tests\TestCase;

class MakeWithOptionsTest extends TestCase
{

    use AssertsGeneratedModules;


    /**
     * @runInSeparateProcess
     * @preserveGlobalState disabled
     *
     * @throws ReflectionException
     */
    public function test_create_with_service()
    {

        $moduleName = 'Category';
        $fileName = 'Category';

        $this->clearModule($moduleName);

        $this->artisan('module:make-model', [
            'moduleName' => $moduleName,
            '--request' => true,
            '--controller' => true,
            '--service' => true,
            '--resource' => true
        ]);

        $requestName = $moduleName . 'Request';
        $serviceName = $moduleName . 'Service';

        $requestNamespace = ModuleHelper::namespace($moduleName, BuilderKeysEnum::request, $requestName);
        $serviceNamespace = ModuleHelper::namespace($moduleName, BuilderKeysEnum::service, $serviceName);

        $this->assertClassExists(BuilderKeysEnum::model, $moduleName, $fileName);
        $this->assertClassExists(BuilderKeysEnum::resource, $moduleName, $fileName . 'Resource');
        $this->assertClassExists(BuilderKeysEnum::controller, $moduleName, $fileName .'Controller', [
            'index' => [$requestNamespace, $serviceNamespace ],
            'store' => [$requestNamespace, $serviceNamespace ],
            'update' => ['string|int', $requestNamespace, $serviceNamespace ],
            'destroy' => ['string|int', $serviceNamespace],
        ]);
    }


    /**
     * @throws ReflectionException
     */
    public function test_create_with_actions()
    {
        $moduleName = 'Category';
        $fileName = 'Product';

        $this->clearModule($moduleName);

        $this->artisan('module:make-model', [
            'moduleName' => $moduleName,
            'fileName' => $fileName,
            '--migration' => true,
            '--request' => true,
            '--action' => true,
            '--transformer' => true,
            '--test' => true,
        ])->assertOk();

        $this->assertClassExists(BuilderKeysEnum::model, $moduleName, $fileName);
        $this->assertClassExists(BuilderKeysEnum::transformer, $moduleName, $fileName . 'Transformer');
        $this->assertClassExists(BuilderKeysEnum::unit_test, $moduleName, $fileName . 'Test');
        $this->assertClassExists(BuilderKeysEnum::action, $moduleName, 'IndexAction');

    }


}
