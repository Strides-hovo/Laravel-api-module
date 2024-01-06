<?php
declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\Facades\BuilderFacade;
use Strides\Module\ModuleHelper;

abstract class AbstractBuilder
{
    protected array $replacements;

    /**
     * Конструктор класса AbstractBuilder.
     *
     * @param string $moduleName Название модуля.
     * @param string|null $fileName Название файла или null.
     * @param array $replacements Массив зовисомости.
     */
    public function __construct(
        protected string  $moduleName,
        protected ?string $fileName = null,
        array             $replacements = []
    )
    {
        $this->replacements = $this->filterBuilderKeyReplacement($replacements);
    }

    /**
     * Абстрактный метод, который должен быть реализован в подклассах для возврата ключа строителя (BuilderKeysEnum).
     *
     * @return BuilderKeysEnum Ключ строителя.
     */
    abstract protected function getBuilderKey(): BuilderKeysEnum;


    /**
     * Получает содержимое строителя в виде ассоциативного массива.
     *
     * @return array Ассоциативный массив, представляющий содержимое строителя.
     * @throws BuilderException Если возникает проблема при построении содержимого.
     *
     */
    public function getContents(): array
    {
        return [
            $this->getBuilderKey()->name => $this->buildContentsArray()
        ];
    }

    /**
     * Получает имя шаблона строителя.
     *
     * @return string Имя шаблона строителя.
     */
    protected function getTemplate(): string
    {
        return $this->getBuilderKey()->name;
    }

    /**
     * Получает замены для строителя в виде ассоциативного массива.
     *
     * @return array Ассоциативный массив замен для строителя.
     */
    protected function getReplacements(): array
    {
        $namespace = ModuleHelper::namespace($this->moduleName, $this->getBuilderKey());
        $className = $this->fileNameFactory($this->getBuilderKey());

        return [
            'namespace' => $namespace,
            'class' => $className
        ];
    }


    /**
     * Получает имя файла строителя.
     *
     * @return string Имя файла строителя.
     */
    protected function getFileName(): string
    {
        return $this->fileNameFactory($this->getBuilderKey());
    }


    /**
     * Получает замены для строителя на основе заданных отношений.
     *
     * @param array $relations Массив отношений, для которых нужно получить замены.
     *
     * @return array Ассоциативный массив замен для строителя на основе отношений.
     */
    protected function getReplacementsByRelation(array $relations): array
    {

        $resourceClassname = $this->fileNameFactory(BuilderKeysEnum::resource);
        $requestClassname = $this->fileNameFactory(BuilderKeysEnum::request);
        $repositoryClassname = $this->fileNameFactory(BuilderKeysEnum::repository);
        $collectionClassname = $this->fileNameFactory(BuilderKeysEnum::collection);
        $factoryClassname = $this->fileNameFactory(BuilderKeysEnum::factory);
        $controllerClassname = $this->fileNameFactory(BuilderKeysEnum::controller);
        $modelClassname = $this->fileNameFactory(BuilderKeysEnum::model);

        $data = [
            'request_namespace' => ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::request, $requestClassname),
            'model_namespace' => ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::model) . "\\{$modelClassname}",
            'resource_namespace' => ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::resource, $resourceClassname),
            'collection_namespace' => ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::collection, $collectionClassname),
            'repository_namespace' => ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::repository, $repositoryClassname),
            'controller_namespace' => ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::controller, $controllerClassname),
            'factory_namespace' => ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::factory, $factoryClassname),

            'repository' => $repositoryClassname,
            'collection' => $collectionClassname,
            'request' => $requestClassname,
            'resource' => $resourceClassname,
            'controller' => $controllerClassname,
            'factory' => $factoryClassname,
            'model_name' => $modelClassname,
            'model' => Str::snake($modelClassname),
        ];
        return array_filter($data, function ($value, $key) use ($relations) {
            $namespaceKey = strstr($key, '_', true);
            return in_array($key, $relations) || in_array($namespaceKey, $relations);
        }, ARRAY_FILTER_USE_BOTH);

    }



    /* ############ */


    /**
     * @throws BuilderException
     */
    protected function getDirectory(): string
    {
        $path = ModuleHelper::generator($this->getBuilderKey()->name);
        return ModuleHelper::module($this->moduleName, $path);
    }


    /**
     * Получает путь к файлу строителя.
     *
     * @return string Путь к файлу строителя.
     * @throws BuilderException Если возникает проблема при получении пути.
     *
     */
    private function getFilePath(): string
    {
        $name = $this->getFileName();
        return $this->getDirectory() . DIRECTORY_SEPARATOR . (Str::contains($name, '.') ? $name : "{$name}.php");
    }

    /**
     * Создает имя файла на основе указанного ключа строителя.
     *
     * @param BuilderKeysEnum $builderKey Ключ строителя.
     *
     * @return string Имя файла, созданное на основе ключа строителя.
     */
    private function fileNameFactory(BuilderKeysEnum $builderKey): string
    {
        if ($builderKey === BuilderKeysEnum::model) {
            return BuilderFacade::getModelFileName($this->moduleName, $this->fileName);
        }
        return BuilderFacade::getOtherFileName($this->moduleName, $builderKey, $this->fileName);
    }


    /**
     * Фильтрует массив замен для строителя, исключая текущий ключ строителя.
     *
     * @param array $replacements Массив замен для строителя.
     *
     * @return array Отфильтрованный массив замен для строителя.
     */
    private function filterBuilderKeyReplacement(array $replacements): array
    {
        if (array_key_exists($this->getBuilderKey()->name, $replacements)) {
            unset($replacements[$this->getBuilderKey()->name]);
        }

        return $replacements;
    }

    /**
     * Строит массив содержимого строителя.
     *
     * @return array Массив содержимого строителя.
     * @throws BuilderException Если возникает проблема при построении массива содержимого.
     *
     */
    private function buildContentsArray(): array
    {
        return [
            'directory' => $this->getDirectory(),
            'fileName' => $this->getFilePath(),
            'template' => $this->getTemplate(),
            'replacements' => $this->getReplacements(),
        ];
    }
}
