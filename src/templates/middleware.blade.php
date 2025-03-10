<?php echo '<?php'; ?>

namespace {{ $namespace }};

use Closure;
use Illuminate\Http\Request;

class {{ $class }}
{

    public function handle(Request $request, Closure $next)
    {
        return $next($request);
    }
}
