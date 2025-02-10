<?php echo '<?php'; ?>

namespace {{ $namespace }};

use PHPUnit\Framework\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class {{$class}} extends TestCase
{
    public function testExample()
    {
        $this->assertTrue(true);
    }
}
