<?php

namespace Strides\Module\Tests\Feature\Mail;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Factories\FileNameFactory;
use Strides\Module\ModuleHelper;
use Strides\Module\Providers\LoaderServiceProvider;
use Strides\Module\Tests\Feature\Feature;


/**
 * @runInSeparateProcess
 * @preserveGlobalState disabled
 */
class MakeMailTest extends Feature
{


    public function test_create_with_view(): void
    {

        $fileName = FileNameFactory::make($this->moduleName, BuilderKeysEnum::mail);

        $this->artisan('module:make-module', [
            'moduleName' => $this->moduleName,
        ])->assertOk();

        $this->artisan('module:make-mail', [
            'moduleName' => $this->moduleName,
            'fileName' => $fileName,
            '--view' => true,
            '--force' => true
        ])->assertOk();

        $file = $this->getFilePath(BuilderKeysEnum::mail, $this->moduleName, $fileName);
        $class = ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::mail, $fileName);
        $viewPath = ModuleHelper::normalizePath(ModuleHelper::module($this->moduleName, 'resources/views/mail/' . Str::kebab($fileName) . '.blade.php'));

        (new LoaderServiceProvider($this->app))->boot();

        $view = Str::lower($this->moduleName) . '::mail.' . Str::kebab($fileName);

        require $file;

        $this->assertTrue(File::exists($viewPath));
        $this->assertTrue(File::exists($file));
        $this->assertTrue(class_exists($class));

        $this->assertTrue(view()->exists($view));
    }
}
