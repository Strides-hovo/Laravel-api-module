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
            'factory' => ['path' => 'Database/Factories', 'generate' => true],

            'repository' => ['path' => 'Repositories', 'generate' => true],
            'transformer' => ['path' => 'Http/Transformers', 'generate' => true],
            'middleware' => ['path' => 'Http/Middleware', 'generate' => true],
            'controller' => ['path' => 'Http/Controllers', 'generate' => true],
            'request' => ['path' => 'Http/Requests', 'generate' => true],
            'resource' => ['path' => 'Http/Resources', 'generate' => true],
            'service' => ['path' => 'Services', 'generate' => true],
            'action' => ['path' => 'Actions', 'generate' => true],


            'mail' => ['path' => 'Mail', 'generate' => true],
            'notification' => ['path' => 'Notification', 'generate' => true],
            'dto' => ['path' => 'Dto', 'generate' => true],
            'rule' => ['path' => 'Http/Rules', 'generate' => true],
            'policy' => ['path' => 'Policies', 'generate' => true],
            'command' => ['path' => 'Console/Commands', 'generate' => true],

            'event' => ['path' => 'Events', 'generate' => false],
            'listener' => ['path' => 'Listeners', 'generate' => true],
            'job' => ['path' => 'Jobs', 'generate' => true],
            'cast' => ['path' => 'Casts', 'generate' => true],

            'unit_test' => ['path' => 'Tests/Unit', 'generate' => true],
            'feature_test' => ['path' => 'Tests/Feature', 'generate' => true],
        ],
    ],
];
