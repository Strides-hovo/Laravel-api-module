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

    protected string $fileName;

    /** @var array<string, mixed> */
    public array $relations = [];

    /** @var array<string, mixed> */
    protected array $options;

    protected ?string $version;

    public function __construct(CommandDto $dto)
    {
        $this->moduleName = $dto->moduleName ?? '';
        $this->fileName = $dto->fileName ?? '';
        $this->options = $dto->options;
        $this->version = $dto->options['version'] ?? null;

        if ($this instanceof HasRelationsInterface) {
            $this->init();
        }
    }

    abstract protected function getGeneratorKey(): BuilderKeysEnum;

    abstract protected function getStubPath(): string;

    public function setOptions(array $options): BaseBuilder
    {
        $this->options = $options;

        return $this;
    }

    public function getFileName(): string
    {
        return $this->fileName;
    }

    protected function getControllerRelation(BuilderKeysEnum $key, string $replacer, string $entity = 'Controller'): string
    {
        $relationClass = Str::replaceLast($entity, $replacer, $this->normalizeRelationClassName($key));

        return FileNameFactory::make(moduleName: $this->moduleName, type: $key, customName: $relationClass);
    }

    public function getContent(): BuilderResultDto
    {
        $stub = (string) file_get_contents($this->getStubPath());
        $content = strtr($stub, $this->getReplacements());

        $dir = ModuleHelper::normalizePath(
            ModuleHelper::module($this->moduleName).DIRECTORY_SEPARATOR.ModuleHelper::generator($this->getGeneratorKey())
        );
        $fileName = $this->getFileName().($this->getGeneratorKey() === BuilderKeysEnum::http ? '.http' : '.php');

        return new BuilderResultDto(filePath: $dir.DIRECTORY_SEPARATOR.$fileName, content: $content);
    }

    /**
     * @return array<string, string>
     */
    protected function getReplacements(): array
    {
        return [
            '{{ namespace }}' => ModuleHelper::namespace($this->moduleName, $this->getGeneratorKey()),
            '{{ class }}' => $this->getFileName(),
        ];
    }

    private function normalizeRelationClassName(BuilderKeysEnum $enum): string
    {
        return match ($enum){
            BuilderKeysEnum::request, BuilderKeysEnum::resource, BuilderKeysEnum::transformer => $this->getFileName(),
            default => $this->fileName
        };
    }
}
