<?php

namespace tests\Unit;

use Illuminate\Support\ServiceProvider;
use Strides\Module\Facades\ModuleFacade;
use Strides\Module\Tests\TestCase;

class ProviderTest extends TestCase
{

    // vendor/bin/phpunit tests/Unit/ProviderTest.php --filter test_provider_exists


    public function test_provider_exists()
    {
        $providers = ModuleFacade::getModuleProviderClasses();
        foreach ($providers as $className) {
            // Создаем свежий экземпляр приложения
            $app = $this->createApplication();

            // Связываем экземпляр приложения с контейнером
            $app->instance('app', $app);

            // Удостоверимся, что экземпляр приложения связан для разрешения зависимостей
            $provider = $app->make($className, ['app' => $app]);
            $this->assertInstanceOf(ServiceProvider::class, $provider);
        }
        $this->assertTrue(true);
    }

}
