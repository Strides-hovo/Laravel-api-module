<?php

return [
    'namespace' => 'Modules',
    'modules' => base_path('Modules'),
    'modules_name' => base_path('modules_name.json'),

    'format_with_pint' => true,

    'paths' => [
        'modules' => base_path('Modules'),

        'generator' => [
            'model' => ['path' => 'Entities', 'generate' => true],
            'migration' => ['path' => 'Database/Migrations', 'generate' => true],
            'seeder' => ['path' => 'Database/Seeders', 'generate' => true],
            'factory' => ['path' => 'Database/Factories', 'generate' => false],

            'repository' => ['path' => 'Repositories', 'generate' => true],
            'transformer' => ['path' => 'Http/Transformers', 'generate' => true],
            'middleware' => ['path' => 'Http/Middleware', 'generate' => false],
            'controller' => ['path' => 'Http/Controllers', 'generate' => true],
            'request' => ['path' => 'Http/Requests', 'generate' => true],
            'resource' => ['path' => 'Http/Resources', 'generate' => false],
            'service' => ['path' => 'Services', 'generate' => false],
            'action' => ['path' => 'Actions', 'generate' => true],

            'mail' => ['path' => 'Mail', 'generate' => false],
            'notification' => ['path' => 'Notification', 'generate' => false],
            'dto' => ['path' => 'Dto', 'generate' => false],
            'rule' => ['path' => 'Http/Rules', 'generate' => false],
            'policy' => ['path' => 'Policies', 'generate' => false],
            'command' => ['path' => 'Console/Commands', 'generate' => false],

            'event' => ['path' => 'Events', 'generate' => false],
            'listener' => ['path' => 'Listeners', 'generate' => false],
            'job' => ['path' => 'Jobs', 'generate' => false],
            'cast' => ['path' => 'Casts', 'generate' => false],
            'http' => ['path' => '/', 'generate' => true],

            'unit_test' => ['path' => 'Tests/Unit', 'generate' => false],
            'feature_test' => ['path' => 'Tests/Feature', 'generate' => false],
        ],
    ],
];
