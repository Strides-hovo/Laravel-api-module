<?php echo '<?php'; ?>

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::table({{$table}}, function($table) {

        });
    }


    public function down(): void
    {
        Schema::table({{$table}}, function($table) {

        });
    }
};
