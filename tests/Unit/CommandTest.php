<?php


namespace tests\Unit;

use Illuminate\Support\Facades\Artisan;
use Strides\Module\Tests\TestCase;

class CommandTest extends TestCase
{


    // vendor/bin/phpunit tests/Unit/CommandTest.php --filter test_controller_create_command

    public function test_controller_create_command()
    {
        $args = [
            'moduleName' => 'Category',
            'fileName' => 'alter_table_posts',
            '--request' => true,
            '--resource' => true,
            '--collection' => true,
            '--repository' => true,
            '--model' => true,

        ];
        $result = Artisan::call('module:make-controller', $args);


    }

}
