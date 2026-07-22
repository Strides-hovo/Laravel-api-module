<?php

namespace Strides\Module\Factories;

use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class FileNameFactory
{
    public static function make(string $moduleName, BuilderKeysEnum $type, ?string $customName = null): string
    {
        if (! empty($customName)) {
            return $customName;
        }

        $moduleStudly = Str::studly(Str::afterLast($moduleName, '/'));

        return match ($type) {
            BuilderKeysEnum::controller => $moduleStudly.'Controller',
            BuilderKeysEnum::request => $moduleStudly.'Request',
            BuilderKeysEnum::resource => $moduleStudly.'Resource',
            BuilderKeysEnum::collection => $moduleStudly.'Collection',
            BuilderKeysEnum::repository => $moduleName.'Repository',

            BuilderKeysEnum::seeder => $moduleStudly.'Seeder',
            BuilderKeysEnum::factory => $moduleStudly.'Factory',
            BuilderKeysEnum::migration => date('Y_m_d_His').'_create_'.ModuleHelper::singular(Str::lower($moduleName)).'_table',

            BuilderKeysEnum::unit_test, BuilderKeysEnum::feature_test => $moduleStudly.'Test',
            BuilderKeysEnum::middleware => $moduleStudly.'Middleware',

            BuilderKeysEnum::route => 'api',
            BuilderKeysEnum::route_service_provider => 'RouteServiceProvider',
            BuilderKeysEnum::service_provider => $moduleStudly.'ServiceProvider',

            BuilderKeysEnum::transformer => $moduleStudly.'Transformer',
            BuilderKeysEnum::helper => $moduleStudly.'Helper',
            BuilderKeysEnum::contract => $moduleStudly.'Contract',
            BuilderKeysEnum::service => $moduleStudly.'Service',
            BuilderKeysEnum::action => $moduleStudly.'Action',

            BuilderKeysEnum::event => $moduleStudly.'Event',
            BuilderKeysEnum::listener => $moduleStudly.'Listener',
            BuilderKeysEnum::job => $moduleStudly.'Job',
            BuilderKeysEnum::cast => $moduleStudly.'Cast',
            BuilderKeysEnum::channel => $moduleStudly.'Channel',
            BuilderKeysEnum::http => 'Http',
            BuilderKeysEnum::mail => $moduleStudly.'Mail',
            BuilderKeysEnum::notification => $moduleStudly.'Notification',
            BuilderKeysEnum::rule => $moduleStudly.'Rule',
            BuilderKeysEnum::dto => $moduleStudly.'Dto',
            BuilderKeysEnum::command => $moduleStudly.'Command',
            BuilderKeysEnum::policy => $moduleStudly.'Policy',
            BuilderKeysEnum::config => 'config',

            default => $moduleStudly
        };
    }
}
