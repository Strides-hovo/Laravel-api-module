<?php echo '<?php'; ?>

namespace {{ $namespace }};

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class {{$class}} extends Model
{
    use HasFactory;

    protected $fillable = [];

}

