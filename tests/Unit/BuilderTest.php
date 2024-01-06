<?php

namespace tests\Unit;

use Exception;
use Strides\Module\Builders\ControllerBuilder;
use Strides\Module\Tests\TestCase;

class BuilderTest extends TestCase
{
    // vendor/bin/phpunit tests/Unit/BuilderTest.php --filter test_controller_builder
    /**
     * @throws Exception
     */
    public function test_controller_builder()
    {
        $builder = new ControllerBuilder('Admin/Category');
        $contents = $builder->getContents();
        $this->assertIsArray($contents);
        $this
            ->_ArrayHasKey('controller', $contents)
            ->_ArrayHasKey('directory', $contents['controller'])
            ->_ArrayHasKey('fileName', $contents['controller'])
            ->_ArrayHasKey('template', $contents['controller'])
            ->_ArrayHasKey('replacements', $contents['controller']);
    }


    /**
     * @throws Exception
     */
    public function test_controller_builder_by_name()
    {
        $builder = new ControllerBuilder('Category', 'CategoriesController');
        $content = $builder->getContents();
        $this->assertIsArray($content);
    }

    /**
     * @throws Exception
     */
    public function test_controller_builder_by_relations()
    {
        $builder = new ControllerBuilder(
            'Category',
            null,
            ['request' => true]
        );
        $content = $builder->getContents();
        $this->assertIsArray($content);
    }
}
