<?php echo '<?php'; ?>

namespace {{ $namespace }};

use Illuminate\Http\Resources\Json\ResourceCollection;

class {{ $class }} extends ResourceCollection
{

    public function toArray($request)
    {
        return $this->collection;
    }
}
