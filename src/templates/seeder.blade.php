<?php echo '<?php'; ?>

namespace {{ $namespace }};

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
@if($model_namespace)use {{ $model_namespace }};@endif
@if($factory_namespace)use {{ $factory_namespace }}; @endif

class {{ $class }} extends Seeder
{

    public function run()
    {
        Model::unguard();
        @if($factory){{ $factory }}::new()->count(5)->create();@endif
        Model::reguard();
    }
}
