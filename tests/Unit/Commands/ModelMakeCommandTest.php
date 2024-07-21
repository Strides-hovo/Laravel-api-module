<?php

namespace Strides\Module\Tests\Unit\Commands;

use Strides\Module\Tests\TestCase;

class ModelMakeCommandTest extends TestCase
{

    protected const FILENAME = 'Brother';


    public function test_create_new_model(){
        $this->clearModule();

        $this->artisan('module:make-model', [
            'moduleName' => self::MODULE_NAME,
        ])->expectsOutputToContain( self::MODULE_NAME)
            ->assertExitCode(0);
    }


    public function test_create_new_model_by_name(){
        $this->clearModule();

        $this->artisan('module:make-model', [
            'moduleName' => self::MODULE_NAME,
            'fileName' => self::FILENAME,
        ])
            ->expectsOutputToContain( self::FILENAME)
            ->assertExitCode(0);

    }

    public function test_update_model(){
        $this->clearModule();
        $this->artisan('module:make-model', [
            'moduleName' => self::MODULE_NAME,
        ]);
        $this->artisan('module:make-model', [
            'moduleName' => self::MODULE_NAME,
        ])
            ->expectsQuestion('Такой Модель уже существует, вы хотите перезаписать Модель в ' . self::MODULE_NAME . ' ?', 'yes')
            ->assertExitCode(0);
    }


    public function test_update_model_by_name(){
        $this->clearModule();
        $this->artisan('module:make-model', [
            'moduleName' => self::MODULE_NAME,
            'fileName' => self::FILENAME,
        ]);
        $this->artisan('module:make-model', [
            'moduleName' => self::MODULE_NAME,
            'fileName' => self::FILENAME,
        ])
            ->expectsQuestion('Такой Модель уже существует, вы хотите перезаписать Модель в ' . self::MODULE_NAME . ' ?', 'yes')
            ->assertExitCode(0);
    }

}