{!! '<?php' !!}

namespace {{ $namespace }};

use Illuminate\Http\Resources\Json\JsonResource;

class {{ $class }} extends JsonResource
{

    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
