<?php

declare(strict_types=1);

namespace Strides\Module\Tests;

use ReflectionException;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

trait AssertsGeneratedModules
{
    /**
     * Этот метод просто инкапсулирует сложную проверку,
     * но никак не связывает тесты между собой.
     *
     * @throws ReflectionException|ReflectionException
     */
    private function assertClassExists(BuilderKeysEnum $key, string $moduleName, string $fileName, array $methods = [])
    {
        $path = $this->getFilePath($key, $moduleName, $fileName);

        $this->assertFileExists($path);

        require_once $path;

        $namespace = ModuleHelper::namespace($moduleName, $key, $fileName);
        $this->assertTrue(class_exists($namespace), "Класс {$namespace} не был найден или невалиден.");

        if (! empty($methods)) {
            $reflection = new \ReflectionClass($namespace);
            $this->assertMethodsSignature($reflection, $methods);
        }
    }

    /**
     * Проверяет наличие публичных методов и типы их аргументов.
     * Принимает массив вида:
     * [
     *     'store' => [StoreCategoryRequest::class],
     *     'update' => [UpdateCategoryRequest::class, CategoryService::class],
     *     'index' => [] // если аргументы не требуются
     * ]
     *
     * @throws ReflectionException|ReflectionException
     */
    private function assertMethodsSignature(\ReflectionClass $reflection, array $methods): void
    {
        foreach ($methods as $methodName => $expectedArgs) {
            $this->assertTrue(
                $reflection->hasMethod($methodName),
                "Метод [{$methodName}] не найден в классе [{$reflection->getName()}]."
            );

            $method = $reflection->getMethod($methodName);

            $this->assertTrue(
                $method->isPublic(),
                "Метод [{$methodName}] в классе [{$reflection->getName()}] должен быть public."
            );

            $parameters = $method->getParameters();

            $this->assertCount(
                count($expectedArgs),
                $parameters,
                "Количество аргументов в методе [{$methodName}] не совпадает с ожидаемым."
            );

            foreach ($expectedArgs as $index => $expectedType) {
                $param = $parameters[$index];
                $paramType = $param->getType();

                if ($expectedType === '') {
                    $this->assertNull(
                        $paramType,
                        "Аргумент [\${$param->getName()}] в методе [{$methodName}] не должен иметь жесткого типа (ожидался mixed)."
                    );

                    continue;
                }

                $this->assertNotNull(
                    $paramType,
                    "Аргумент [\${$param->getName()}] в методе [{$methodName}] не имеет указанного типа (typehint)."
                );

                $actualType = $paramType instanceof \ReflectionNamedType
                    ? $paramType->getName()
                    : (string) $paramType;

                $this->assertEquals(
                    ltrim($expectedType, '\\'),
                    ltrim($actualType, '\\'),
                    "Аргумент [\${$param->getName()}] в методе [{$methodName}] ожидал тип [{$expectedType}], но получил [{$actualType}]."
                );
            }
        }
    }
}
