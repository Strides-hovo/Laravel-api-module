<?php

namespace Strides\Module\Enums;

use Strides\Module\Builders\CollectionBuilder;
use Strides\Module\Builders\ControllerBuilder;
use Strides\Module\Builders\FactoryBuilder;
use Strides\Module\Builders\HttpBuilder;
use Strides\Module\Builders\MiddlewareBuilder;
use Strides\Module\Builders\MigrationBuilder;
use Strides\Module\Builders\ModelBuilder;
use Strides\Module\Builders\RepositoryBuilder;
use Strides\Module\Builders\RequestBuilder;
use Strides\Module\Builders\ResourceBuilder;
use Strides\Module\Builders\RouteBuilder;
use Strides\Module\Builders\RouteServiceProviderBuilder;
use Strides\Module\Builders\SeederBuilder;
use Strides\Module\Builders\ServiceProviderBuilder;
use Strides\Module\Builders\UnitTestBuilder;
use Strides\Module\Exceptions\BuilderException;

enum BuilderClassNameEnum: string
{
    case CONTROLLER = ControllerBuilder::class;
    case REQUEST = RequestBuilder::class;
    case RESOURCE = ResourceBuilder::class;
    case COLLECTION = CollectionBuilder::class;
    case REPOSITORY = RepositoryBuilder::class;
    case MODEL = ModelBuilder::class;
    case SEEDER = SeederBuilder::class;
    case FACTORY = FactoryBuilder::class;
    case MIGRATION = MigrationBuilder::class;
    case UNIT_TEST = UnitTestBuilder::class;
    case HTTP = HttpBuilder::class;
    case MIDDLEWARE = MiddlewareBuilder::class;
    case ROUTE = RouteBuilder::class;
    case ROUTE_SERVICE_PROVIDER = RouteServiceProviderBuilder::class;
    case SERVICE_PROVIDER = ServiceProviderBuilder::class;




    /**
     * @throws BuilderException
     */
    public static function getCaseByName(string $caseName): BuilderClassNameEnum
    {

        $names = array_column(self::cases(), 'name');
        $index = array_search(strtoupper($caseName), $names);

        if ($index === false) {
            throw new BuilderException("Noting Builder $caseName");
        }

        return self::cases()[$index];
    }
}
