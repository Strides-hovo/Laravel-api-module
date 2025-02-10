<?php echo '<?php'; ?>

namespace {{ $namespace }};

use Illuminate\Support\ServiceProvider;

class {{ $class }} extends ServiceProvider
{

    public function boot()
    {
    }

    public function register()
    {
        $this->app->register({{$route_provider}}::class);
    }

}
