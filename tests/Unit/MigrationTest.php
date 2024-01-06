<?php

namespace Strides\Module\Tests\Unit;


use Illuminate\Support\Facades\Artisan;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\Exceptions\FileGeneratorException;
use Strides\Module\ModuleDirector;
use Strides\Module\ModuleFactory;
use Strides\Module\Tests\TestCase;

class MigrationTest extends TestCase
{

    // vendor/bin/phpunit tests/Unit/MigrationTest.php --filter test_migration_run

    /**
     * @throws BuilderException
     */
    public function test_create_migration_build()
    {
        $args = [
            'moduleName' => 'Category',
            'fileName' => 'alter_table_posts',
        ];

        $contents = ModuleFactory::build(BuilderClassNameEnum::MIGRATION, $args);
        $this->assertIsArray($contents);
        $this->assertArrayHasKey('migration', $contents);


    }


    /**
     * @throws FileGeneratorException
     * @throws BuilderException
     */
    public function test_create_migration_file()
    {
        $args = [
            'moduleName' => 'Category',
            'fileName' => 'alter_table_posts',
        ];

        $statuses = ModuleDirector::create(BuilderClassNameEnum::MIGRATION, $args);
        $this->assertIsArray($statuses);
        preg_match('/\[([^\]]+)\]/', $statuses[0], $f);
        $file = $f[1];
        $this->assertFileExists($file);

    }


    private function create_migration()
    {
        $args = [
            'moduleName' => 'Category',
            'fileName' => 'create_categories_table',
        ];

        return ModuleDirector::create(BuilderClassNameEnum::MIGRATION, $args);

    }

    public function test_migration_run()
    {
        $status = $this->create_migration();

        dump($status);

        $args = [
            'moduleName' => 'Category',
            '--force' => true,
        ];

//        Artisan::call('module:migrate', $args);
//        $result = Artisan::output();
//
//        dd($result);
        $this->assertTrue(true);

    }


    public function test_console_migration()
    {
        $args = [
            'moduleName' => 'Category',
            '--force' => null,
            '--seed' => true
        ];
        $result = Artisan::call('module:migrate', $args);

        dd($result);


        $this->assertIsInt($result);
    }


}
