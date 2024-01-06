<?php

namespace Strides\Module\Builders;

use Strides\Module\Enums\BuilderKeysEnum;

class RepositoryBuilder extends AbstractBuilder
{

    protected function getBuilderKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::repository;
    }

    protected function getReplacements(): array
    {
        return array_merge(
            parent::getReplacements(),
            $this->getReplacementsByRelation(array_keys($this->replacements))
        );
    }
}
