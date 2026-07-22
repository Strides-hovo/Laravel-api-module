<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;
use Strides\Module\Dto\BuilderResultDto;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class MailBuilder extends BaseBuilder
{


    protected function getStubPath(): string
    {
        return (string)Config::get('module-stub.mail.main');
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::mail;
    }


    protected function getReplacements(): array
    {
        $parent = parent::getReplacements();

        $Uname = '';
        $view = '';
        $stub_path = (string)Config::get('module-stub.mail.main-view');
        $stub = is_file($stub_path) ? (string)file_get_contents($stub_path) : '';

        if (!empty($this->options) && isset($this->options['view'])) {
            $Uname = Str::ucfirst($this->fileName);
            $view = Str::lower($this->moduleName) . '::mail.' . Str::kebab($this->fileName);
        }

        $replContent = strtr($stub, [
            '{{ Uname }}' => $Uname,
            '{{ view }}' => $view,
        ]);

        $content = ['{{ content }}' => $replContent];
        return array_merge($parent, $content);
    }


    public function getRequestView(): BuilderResultDto
    {
        $view_stub = (string)Config::get('module-stub.mail.view');
        $dir = $this->getViewDirName();
        $file = Str::kebab($this->fileName) . '.blade.php';
        $content = is_file($view_stub) ? (string)file_get_contents($view_stub) : '';

        return new BuilderResultDto(
            dirName: $dir,
            fileName: $dir . DIRECTORY_SEPARATOR . $file,
            content: $content
        );
    }

    /**
     * Retrieve the target views storage directory.
     */
    private function getViewDirName(): string
    {
        return ModuleHelper::normalizePath(
            ModuleHelper::module($this->moduleName) . DIRECTORY_SEPARATOR . 'resources/views/mail'
        );
    }
}
