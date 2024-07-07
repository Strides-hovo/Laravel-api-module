<?php


namespace Strides\Module\Tests\Unit;

use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\ModuleFactory;
use Strides\Module\Tests\TestCase;

class ModelTest extends TestCase
{


    // vendor/bin/phpunit tests/Unit/ModelTest.php --filter test_create_model_seeder_filename_change


    /**
     * @throws BuilderException
     */
    public function test_create_model_seeder_filename_change()
    {
        $args = [
            'moduleName' => 'Admin/Category',
            'fileName' => 'Post',
            'replacements' => [
                'seeder' => true,
                'factory' => true,
                'controller' => true,
                'migration' => true,
            ],
        ];
        $contents = ModuleFactory::build(BuilderClassNameEnum::MODEL, $args);
        $this->assertIsArray($contents);
        $this->assertArrayHasKey('model', $contents);
        $this->keysExists([
            'directory', 'fileName', 'template', 'replacements'
        ], $contents['model']);
        $this->assertStringContainsString('Post', $contents['model']['fileName']);
        $this->assertStringContainsString('PostSeeder', $contents['seeder']['fileName']);
    }


    /**
     * @throws BuilderException
     */
    public function test_create_model_all()
    {
        $args = [
            'moduleName' => 'Category',
            'fileName' => 'Post',
            'replacements' => [
                'all' => true,
            ],
        ];
        $contents = ModuleFactory::build(BuilderClassNameEnum::MODEL, $args);
        $this->assertIsArray($contents);
        $this->keysExists([
            'seeder', 'factory', 'controller', 'migration'
        ], $contents);
    }

}
