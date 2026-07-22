<?php

declare(strict_types=1);

namespace Strides\Module;

use Illuminate\Support\Facades\Config;
use Symfony\Component\Process\Process;

/**
 * Runs laravel/pint on newly generated files to format them to PSR-12 style on the fly.
 */
class PintFormatter
{
    /**
     * Позволяет тестам явно задать путь к бинарнику, минуя автопоиск.
     */
    private static ?string $binaryOverride = null;

    /**
     * Set a custom binary path for testing.
     */
    public static function useBinary(?string $path): void
    {
        self::$binaryOverride = $path;
    }

    /**
     * Run the Pint formatter command on the given list of file paths.
     *
     * @param  array<int, string>  $filePaths
     */
    public static function format(array $filePaths): bool
    {
        if (! self::isEnabled() || empty($filePaths)) {
            return false;
        }

        $binary = self::resolveBinary();

        if ($binary === null) {
            return false;
        }

        $process = new Process([$binary, '--quiet', ...$filePaths]);
        $process->setTimeout(30);
        $process->run();

        return $process->isSuccessful();
    }

    /**
     * Check if the formatter is enabled in the configuration.
     */
    private static function isEnabled(): bool
    {
        return (bool) Config::get('module.format_with_pint', true);
    }

    /**
     * Resolve the absolute path to the Pint binary executable.
     */
    private static function resolveBinary(): ?string
    {
        if (self::$binaryOverride !== null) {
            return is_file(self::$binaryOverride) ? self::$binaryOverride : null;
        }

        foreach (self::candidatePaths() as $candidate) {
            if (is_file($candidate)) {
                return $candidate;
            }
        }

        return null;
    }

    /**
     * Get candidate locations of the vendor/bin/pint file.
     *
     * @return string[]
     */
    private static function candidatePaths(): array
    {
        return [
            // Хост-приложение, использующее этот пакет как зависимость.
            base_path('vendor/bin/pint'),
            // Разработка самого пакета (composer install внутри пакета).
            dirname(__DIR__).'/vendor/bin/pint',
        ];
    }
}
