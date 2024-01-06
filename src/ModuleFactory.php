<?php
declare(strict_types=1);

namespace Strides\Module;

use Exception;
use InvalidArgumentException;
use ReflectionClass;
use ReflectionException;
use Strides\Module\Builders\AbstractBuilder;
use Strides\Module\Builders\ControllerBuilder;
use Strides\Module\Builders\ModelBuilder;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Exceptions\BuilderException;

class ModuleFactory
{


    /**
     * Строит массив содержимого на основе указанного класса строителя и аргументов.
     *
     * @param BuilderClassNameEnum $classNameEnum Экземпляр перечисления BuilderClassNameEnum, представляющий тип строителя.
     * @param array $args Ассоциативный массив аргументов, необходимых для построения контента.
     *
     * @return array Массив, содержащий сгенерированный контент на основе указанного класса строителя и его замен (replacements).
     *
     * @throws BuilderException Если возникает проблема при создании класса строителя или получении его содержимого.
     * @throws Exception Если происходит необрабатываемое исключение при создании строителя или получении содержимого.
     */
    public static function build(BuilderClassNameEnum $classNameEnum, array &$args): array
    {
        if (!array_key_exists('replacements', $args)) {
            $builder = self::createBuilderClass($classNameEnum->name, $args);
            return $builder->getContents();
        }

        $args = self::processReplacements( $classNameEnum, $args);
        // Создание экземпляра класса строителя
        $builder = self::createBuilderClass($classNameEnum->name, $args);

        // Получение содержимого основного строителя
        $contents = $builder->getContents();

        $replacementContents = [];

        // Итерация по заменам и создание строителя для каждой замены
        foreach ($args['replacements'] as $replacement => $status) {
            $build = self::createBuilderClass($replacement, $args);
            $replacementContents[] = $build->getContents();
        }
        return array_merge($contents, ...$replacementContents);
    }


    /**
     * Получает параметры конструктора указанного класса и возвращает ассоциативный массив,
     * содержащий только те аргументы из переданного массива, которые соответствуют параметрам конструктора.
     *
     * @param string $builderCase Название случая строителя (builder). Ожидается, что это будет часть перечисления BuilderClassNameEnum.
     * @param array $args Ассоциативный массив с аргументами для конструктора.
     *
     * @return array Ассоциативный массив с аргументами, соответствующими параметрам конструктора.
     *
     * @throws ReflectionException Если не удается получить информацию о классе с использованием ReflectionClass.
     * @throws BuilderException Если возникает проблема при работе с перечислением BuilderClassNameEnum.
     */
    private static function getClassParameters(string $builderCase, array $args): array
    {
        // Получение перечисления BuilderClassNameEnum для указанного случая строителя.
        $classNameEnum = BuilderClassNameEnum::getCaseByName($builderCase)->value;

        // Получение рефлексии класса.
        $ref = new ReflectionClass($classNameEnum);

        // Получение конструктора класса.
        $construct = $ref->getConstructor();

        // Получение имен параметров конструктора.
        $parametersNames = array_map(fn($v) => $v->name, $construct->getParameters());

        // Возвращение аргументов, соответствующих параметрам конструктора.
        return array_intersect_key($args, array_flip($parametersNames));
    }


    /**
     * @throws BuilderException
     * @throws ReflectionException
     */
    private static function createBuilderClass(string $builderCase, array $args): AbstractBuilder
    {
        $builder = BuilderClassNameEnum::getCaseByName($builderCase)->value;
        $params = self::getClassParameters($builderCase, $args);

        return new $builder(...$params);
    }


    private static function getAllReplacements(BuilderClassNameEnum $classNameEnum): array
    {
        return match ($classNameEnum) {
            BuilderClassNameEnum::CONTROLLER => ControllerBuilder::OPTIONS,
            BuilderClassNameEnum::MODEL => ModelBuilder::OPTIONS,
            default => throw new InvalidArgumentException($classNameEnum->name),
        };
    }

    private static function processReplacements( BuilderClassNameEnum $classNameEnum, array $args): array
    {
        if (array_key_exists('all', $args['replacements'])) {
            $args['replacements'] = self::getAllReplacements($classNameEnum);
        }

        if (array_key_exists('resource', $args['replacements'])) {
            $args['replacements']['collection'] = true;
        }

        return $args;
    }


}
