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
class MakeWithRequestWithServiceControllerTest extends TestCase
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
        $serviceName = Str::replaceLast('Controller', 'Service', $fileName);

        $this->clearModule($moduleName);

        $this->artisan('module:make-controller', [
            'moduleName' => $moduleName,
            '--request' => true,
            '--service' => true,
        ]);

        $this->assertClassExists(BuilderKeysEnum::controller, $moduleName, $fileName);
        $this->assertClassExists(BuilderKeysEnum::request, $moduleName, $requestName);
        $this->assertClassExists(BuilderKeysEnum::service, $moduleName, $serviceName);

    }

    /**
     * @throws ReflectionException
     * @runInSeparateProcess
     * @preserveGlobalState disabled
     */
    public function test_create_by_file_name_in_blog_module()
    {
        // Здесь используем совершенно другой модуль, и PhpStorm запустит его без проблем
        $moduleName = 'Blog';
        $fileName = 'CustomController';
        $requestName = Str::replaceLast('Controller', 'Request', $fileName);
        $serviceName = Str::replaceLast('Controller', 'Service', $fileName);

        $requestNamespace = ModuleHelper::namespace($moduleName, BuilderKeysEnum::request, $requestName);
        $serviceNamespace = ModuleHelper::namespace($moduleName, BuilderKeysEnum::service, $serviceName);

        $this->clearModule($moduleName);

        $this->artisan('module:make-controller', [
            'moduleName' => $moduleName,
            'fileName' => $fileName,
            '--request' => true,
            '--service' => true,
        ]);

        $this->assertClassExists(BuilderKeysEnum::controller, $moduleName, $fileName, [
            'index' => [$requestNamespace, $serviceNamespace],
            'store' => [$requestNamespace, $serviceNamespace],
            'update' => ['string|int', $requestNamespace, $serviceNamespace],
            'destroy' => ['string|int', $serviceNamespace],
        ]);

        $this->assertClassExists(BuilderKeysEnum::request, $moduleName, $requestName, [
            'rules' => [],
            'authorize' => [],
        ]);
        $this->assertClassExists(BuilderKeysEnum::service, $moduleName, $serviceName, [
            'filter' => ['array'],
            'create' => ['array'],
            'update' => ['string|int', 'array'],
            'destroy' => ['string|int'],
        ]);
    }

}
