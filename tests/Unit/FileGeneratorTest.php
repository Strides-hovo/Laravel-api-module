<?php


namespace Strides\Module\Tests\Unit;
use Strides\Module\Enums\BuilderClassNameEnum;use Strides\Module\Exceptions\BuilderException;use Strides\Module\Exceptions\FileGeneratorException;use Strides\Module\ModuleDirector;use Strides\Module\Tests\TestCase;

class FileGeneratorTest extends TestCase
{

    /**
     * @throws FileGeneratorException|BuilderException
     * vendor/bin/phpunit tests/Unit/FileGeneratorTest.php --filter test_create_file_model
     */
    public function test_create_file_controller(): void
    {
        $statuses = ModuleDirector::create(BuilderClassNameEnum::CONTROLLER, [
            'moduleName' => 'User',
            'fileName' => 'ProfilerSomeResaController',

        ]);

        $this->assertIsArray($statuses);
        preg_match('/\[([^\]]+)\]/', $statuses[0], $file);
        $this->assertFileExists($file[1]);
    }


    public function test_create_file_controller_byOther_replacement_filed(): void
    {
        $this->assertThrows(function () {
            ModuleDirector::create(BuilderClassNameEnum::CONTROLLER, [
                'moduleName' => 'User',
                'fileName' => 'ProfilerSomeResaController',
                'replacements' => [
                    'otherReplacement' => true
                ]
            ]);
        }, BuilderException::class);
    }


    /**
     * @throws FileGeneratorException
     * @throws BuilderException
     */
    public function test_create_file_model_all()
    {
        $statuses = ModuleDirector::create(BuilderClassNameEnum::MODEL, [
            'moduleName' => 'User',
            'fileName' => 'Profile',
            'replacements' => [
                'all' => true,
            ]
        ]);

        $this->assertIsArray($statuses);

        foreach ($statuses as $status) {
            preg_match('/\[([^\]]+)\]/', $status, $f);
            $file = $f[1];
            $this->assertFileExists($file);
        }
    }

}
