<?php

namespace Strides\Module\Facades\Migration;

use Strides\Module\Contracts\MigrationFacadeInterface;
use Strides\Module\Contracts\MigrationInfoFacadeInterface;
use Strides\Module\Enums\MigrationCommandsEnum;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\Exceptions\MigrationException;
use Strides\Module\MigrationHelper;

class MigrationFacade implements MigrationFacadeInterface
{

    use MigrationHelper;

    public function __construct(
        private readonly MigrationCommandsEnum        $command,
        private readonly MigrationInfoFacadeInterface $migrationInfo
    )
    {
    }


    /**
     * Get migration options based on the command and module information.
     *
     * @param string|null $moduleName The name of the module for which migration options are retrieved.
     * @param array $option The array of options provided to the migration command.
     * @return array An array of configured migration options.
     * @throws BuilderException
     */

    public function getOption(?string $moduleName, array $option): array
    {

        if ($moduleName) {
            $option['path'] = $this->getMigrationDirectory($moduleName);
            $option = $this->getOptionsWithPrefix($option);
            return [$option];
        }

        return $this->getMigrationOptionsForAllModules('path', $option, [$this, 'getMigrationDirectory']);
    }


    /**
     * Get rollback options based on the module information.
     *
     * @param string|null $moduleName The name of the module for which rollback options are retrieved.
     * @param array $options The array of options provided to the rollback command.
     * @return array An array of configured rollback options.
     * @throws BuilderException
     */

    public function getRollbackOption(?string $moduleName, array $options): array
    {
        $options['step'] = $options['step'] ?? 50;
        $options['force'] = true;

        return $this->getOption($moduleName, $options);
    }


    /**
     * Get seed options based on the module information.
     *
     * @param string|null $moduleName The name of the module for which seed options are retrieved.
     * @param array $options The array of options provided to the seed command.
     * @return array An array of configured seed options.
     * @throws MigrationException
     */

    public function getSeedOption(?string $moduleName, array $options): array
    {
        if ($moduleName) {
            $options['class'] = $this->getSeedClassName($moduleName);
            return [$this->getOptionsWithPrefix($options)];
        }

        return $this->getMigrationOptionsForAllModules('class', $options, [$this, 'getSeedClassName']);
    }


    /**
     * Get refresh options based on the module information.
     *
     * @param string|null $moduleName The name of the module for which refresh options are retrieved.
     * @param array $options The array of options provided to the refresh command.
     * @return array An array of configured refresh options.
     */
    public function getRefreshOption(?string $moduleName, array $options): array
    {
        if (array_key_exists('seed', $options)) {
            $options['force'] = true;
            $options = $this->getSeedOption($moduleName, $options);
        } else {
            $options = $this->getOption($moduleName, $options);
        }
        return $options;
    }
}
