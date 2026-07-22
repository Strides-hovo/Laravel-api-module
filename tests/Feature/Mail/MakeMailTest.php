<?php

namespace Strides\Module\Tests\Feature\Mail;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;
use Strides\Module\Providers\LoaderServiceProvider;
use Strides\Module\Tests\Feature\Feature;

class MakeMailTest extends Feature
{
    /**
     * @runInSeparateProcess
     *
     * @preserveGlobalState disabled
     */
    public function test_create_with_view(): void
    {
        $moduleName = 'Category';
        $fileName = 'CategoryMail';

        $this->artisan('module:make-module', [
            'moduleName' => $moduleName,
        ])->assertOk();

        $this->artisan('module:make-mail', [
            'moduleName' => $moduleName,
            'fileName' => $fileName,
            '--view' => true,
        ])->assertOk();

        $file = $this->getFilePath(BuilderKeysEnum::mail, $moduleName, $fileName);
        $class = ModuleHelper::namespace($moduleName, BuilderKeysEnum::mail, $fileName);
        $viewPath = ModuleHelper::normalizePath(ModuleHelper::module($moduleName, 'resources/views/mail/'.Str::lower($fileName).'.blade.php'));

        (new LoaderServiceProvider($this->app))->boot();

        $view = Str::lower($moduleName).'::mail.'.Str::lower($fileName);

        require $file;

        $this->assertTrue(File::exists($viewPath));
        $this->assertTrue(File::exists($file));
        $this->assertTrue(class_exists($class));
        $this->assertTrue(view()->exists($view));
    }
}
