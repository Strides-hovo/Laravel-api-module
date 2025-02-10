<?php echo '<?php'; ?>

use Illuminate\Support\Facades\Route;
use {{ $controller_namespace }};

Route::apiResource('{{ $model_name }}', {{ $controller }}::class);
