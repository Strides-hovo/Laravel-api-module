<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;
use Strides\Module\Dto\BuilderResultDto;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

/**
 * Mail class builder compiling mailables and optionally creating associated Blade view files.
 */
class MailBuilder extends BaseBuilder
{
    /**
     * Build the placeholder replacement list for the mail template.
     *
     * @return array<string, string>
     */
    protected function getReplacements(): array
    {
        $parent = parent::getReplacements();
        $view = ['{{ view }}' => ''];

        if (!empty($this->options) && isset($this->options['view'])) {
            $stub_path = (string) Config::get('module-stub.mail.main-view');
            $stub = is_file($stub_path) ? (string) file_get_contents($stub_path) : '';
            $replContent = strtr($stub, [
                '{{ Uname }}' => Str::ucfirst($this->fileName),
                '{{ name }}' => Str::lower($this->fileName),
            ]);

            $view = ['{{ view }}' => $replContent ];
        }

        return array_merge($parent, $view);
    }

    /**
     * Get the filepath targeting the main mailable stub template.
     */
    protected function getStubPath(): string
    {
        return (string) Config::get('module-stub.mail.main');
    }

    /**
     * Retrieve the generator key identification code.
     */
    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::mail;
    }

    /**
     * Generate the matching mailable Blade view result data.
     */
    public function getRequestView(): BuilderResultDto
    {
        $view_stub = (string) Config::get('module-stub.mail.view');
        $dir = $this->getViewDirName();
        $file = Str::lower($this->fileName) . '.blade.php';
        $content = is_file($view_stub) ? (string) file_get_contents($view_stub) : '';

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
