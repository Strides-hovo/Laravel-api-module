<?php

declare(strict_types=1);

namespace Strides\Module\Contracts;

/**
 * Interface for builders that dynamically parse, resolve, and generate related sub-components.
 */
interface HasRelationsInterface
{
    /**
     * Parse and assign nested components or structures using parsed command options.
     *
     * @param  array<string, mixed>  $options
     */
    public function setRelations(array $options): void;

    /**
     * Retrieve the calibrated, structured mapping of relation dependencies.
     *
     * @return array<string, mixed>
     */
    public function getRelations(): array;

    /**
     * Trigger baseline relationship parsing and structural setup.
     */
    public function init(): void;
}
