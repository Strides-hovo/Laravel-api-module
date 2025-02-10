<?php echo '<?php'; ?>

namespace {{ $namespace }};

use Illuminate\Foundation\Support\Providers\RouteServiceProvider  as ServiceProvider;
use Illuminate\Support\Facades\Route;

class {{ $class }} extends ServiceProvider
{

    public function boot()
    {
        parent::boot();
    }

    public function map()
    {
       Route::prefix('api')
           ->middleware('api')
            ->group(function () {
               require base_path('{{ $route_file }}');
            });
    }
}
