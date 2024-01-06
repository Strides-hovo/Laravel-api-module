<?php

namespace Strides\Module\Builders;

use Strides\Module\Enums\BuilderKeysEnum;

/**
 * Class ModelBuilder
 *
 * The `ModelBuilder` class is responsible for generating model files with customizable options.
 * It extends the `AbstractBuilder` class and provides functionality for setting the builder key, replacements,
 * and configuring related builders such as migration, seeder, factory, and controller.
 *
 * @package Strides\Module
 */
class ModelBuilder extends AbstractBuilder
{
    /**
     * Available options for model generation.
     */
    const OPTIONS = [
        'migration' => true,
        'seeder' => true,
        'factory' => true,
        'controller' => true,
    ];

    /**
     * Get the builder key associated with the model.
     *
     * @return BuilderKeysEnum The enumeration value representing the model builder key.
     */
    protected function getBuilderKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::model;
    }

    /**
     * Get the replacement values for customization.
     *
     * @return array An array of replacement values for customization.
     */

    protected function getReplacements(): array
    {
        if (array_key_exists('all', $this->replacements)) {
            $this->replacements = self::OPTIONS;
        }

        $this->setBuilderKey();
        return parent::getReplacements();
    }


    /**
     * Set the builder key for related builders and configure their replacements accordingly.
     */
    private function setBuilderKey(): void
    {
        $builderKey = $this->getBuilderKey()->name;
        SeederBuilder::setOption([$builderKey => true]);
        FactoryBuilder::setReplacement([$builderKey => true]);
        ControllerBuilder::setOption([$builderKey => true]);
        MigrationBuilder::setModelName($this->getFileName());
    }
}
