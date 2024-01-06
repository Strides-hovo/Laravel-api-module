<?php

namespace Strides\Module\Enums;

enum MigrationCommandsEnum: string
{
    case run = 'Running';
    case rollback = 'Rollback';
    case status = 'Status';
    case reset = 'Reset';
    case refresh = 'Refresh';
    case seed = 'Running Seeder';
}
