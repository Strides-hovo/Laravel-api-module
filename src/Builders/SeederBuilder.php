<?php

namespace Strides\Module\Builders;

use Strides\Module\Contracts\BuilderOptionInterface;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class SeederBuilder extends AbstractBuilder implements BuilderOptionInterface
{

    private static array $option = [];

    public static function setOption(array $option): void
    {
        self::$option = $option;
    }

    protected function getBuilderKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::seeder;
    }


    protected function getReplacements(): array
    {
        $keys = ModuleHelper::filterByKeys(['model', 'factory'], [...$this->replacements, ...self::$option]);
        return array_merge(
            parent::getReplacements(),
            $this->getReplacementsByRelation(array_keys($keys))
        );
    }
}
