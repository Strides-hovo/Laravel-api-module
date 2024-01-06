<?php

namespace Strides\Module\Facades;

use Illuminate\Support\Facades\Config;
use Strides\Module\ModuleHelper;

class ModuleFacade
{
    /**
     * Получает классы провайдеров модулей.
     *
     * @return array
     */
    public static function getModuleProviderClasses(): array
    {
        // Получаем имена модулей
        $modules = ModuleHelper::getModulesNames();

        // Получаем пространство имен модулей из конфигурации
        $moduleDir = Config::get('module.namespace');

        // Если модулей нет, возвращаем пустой массив
        if (empty($modules)) {
            return [];
        }

        // Используем array_map, array_filter и array_values для формирования массива классов провайдеров
        return array_values(array_filter(array_map(function ($module) use ($moduleDir) {
            // Строим полное имя класса провайдера для данного модуля
            $providerClass = self::buildProviderClass($module, $moduleDir);

            // Возвращаем только те классы, которые существуют
            return class_exists($providerClass) ? $providerClass : null;
        }, array_keys($modules))));
    }

    /**
     * Строит полное имя класса провайдера для модуля.
     *
     * @param string $module Имя модуля
     * @param string $moduleDir Пространство имен модулей
     *
     * @return string
     */
    private static function buildProviderClass(string $module, string $moduleDir): string
    {
        // Формируем путь к классу провайдера
        $classDir = $module . DIRECTORY_SEPARATOR . 'Providers' . DIRECTORY_SEPARATOR;
        $moduleName = ModuleHelper::singular($module);
        $classPath = $moduleDir . DIRECTORY_SEPARATOR . $classDir . $moduleName . "ServiceProvider";

        // Заменяем слеши на обратные слеши, чтобы получить полное имя класса
        return str_replace('/', '\\', $classPath);
    }
}
