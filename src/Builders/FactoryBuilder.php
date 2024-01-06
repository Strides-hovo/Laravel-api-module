<?php

namespace Strides\Module\Builders;

use Strides\Module\Builders\AbstractBuilder;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class FactoryBuilder extends AbstractBuilder
{

    private static array $replacement = [];

    public static function setReplacement(array $replacement): void
    {
        self::$replacement = $replacement;
    }

    protected function getBuilderKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::factory;
    }

    protected function getReplacements(): array
    {
        $keys = ModuleHelper::filterByKeys(['model'], [...$this->replacements, ...self::$replacement ]);
        return array_merge(
            parent::getReplacements(),
            $this->getReplacementsByRelation(array_keys($keys))
        );
    }
}
