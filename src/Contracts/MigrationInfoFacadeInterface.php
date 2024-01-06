<?php

namespace Strides\Module\Contracts;

interface MigrationInfoFacadeInterface
{
    public function getInfo(string $output, string $moduleName): string;
}
