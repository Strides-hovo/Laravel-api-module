<?php

declare(strict_types=1);

namespace Strides\Module\Enums;

use Strides\Module\Builders\ActionBuilder;
use Strides\Module\Builders\CastBuilder;
use Strides\Module\Builders\CommandBuilder;
use Strides\Module\Builders\ConfigBuilder;
use Strides\Module\Builders\ControllerBuilder;
use Strides\Module\Builders\DtoBuilder;
use Strides\Module\Builders\EventBuilder;
use Strides\Module\Builders\FactoryBuilder;
use Strides\Module\Builders\FeatureTestBuilder;
use Strides\Module\Builders\HttpBuilder;
use Strides\Module\Builders\JobBuilder;
use Strides\Module\Builders\ListenerBuilder;
use Strides\Module\Builders\MailBuilder;
use Strides\Module\Builders\MiddlewareBuilder;
use Strides\Module\Builders\MigrationBuilder;
use Strides\Module\Builders\ModelBuilder;
use Strides\Module\Builders\NotificationBuilder;
use Strides\Module\Builders\PolicyBuilder;
use Strides\Module\Builders\RepositoryBuilder;
use Strides\Module\Builders\RequestBuilder;
use Strides\Module\Builders\ResourceBuilder;
use Strides\Module\Builders\RouteBuilder;
use Strides\Module\Builders\RouteServiceProviderBuilder;
use Strides\Module\Builders\RuleBuilder;
use Strides\Module\Builders\SeederBuilder;
use Strides\Module\Builders\ServiceBuilder;
use Strides\Module\Builders\ServiceProviderBuilder;
use Strides\Module\Builders\TestBuilder;
use Strides\Module\Builders\TransformerBuilder;
use Strides\Module\Builders\UnitTestBuilder;
use Strides\Module\Enums\Concerns\ResolvableByNameTrait;

enum BuilderClassNameEnum: string
{
    use ResolvableByNameTrait;

    case CONTROLLER = ControllerBuilder::class;
    case TRANSFORMER = TransformerBuilder::class;
    case SERVICE = ServiceBuilder::class;
    case REPOSITORY = RepositoryBuilder::class;

    case ACTION = ActionBuilder::class;
    case REQUEST = RequestBuilder::class;
    case RESOURCE = ResourceBuilder::class;

    case MIDDLEWARE = MiddlewareBuilder::class;
    case JOB = JobBuilder::class;
    case MAIL = MailBuilder::class;
    case NOTIFICATION = NotificationBuilder::class;
    case DTO = DtoBuilder::class;
    case RULE = RuleBuilder::class;
    case COMMAND = CommandBuilder::class;
    case EVENT = EventBuilder::class;
    case LISTENER = ListenerBuilder::class;
    case POLICY = PolicyBuilder::class;
    case FACTORY = FactoryBuilder::class;
    case SEEDER = SeederBuilder::class;
    case MIGRATION = MigrationBuilder::class;
    case MODEL = ModelBuilder::class;
    case ROUTE_SERVICE_PROVIDER = RouteServiceProviderBuilder::class;
    case SERVICE_PROVIDER = ServiceProviderBuilder::class;
    case TEST = TestBuilder::class;
    case FEATURE_TEST = FeatureTestBuilder::class;
    case UNIT_TEST = UnitTestBuilder::class;
    case CAST = CastBuilder::class;
    case ROUTE = RouteBuilder::class;
    case CONFIG = ConfigBuilder::class;
    case HTTP = HttpBuilder::class;
}
