<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;

class JobBuilder extends BaseBuilder
{
    protected function getStubPath(): string
    {
        return Config::get('module-stub.job.main');
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::job;
    }
}
