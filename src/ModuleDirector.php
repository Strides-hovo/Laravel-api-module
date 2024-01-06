<?php
declare(strict_types=1);

namespace Strides\Module;

use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\Exceptions\FileGeneratorException;

class ModuleDirector
{

    /**
     * Создает модуль с использованием фабрики и генератора файлов.
     *
     * @param BuilderClassNameEnum $classNameEnum Тип модуля.
     * @param array $data Данные для создания модуля.
     * @return array Названия и путь, Сгенерированные файлы модуля.
     * @throws FileGeneratorException
     * @throws BuilderException
     */
    public static function create(BuilderClassNameEnum $classNameEnum, array $data): array
    {
        ModuleHelper::addModulesName($data['moduleName']);
        $contents = ModuleFactory::build($classNameEnum, $data);
        return FileGenerator::generate($contents);
    }


    /**
     * Создает модуль, используя различные генераторы для каждого типа файла.
     *
     * @param array $args Аргументы для создания модуля.
     * @param array $generators Генераторы для каждого типа файла модуля. приходить из конфиг файла
     * @return array Результаты создания модуля для каждого типа файла.
     * @throws FileGeneratorException
     * @throws BuilderException
     */
    public static function module(array $args, array $generators): array
    {
        $replacements = array_merge($args, ['replacements' => self::getModuleReplacements($generators)]);
        $builderEnums = array_map(fn($n) => BuilderClassNameEnum::getCaseByName($n), array_keys($replacements['replacements']));
        $case = end($builderEnums);
        return self::create($case, $replacements);
    }


    /**
     * Получает замены для создания модуля на основе генераторов.
     *
     * @param array $generators Генераторы для каждого типа файла модуля. приходить из конфиг файла
     * @return array Массив замен для каждого типа файла модуля.
     */
    private static function getModuleReplacements(array $generators): array
    {
        $cases = BuilderClassNameEnum::cases();
        $names = array_column($cases, 'name');
        $nameReplacements = array_map(fn($n) => mb_strtolower($n), $names);

        $configRelations = array_map(fn($setting) => true, ModuleHelper::generators($generators));
        return array_filter($configRelations, fn($v, $k) => in_array($k, $nameReplacements), ARRAY_FILTER_USE_BOTH);
    }
}
