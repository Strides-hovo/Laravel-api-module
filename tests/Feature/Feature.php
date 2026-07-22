<?php

namespace Strides\Module\Tests\Feature;

use Strides\Module\Tests\TestCase;

abstract class Feature extends TestCase
{
    protected string $moduleName = 'Category';

    protected function tearDown(): void
    {
        $this->clearModule($this->moduleName);

        parent::tearDown();
    }
}
