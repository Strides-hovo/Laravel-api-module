<?php

return [
    'namespace' => 'Modules',
    'modules' => base_path('Modules'),
    'modules_name' => base_path('modules_name.json'),
    'paths' => [
        'modules' => base_path('Modules'),
        'templates' =>  dirname(__DIR__) . '/templates',

        'generator' => [
            'model' => ['path' => 'Entities', 'generate' => true],
            'migration' => ['path' => 'Database/Migrations', 'generate' => true],
            'seeder' => ['path' => 'Database/Seeders', 'generate' => true],
            'factory' => ['path' => 'Database/Factories', 'generate' => true],

            'controller' => ['path' => 'Http/Controllers', 'generate' => true],
            'request' => ['path' => 'Http/Requests', 'generate' => true],
            'resource' => ['path' => 'Http/Resources', 'generate' => true],
            'collection' => ['path' => 'Http/Resources', 'generate' => true],
            'repository' => ['path' => 'Repositories', 'generate' => true],
            'service' => ['path' => 'Services', 'generate' => true],

            'route' => ['path' => 'Routes', 'generate' => true],
            'middleware' => ['path' => 'Http/Middleware', 'generate' => true],
            'unit_test' => ['path' => 'Tests/Unit', 'generate' => true],
            'route_service_provider' => ['path' => 'Providers', 'generate' => true],
            'service_provider' => ['path' => 'Providers', 'generate' => true],
            'http' => ['path' => '/', 'generate' => true],
        ]
    ]
];
