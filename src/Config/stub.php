<?php

return [
    'controller' => [
        'main' => dirname(__DIR__).'/stubs/controller.stub',
        'index' => dirname(__DIR__).'/stubs/mini/controller/index.stub',
        'store' => dirname(__DIR__).'/stubs/mini/controller/store.stub',
        'destroy' => dirname(__DIR__).'/stubs/mini/controller/destroy.stub',
        'update' => dirname(__DIR__).'/stubs/mini/controller/update.stub',
        'show' => dirname(__DIR__).'/stubs/mini/controller/show.stub',
    ],
    'action' => [
        'main' => dirname(__DIR__).'/stubs/action.stub',
        'index' => dirname(__DIR__).'/stubs/mini/action/index.stub',
        'store' => dirname(__DIR__).'/stubs/mini/action/store.stub',
        'update' => dirname(__DIR__).'/stubs/mini/action/update.stub',
        'destroy' => dirname(__DIR__).'/stubs/mini/action/destroy.stub',
        'show' => dirname(__DIR__).'/stubs/mini/action/show.stub',
    ],
    'service' => [
        'main' => dirname(__DIR__).'/stubs/service.stub',
        'solo' => dirname(__DIR__).'/stubs/service.solo.stub',
        'index' => dirname(__DIR__).'/stubs/mini/service/index.stub',
        'store' => dirname(__DIR__).'/stubs/mini/service/store.stub',
        'update' => dirname(__DIR__).'/stubs/mini/service/update.stub',
        'destroy' => dirname(__DIR__).'/stubs/mini/service/destroy.stub',
        'show' => dirname(__DIR__).'/stubs/mini/service/show.stub',
    ],
    'request' => [
        'main' => dirname(__DIR__).'/stubs/request.stub',
    ],
    'resource' => [
        'main' => dirname(__DIR__).'/stubs/resource.stub',
    ],
    'transformer' => [
        'main' => dirname(__DIR__).'/stubs/transformer.stub',
    ],

    'repository' => [
        'main' => dirname(__DIR__).'/stubs/repository.stub',
        'solo' => dirname(__DIR__).'/stubs/repository.solo.stub',
    ],
    'middleware' => [
        'main' => dirname(__DIR__).'/stubs/middleware.stub',
    ],
    'job' => [
        'main' => dirname(__DIR__).'/stubs/job.stub',
    ],
    'mail' => [
        'main' => dirname(__DIR__).'/stubs/mail/mail.stub',
        'main-view' => dirname(__DIR__).'/stubs/mail/mail.view.stub',
        'view' => dirname(__DIR__).'/stubs/mail/view.stub',
    ],
    'notification' => [
        'main' => dirname(__DIR__).'/stubs/notification.stub',
    ],
    'dto' => [
        'main' => dirname(__DIR__).'/stubs/dto.stub',
    ],
    'rule' => [
        'main' => dirname(__DIR__).'/stubs/rule.stub',
    ],
    'command' => [
        'main' => dirname(__DIR__).'/stubs/command.stub',
    ],
    'event' => [
        'main' => dirname(__DIR__).'/stubs/event.stub',
    ],
    'listener' => [
        'main' => dirname(__DIR__).'/stubs/listener.stub',
    ],
    'policy' => [
        'main' => dirname(__DIR__).'/stubs/policies/policy.stub',
        'model' => dirname(__DIR__).'/stubs/policies/model.stub',
    ],
    'factory' => [
        'main' => dirname(__DIR__).'/stubs/model/factory.stub',
    ],
    'seeder' => [
        'main' => dirname(__DIR__).'/stubs/model/seeder.stub',
    ],
    'model' => [
        'main' => dirname(__DIR__).'/stubs/model/model.stub',
    ],
    'migration' => [
        'main' => dirname(__DIR__).'/stubs/model/migration.stub',
    ],
    'module' => [
        'config' => dirname(__DIR__).'/stubs/module/config.stub',
        'route' => dirname(__DIR__).'/stubs/module/route.stub',
    ],
    'provider' => [
        'service' => dirname(__DIR__).'/stubs/providers/service.stub',
        'route' => dirname(__DIR__).'/stubs/providers/route.stub',
    ],
    'test' => [
        'main' => dirname(__DIR__).'/stubs/test/unit.stub',
        'feature' => dirname(__DIR__).'/stubs/test/feature.stub',
    ],
    'cast' => [
        'main' => dirname(__DIR__).'/stubs/cast.stub',
    ],
    'http' => [
        'main' => dirname(__DIR__).'/stubs/http.stub',
    ],
];
