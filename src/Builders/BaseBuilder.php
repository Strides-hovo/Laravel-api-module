<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Str;
use Strides\Module\Contracts\HasRelationsInterface;
use Strides\Module\Dto\BuilderResultDto;
use Strides\Module\Dto\CommandDto;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Factories\FileNameFactory;
use Strides\Module\ModuleHelper;

abstract class BaseBuilder
{
    protected string $moduleName;
    public string $fileName;

    /** @var array<string, mixed> */
    protected array $options;

    /** @var array<string, mixed> */
    public array $relations = [];

    public function __construct(CommandDto $dto)
    {
        $this->moduleName = $dto->moduleName ?? '';
        $this->fileName = $dto->fileName ?? '';
        $this->options = $dto->options;

        if ($this instanceof HasRelationsInterface) {
            $this->init();
        }
    }

    abstract protected function getGeneratorKey(): BuilderKeysEnum;

    abstract protected function getStubPath(): string;

    protected function getControllerRelation(BuilderKeysEnum $key, string $replacer, string $entity = 'Controller'): string
    {
        $relationClass = Str::replaceLast($entity, $replacer, $this->fileName);

        return FileNameFactory::make($this->moduleName, $key, $relationClass);
    }

    public function getContent(): BuilderResultDto
    {
        $stub = (string)file_get_contents($this->getStubPath());
        $content = strtr($stub, $this->getReplacements());

        $dir = ModuleHelper::normalizePath(
            ModuleHelper::module($this->moduleName) . DIRECTORY_SEPARATOR . ModuleHelper::generator($this->getGeneratorKey())
        );

        return new BuilderResultDto($dir, $dir . DIRECTORY_SEPARATOR . $this->fileName . '.php', $content);
    }

    /**
     * @return array<string, string>
     */
    protected function getReplacements(): array
    {
        return [
            '{{ namespace }}' => ModuleHelper::namespace($this->moduleName, $this->getGeneratorKey()),
            '{{ class }}' => $this->fileName,
        ];
    }
}
