<?php


namespace Strides\Module\Tests\Unit;

use Illuminate\Support\Facades\Config;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\Exceptions\FileGeneratorException;
use Strides\Module\ModuleDirector;
use Strides\Module\Tests\TestCase;

class ModuleTest extends TestCase
{


    // vendor/bin/phpunit tests/Unit/ModuleTest.php --filter test_create_module


    /**
     * @throws FileGeneratorException
     * @throws BuilderException
     */
    public function test_create_module()
    {
        //dd(2);
        $args = [
            'moduleName' => 'Category',
        ];
        $generators = Config::get("module.paths.generator");
        $generators = [
            'model' => ['path' => 'Entities', 'generate' => true],
            'migration' => ['path' => 'Database/Migrations', 'generate' => true],
            'seeder' => ['path' => 'Database/Seeders', 'generate' => true],
            'factory' => ['path' => 'Database/Factories', 'generate' => true],
            'http' => ['path' => '/', 'generate' => true],
            'route' => ['path' => 'Routes', 'generate' => true],
            'route_service_provider' => ['path' => 'Providers', 'generate' => true],
            'service_provider' => ['path' => 'Providers', 'generate' => true],
        ];

        $contents = ModuleDirector::module($args, $generators);
        $this->assertIsArray($contents);

    }


}
