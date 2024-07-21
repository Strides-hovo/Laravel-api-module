<?php


namespace Strides\Module\Tests\Unit;

use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\ModuleFactory;
use Strides\Module\Tests\TestCase;

class ControllerTest extends TestCase
{

    // vendor/bin/phpunit tests/Unit/ControllerTest.php --filter test_create_controller


    /**
     * @throws BuilderException
     */
    public function test_create_controller()
    {
        $args = [
            'moduleName' => 'Category',
            'fileName' => 'PostController',
            'replacements' => ['request' => true],
        ];
        $contents = ModuleFactory::build(BuilderClassNameEnum::CONTROLLER, $args);
        $this->assertIsArray($contents);
        $this->assertArrayHasKey('controller', $contents);
        $this->keysExists([
            'directory', 'fileName', 'template', 'replacements'
        ], $contents['controller']);
        $this->assertStringContainsString('Category', $contents['controller']['fileName']);
        $this->assertStringContainsString('PostController', $contents['controller']['fileName']);

    }


    /**
     * @throws BuilderException
     */
    public function test_create_controller_request(): void
    {
        $args = [
            'moduleName' => 'Category',
            'replacements' => [
                'request' => true,
                'resource' => true,
                'collection' => true,
                'repository' => true,
                'model' => true,
            ],
        ];
        $contents = ModuleFactory::build(BuilderClassNameEnum::CONTROLLER, $args);
        $this->assertIsArray($contents);
        $this->assertArrayHasKey('controller', $contents);
        $this->keysExists([
            'directory', 'fileName', 'template', 'replacements'
        ], $contents['controller']);
        $this->keysExists([
            'request', 'resource', 'repository', 'model', 'collection'
        ], $contents['controller']['replacements']);
    }


    /**
     * @throws BuilderException
     */
    public function test_create_controller_all()
    {
        $args = [
            'moduleName' => 'Category',
            'fileName' => 'PostController',
            'replacements' => [
                'all' => true,
            ],
        ];
        $contents = ModuleFactory::build(BuilderClassNameEnum::CONTROLLER, $args);
        $this->assertIsArray($contents);
        $this->assertArrayHasKey('controller', $contents);
        $this->keysExists([
            'directory', 'fileName', 'template', 'replacements'
        ], $contents['controller']);
        $this->keysExists([
            'request', 'resource', 'repository', 'model', 'collection'
        ], $contents['controller']['replacements']);
    }


    /**
     * @throws BuilderException
     */
    public function test_create_controller_argument_error()
    {
        $this->expectException(\ArgumentCountError::class);
        $args = [
            'fileName' => 'PostController',
        ];
        ModuleFactory::build(BuilderClassNameEnum::CONTROLLER, $args);
    }

    /**
     * @throws BuilderException
     */
    public function test_resource_addBuilder_collection()
    {
        $args = [
            'moduleName' => 'Category',
            'fileName' => 'PostController',
            'replacements' => [
                'resource' => true,
            ],
        ];
        $contents = ModuleFactory::build(BuilderClassNameEnum::CONTROLLER, $args);
        $this->assertIsArray($contents);
        $this->assertArrayHasKey('controller', $contents);
        $this->assertArrayHasKey('resource', $contents);
        $this->assertArrayHasKey('collection', $contents);
    }
}
