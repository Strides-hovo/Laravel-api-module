{!! '<?php' !!}

namespace {{ $namespace }};

use Illuminate\Database\Eloquent\Factories\Factory;

class {{ $class }} extends Factory
{

    @if($model_namespace)protected $model = \{{ $model_namespace }}::class; @endif

    public function definition()
    {
        return [
            //
        ];
    }
}

