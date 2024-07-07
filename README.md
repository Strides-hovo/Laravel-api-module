

<h1 style="text-align: center;">LARAVEL API MODULE v 1.0 </h1>

### installation
    composer require laravel/api-module

### setting add in the composer.json file to the autoload field
     
    "Modules\\": "Modules/",

### config published
    php artisan vendor:publish --provider="Strides\Module\Providers\ModuleServiceProvider"

### test setting
    add in phpunit.xml 
    <testsuite name="Modules">
        <directory suffix="Test.php">Modules/*/Tests/*</directory>
    </testsuite>


## create module
    php artisan module:make-module ModuleName
    creding module by config file

#### creating
- Model
- Factory
- Seeder
- Migration
- Controller
- Request
- Repository
- Resource
- Collection
- Route
- Middleware

### create model

1. >php artisan module:make-model ModuleName
2. >php artisan module:make-model ModuleName -c ~~controller~~
3. >php artisan module:make-model ModuleName -m ~~migration~~
4. >php artisan module:make-model ModuleName -s ~~seeder~~
5. >php artisan module:make-model ModuleName -f ~~factory~~
6. >php artisan module:make-model ModuleName -r ~~request~~
7. >php artisan module:make-model ModuleName -o ~~resource~~
8. >php artisan module:make-model ModuleName -p ~~repository~~
9. >php artisan module:make-model ModuleName -a ~~all~~
10. >php artisan module:make-model ModuleName ModelName options

    
### create migration

1. >php artisan module:migration ModuleName  alter_table_posts



### create controller

1. >php artisan module:make-controller Post 
2. >php artisan module:make-controller Post -r ~~request~~
3. >php artisan module:make-controller Post -o ~~resource~~
4. >php artisan module:make-controller Post -p ~~repository~~
5. >php artisan module:make-controller Post -a ~~all~~
6. >php artisan module:make-controller Post NewsController -a

### run migrations

1. > php artisan module:migrate ModuleName 
2. > php artisan module:migrate ModuleName -f ~~force~~
3. > php artisan module:migrate ModuleName -s ~~seed~~
4. > php artisan module:migrate ModuleName -d ~~database~~
5. > php artisan module:migrate ModuleName --step ~~step~~
6. > php artisan module:migrate ModuleName --pretend ~~pretend~~
7. > php artisan module:seed ModuleName (optional)
8. > php artisan module:migrate-status ModuleName (optional)
9. > php artisan module:migrate-rollback ModuleName (optional)
10. > php artisan module:migrate-reset ModuleName (optional)
11. > php artisan module:migrate-refresh ModuleName (optional) --seed --step=1



