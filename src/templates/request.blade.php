<?php echo '<?php'; ?>

namespace {{ $namespace }};

use Illuminate\Foundation\Http\FormRequest;

class {{ $class }} extends FormRequest
{

    public function rules()
    {
        return [
            //
        ];
    }


    public function authorize()
    {
        return true;
    }
}
