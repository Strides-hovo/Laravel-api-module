<?php

namespace Strides\Module\Contracts;

interface MigrationFacadeInterface
{
    public function getOption(?string $moduleName, array $option): array;

    public function getRollbackOption(?string $moduleName, array $options): array;

    public function getSeedOption(?string $moduleName, array $options): array;

    public function getRefreshOption(?string $moduleName, array $options): array;
}
