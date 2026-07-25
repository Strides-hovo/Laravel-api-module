import React, {useMemo, useState} from 'react';
import {PageId} from '../../types';
import {VersionDocData} from '../../services/api';

interface CommandsPageProps {
  onNavigate: (pageId: PageId) => void;
  onOpenCli?: () => void;
  docData?: VersionDocData | null;
}

export interface CommandArgument {
  name: string;
  required?: boolean;
  description: string;
}

export interface CommandOption {
  flag: string;
  description: string;
}

export interface CommandItem {
  name: string;
  description: string;
  category: 'management' | 'generators' | 'database';
  signature: string;
  arguments?: CommandArgument[];
  options?: CommandOption[];
  example: string;
}

const COMMANDS: CommandItem[] = [
  // 1. Module Management
  {
    name: 'module:make-module',
    description: 'Create a new module directory structure and Service Provider.',
    category: 'management',
    signature: 'module:make-module [moduleName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module to create (e.g., Order)' },
    ],
    options: [
      { flag: '--force', description: 'Run without confirmation prompt' },
    ],
    example: 'php artisan module:make-module Order',
  },
  {
    name: 'module:list',
    description: 'Display a list of all registered modules and their current status.',
    category: 'management',
    signature: 'module:list',
    example: 'php artisan module:list',
  },
  {
    name: 'module:enable',
    description: 'Enable a previously disabled module.',
    category: 'management',
    signature: 'module:enable {moduleName}',
    arguments: [
      { name: 'moduleName', required: true, description: 'Name of the module to enable' },
    ],
    example: 'php artisan module:enable Order',
  },
  {
    name: 'module:disable',
    description: 'Disable a module without deleting its files.',
    category: 'management',
    signature: 'module:disable {moduleName}',
    arguments: [
      { name: 'moduleName', required: true, description: 'Name of the module to disable' },
    ],
    example: 'php artisan module:disable Order',
  },
  {
    name: 'module:delete',
    description: 'Remove a module from the registry without deleting files on disk.',
    category: 'management',
    signature: 'module:delete {moduleName}',
    arguments: [
      { name: 'moduleName', required: true, description: 'Name of the module to delete' },
    ],
    options: [
      { flag: '-f, --force', description: 'Force execution without confirmation prompt' },
      { flag: '--db', description: 'Rollback module database migrations before deleting' },
    ],
    example: 'php artisan module:delete Order --force',
  },
  {
    name: 'module:optimize',
    description: 'Remove entries from modules_name.json whose directories no longer exist.',
    category: 'management',
    signature: 'module:optimize',
    example: 'php artisan module:optimize',
  },
  {
    name: 'module:config-publish',
    description: 'Publish configuration file for a module.',
    category: 'management',
    signature: 'module:config-publish {moduleName}',
    arguments: [
      { name: 'moduleName', required: true, description: 'Name of the module' },
    ],
    example: 'php artisan module:config-publish Order',
  },

  // 2. Migrations and Seeds
  {
    name: 'module:make-migration',
    description: 'Create a new migration file inside a module.',
    category: 'database',
    signature: 'module:make-migration [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module (e.g., Order)' },
      { name: 'fileName', required: false, description: 'Name of the migration (e.g., create_orders_table)' },
    ],
    options: [
      { flag: '-t, --table[=TABLE]', description: 'Specify the table name applied to the migration' },
    ],
    example: 'php artisan module:make-migration Order create_orders_table --table=orders',
  },
  {
    name: 'module:migrate',
    description: 'Run pending migrations for a module.',
    category: 'database',
    signature: 'module:migrate [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Specific migration file name' },
    ],
    options: [
      { flag: '--pretend', description: 'Output the SQL queries without executing them' },
      { flag: '--step', description: 'Force the migrations to run individually' },
      { flag: '--graceful', description: 'Exit gracefully without error code if issues occur' },
      { flag: '--seed', description: 'Re-run seeders after migration completes' },
      { flag: '--seeder[=SEEDER]', description: 'Specify root seeder class' },
      { flag: '--database[=DATABASE]', description: 'Specify database connection name' },
      { flag: '--force', description: 'Force execution in production' },
    ],
    example: 'php artisan module:migrate Order --seed',
  },
  {
    name: 'module:migrate-rollback',
    description: 'Rollback the last batch of database migrations for a module.',
    category: 'database',
    signature: 'module:migrate-rollback [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the migration' },
    ],
    options: [
      { flag: '--pretend', description: 'Dump SQL queries for rollback' },
      { flag: '--database[=DATABASE]', description: 'Database connection name' },
      { flag: '--force', description: 'Force execution without confirmation' },
    ],
    example: 'php artisan module:migrate-rollback Order',
  },
  {
    name: 'module:migrate-reset',
    description: 'Reset and rollback all migrations for a module.',
    category: 'database',
    signature: 'module:migrate-reset [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the migration' },
    ],
    options: [
      { flag: '--pretend', description: 'Dump SQL queries' },
      { flag: '--database[=DATABASE]', description: 'Database connection name' },
      { flag: '--force', description: 'Force execution without confirmation' },
    ],
    example: 'php artisan module:migrate-reset Order',
  },
  {
    name: 'module:migrate-refresh',
    description: 'Rollback and re-run all migrations for a module.',
    category: 'database',
    signature: 'module:migrate-refresh [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the migration' },
    ],
    options: [
      { flag: '--step', description: 'Step-by-step migration rollback' },
      { flag: '--seed', description: 'Re-run seeders' },
      { flag: '--seeder[=SEEDER]', description: 'Root seeder class' },
      { flag: '--database[=DATABASE]', description: 'Database connection' },
      { flag: '--force', description: 'Force execution without confirmation' },
    ],
    example: 'php artisan module:migrate-refresh Order --seed',
  },
  {
    name: 'module:migrate-fresh',
    description: 'Drop all tables and re-run all migrations from scratch.',
    category: 'database',
    signature: 'module:migrate-fresh [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the migration' },
    ],
    options: [
      { flag: '--drop-types', description: 'Drop custom types (PostgreSQL only)' },
      { flag: '--drop-views', description: 'Drop all database views' },
      { flag: '--step', description: 'Run migrations step by step' },
      { flag: '--seed', description: 'Run database seeders' },
      { flag: '--seeder[=SEEDER]', description: 'Seeder class name' },
      { flag: '--database[=DATABASE]', description: 'Database connection' },
      { flag: '--force', description: 'Force execution without confirmation' },
    ],
    example: 'php artisan module:migrate-fresh Order --seed',
  },
  {
    name: 'module:migrate-status',
    description: 'Show the current migration status for a module.',
    category: 'database',
    signature: 'module:migrate-status [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Specific migration file name' },
    ],
    example: 'php artisan module:migrate-status Order',
  },
  {
    name: 'module:seed',
    description: 'Run database seeders for a module.',
    category: 'database',
    signature: 'module:seed [moduleName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
    ],
    options: [
      { flag: '--database[=DATABASE]', description: 'Database connection' },
      { flag: '--force', description: 'Force execution in production' },
    ],
    example: 'php artisan module:seed Order',
  },

  // 3. Class Generators (make:*)
  {
    name: 'module:make-controller',
    description: 'Create a Controller class inside a module.',
    category: 'generators',
    signature: 'module:make-controller [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module (e.g., Order)' },
      { name: 'fileName', required: false, description: 'Name of the controller (e.g., OrderController)' },
    ],
    options: [
      { flag: '-r, --request', description: 'Create associated FormRequest class' },
      { flag: '-e, --resource', description: 'Create associated API Resource class' },
      { flag: '-t, --transformer', description: 'Create associated Transformer class' },
      { flag: '-s, --service', description: 'Create associated Service class' },
      { flag: '-a, --action', description: 'Specify associated Action name' },
      { flag: '-T, --test', description: 'Create accompanying test file' },
      { flag: '-f, --force', description: 'Force execution without confirmation' },
      { flag: '--all', description: 'Generate all related resources (request, resource, transformer, service, action)' },
    ],
    example: 'php artisan module:make-controller Order OrderController --all',
  },
  {
    name: 'module:make-model',
    description: 'Create an Eloquent Model inside a module.',
    category: 'generators',
    signature: 'module:make-model [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module (e.g., Order)' },
      { name: 'fileName', required: false, description: 'Name of the model (e.g., Order)' },
    ],
    options: [
      { flag: '-m, --migration', description: 'Create a migration file for the model' },
      { flag: '-c, --controller', description: 'Create a controller for the model' },
      { flag: '-R, --request', description: 'Create a FormRequest class' },
      { flag: '-r, --resource', description: 'Create an API Resource class' },
      { flag: '-S, --service', description: 'Create a Service class' },
      { flag: '-t, --transformer', description: 'Create a Transformer class' },
      { flag: '-a, --action', description: 'Create an Action class' },
      { flag: '--policy', description: 'Create a Policy class' },
      { flag: '-f, --factory', description: 'Create a Factory class' },
      { flag: '-s, --seed', description: 'Create a Seeder class' },
      { flag: '--morph-pivot', description: 'Model as custom polymorphic pivot table' },
      { flag: '-p, --pivot', description: 'Model as custom pivot table' },
      { flag: '--test', description: 'Create an accompanying test' },
      { flag: '--force', description: 'Force execution without confirmation' },
      { flag: '--all', description: 'Create migration, seeder, factory, policy, test, and controller' },
    ],
    example: 'php artisan module:make-model Order Order --all',
  },
  {
    name: 'module:make-request',
    description: 'Create a FormRequest class for request validation.',
    category: 'generators',
    signature: 'module:make-request [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Request class (e.g., StoreOrderRequest)' },
    ],
    example: 'php artisan module:make-request Order StoreOrderRequest',
  },
  {
    name: 'module:make-resource',
    description: 'Create an API Resource for JSON data transformation.',
    category: 'generators',
    signature: 'module:make-resource [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Resource class (e.g., OrderResource)' },
    ],
    options: [
      { flag: '-c, --collection', description: 'Create a Resource Collection' },
      { flag: '-f, --force', description: 'Force execution without confirmation' },
    ],
    example: 'php artisan module:make-resource Order OrderResource',
  },
  {
    name: 'module:make-transformer',
    description: 'Create a Transformer class for custom data formatting.',
    category: 'generators',
    signature: 'module:make-transformer [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Transformer class (e.g., OrderTransformer)' },
    ],
    example: 'php artisan module:make-transformer Order OrderTransformer',
  },
  {
    name: 'module:make-service',
    description: 'Create a Service class layer for business logic.',
    category: 'generators',
    signature: 'module:make-service [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Service class (e.g., OrderService)' },
    ],
    example: 'php artisan module:make-service Order OrderService',
  },
  {
    name: 'module:make-action',
    description: 'Create an Action class for single-purpose domain business scenarios.',
    category: 'generators',
    signature: 'module:make-action {moduleName} [fileName]',
    arguments: [
      { name: 'moduleName', required: true, description: 'Name of the module (required)' },
      { name: 'fileName', required: false, description: 'Name of the Action class (e.g., CreateOrderAction)' },
    ],
    example: 'php artisan module:make-action Order CreateOrderAction',
  },
  {
    name: 'module:make-repository',
    description: 'Create a Repository class for database query abstraction.',
    category: 'generators',
    signature: 'module:make-repository [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Repository class (e.g., OrderRepository)' },
    ],
    options: [
      { flag: '--model=MODEL', description: 'Specify the model class for the repository (required)' },
      { flag: '-f, --force', description: 'Force execution without confirmation' },
    ],
    example: 'php artisan module:make-repository Order OrderRepository --model=Order',
  },
  {
    name: 'module:make-policy',
    description: 'Create a Policy class for action authorization.',
    category: 'generators',
    signature: 'module:make-policy [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Policy class (e.g., OrderPolicy)' },
    ],
    options: [
      { flag: '-m, --model[=MODEL]', description: 'Model applied to the policy' },
      { flag: '-g, --guard[=GUARD]', description: 'Guard name used by the policy' },
      { flag: '-f, --force', description: 'Force execution without confirmation' },
    ],
    example: 'php artisan module:make-policy Order OrderPolicy --model=Order',
  },
  {
    name: 'module:make-factory',
    description: 'Create a Model Factory for generating test data.',
    category: 'generators',
    signature: 'module:make-factory [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Factory class (e.g., OrderFactory)' },
    ],
    options: [
      { flag: '-m, --model[=MODEL]', description: 'Model applied to the factory' },
      { flag: '-f, --force', description: 'Force execution without confirmation' },
    ],
    example: 'php artisan module:make-factory Order OrderFactory --model=Order',
  },
  {
    name: 'module:make-seeder',
    description: 'Create a Seeder class for seeding module tables.',
    category: 'generators',
    signature: 'module:make-seeder [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Seeder class (e.g., OrderSeeder)' },
    ],
    example: 'php artisan module:make-seeder Order OrderSeeder',
  },
  {
    name: 'module:make-event',
    description: 'Create an Event class inside a module.',
    category: 'generators',
    signature: 'module:make-event [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Event class (e.g., OrderCreatedEvent)' },
    ],
    example: 'php artisan module:make-event Order OrderCreatedEvent',
  },
  {
    name: 'module:make-listener',
    description: 'Create an Event Listener class for handling events.',
    category: 'generators',
    signature: 'module:make-listener [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Listener class (e.g., SendOrderNotification)' },
    ],
    options: [
      { flag: '-e, --event[=EVENT]', description: 'Specify bound Event class' },
      { flag: '-f, --force', description: 'Force execution without confirmation' },
    ],
    example: 'php artisan module:make-listener Order SendOrderNotification --event=OrderCreatedEvent',
  },
  {
    name: 'module:make-job',
    description: 'Create a Queue Job class for background tasks.',
    category: 'generators',
    signature: 'module:make-job [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Job class (e.g., ProcessOrderJob)' },
    ],
    example: 'php artisan module:make-job Order ProcessOrderJob',
  },
  {
    name: 'module:make-mail',
    description: 'Create a Mailable class for sending emails.',
    category: 'generators',
    signature: 'module:make-mail [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Mailable class (e.g., OrderInvoiceMail)' },
    ],
    options: [
      { flag: '--view', description: 'Create an associated Blade view template for the mail' },
      { flag: '-f, --force', description: 'Force execution without confirmation' },
    ],
    example: 'php artisan module:make-mail Order OrderInvoiceMail --view',
  },
  {
    name: 'module:make-notification',
    description: 'Create a Notification class for sending alerts.',
    category: 'generators',
    signature: 'module:make-notification [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Notification class (e.g., OrderShippedNotification)' },
    ],
    example: 'php artisan module:make-notification Order OrderShippedNotification',
  },
  {
    name: 'module:make-middleware',
    description: 'Create a Middleware class inside a module.',
    category: 'generators',
    signature: 'module:make-middleware [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Middleware class (e.g., CheckOrderAccess)' },
    ],
    example: 'php artisan module:make-middleware Order CheckOrderAccess',
  },
  {
    name: 'module:make-rule',
    description: 'Create a custom Validation Rule class.',
    category: 'generators',
    signature: 'module:make-rule [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Rule class (e.g., ValidSKURule)' },
    ],
    example: 'php artisan module:make-rule Order ValidSKURule',
  },
  {
    name: 'module:make-dto',
    description: 'Create a DTO (Data Transfer Object) class for strictly typed data passing.',
    category: 'generators',
    signature: 'module:make-dto [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the DTO class (e.g., CreateOrderDTO)' },
    ],
    example: 'php artisan module:make-dto Order CreateOrderDTO',
  },
  {
    name: 'module:make-command',
    description: 'Create a custom Artisan command inside a module.',
    category: 'generators',
    signature: 'module:make-command [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Command class (e.g., ProcessOrdersCommand)' },
    ],
    example: 'php artisan module:make-command Order ProcessOrdersCommand',
  },
  {
    name: 'module:make-test',
    description: 'Create a Unit or Feature test class inside a module.',
    category: 'generators',
    signature: 'module:make-test [moduleName] [fileName]',
    arguments: [
      { name: 'moduleName', required: false, description: 'Name of the module' },
      { name: 'fileName', required: false, description: 'Name of the Test class (e.g., OrderTest)' },
    ],
    options: [
      { flag: '-t, --type[=TYPE]', description: 'Test type: unit or feature (default: unit)' },
      { flag: '-f, --force', description: 'Force execution without confirmation' },
    ],
    example: 'php artisan module:make-test Order OrderTest --type=unit',
  },
];

const getBaseCommand = (cmd: CommandItem): string => {
  const parts = cmd.example.split(' ');
  const baseParts = parts.filter((p) => !p.startsWith('-'));
  return baseParts.join(' ');
};

const getDefaultOptions = (cmd: CommandItem): string[] => {
  const parts = cmd.example.split(' ');
  return parts.filter((p) => p.startsWith('-'));
};

const getCleanFlagValue = (flagStr: string): string => {
  if (flagStr.includes('TABLE')) return '--table=orders';
  if (flagStr.includes('SEEDER')) return '--seeder=OrderSeeder';
  if (flagStr.includes('DATABASE')) return '--database=mysql';
  if (flagStr.includes('MODEL')) return '--model=Order';
  if (flagStr.includes('GUARD')) return '--guard=api';
  if (flagStr.includes('EVENT')) return '--event=OrderCreatedEvent';
  if (flagStr.includes('TYPE')) return '--type=unit';

  if (flagStr.includes(',')) {
    return flagStr.split(',')[0].trim();
  }
  return flagStr.trim();
};

const isOptionSelected = (opt: CommandOption, activeFlags: string[]): boolean => {
  const cleanVal = getCleanFlagValue(opt.flag);
  if (activeFlags.includes(cleanVal)) return true;

  const parts = opt.flag.split(',').map((p) => p.trim().replace(/\[.*\]|=.*/g, ''));
  return activeFlags.some((af) => {
    const cleanAf = af.split('=')[0];
    return parts.some((p) => p === cleanAf || p === af);
  });
};

export const CommandsPage: React.FC<CommandsPageProps> = ({ onNavigate, onOpenCli, docData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'management' | 'generators' | 'database'>('all');
  const [expandedCommand, setExpandedCommand] = useState<string | null>(null);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

  const getDynamicCommand = (cmd: CommandItem): string => {
    const activeFlags = selectedOptions[cmd.name] !== undefined
        ? selectedOptions[cmd.name]
        : getDefaultOptions(cmd);
    const baseCmd = getBaseCommand(cmd);
    if (activeFlags.length === 0) {
      return baseCmd;
    }
    return `${baseCmd} ${activeFlags.join(' ')}`;
  };

  const handleOptionToggle = (cmd: CommandItem, opt: CommandOption, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentActive = selectedOptions[cmd.name] !== undefined
        ? selectedOptions[cmd.name]
        : getDefaultOptions(cmd);

    const cleanVal = getCleanFlagValue(opt.flag);
    const selected = isOptionSelected(opt, currentActive);

    let nextFlags: string[];

    if (selected) {
      const parts = opt.flag.split(',').map((p) => p.trim().replace(/\[.*\]|=.*/g, ''));
      nextFlags = currentActive.filter((af) => {
        const cleanAf = af.split('=')[0];
        return !parts.some((p) => p === cleanAf || p === af);
      });
    } else {
      if (cleanVal === '--all' || opt.flag.includes('--all')) {
        nextFlags = ['--all'];
      } else {
        const withoutAll = currentActive.filter((af) => af !== '--all');
        nextFlags = [...withoutAll, cleanVal];
      }
    }

    setSelectedOptions((prev) => ({
      ...prev,
      [cmd.name]: nextFlags,
    }));
  };

  const dynamicCommands = useMemo(() => {
    return [...COMMANDS];
  }, [docData]);

  const filteredCommands = dynamicCommands.filter((cmd) => {
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
    const matchesSearch =
        cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.signature.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cmd.options && cmd.options.some((opt) => opt.flag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (cmdText: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(cmdText);
    setCopiedCommand(cmdText);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const toggleExpand = (name: string) => {
    setExpandedCommand((prev) => (prev === name ? null : name));
  };

  return (
      <div className="space-y-8">
        {/* Page Header */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#7bd0ff] font-code text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span>ARTISAN COMMAND REFERENCE</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-[#f8fafc] tracking-tight">
                Artisan Commands
              </h1>
              <p className="text-[#94a3b8] text-base md:text-lg max-w-2xl mt-2 leading-relaxed">
                Complete reference for all <span className="text-[#ffb690] font-bold">33 Artisan commands</span> in the package. Argument order: <code className="bg-[#1e293b] text-[#7bd0ff] px-1.5 py-0.5 rounded font-code text-xs">command moduleName fileName [options]</code>
              </p>
            </div>

            {onOpenCli && (
                <button
                    onClick={onOpenCli}
                    className="bg-[#ffb690] text-[#552100] px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-[#ffa26b] transition-all flex items-center gap-2 shrink-0 shadow-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                  <span>Open Interactive CLI</span>
                </button>
            )}
          </div>
        </section>

        {/* Filter and Search Bar */}
        <section className="bg-[#131b2e] border border-[#334155] rounded-xl p-4 md:p-6 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[20px]">
              search
            </span>
              <input
                  type="text"
                  placeholder="Search (e.g. module:make, Order, --force)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-[#334155] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#ffb690] transition-colors"
              />
              {searchQuery && (
                  <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#f8fafc]"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {[
                { id: 'all', label: `All (${dynamicCommands.length})` },
                { id: 'management', label: `Management (${dynamicCommands.filter((c) => c.category === 'management').length})` },
                { id: 'database', label: `Migrations & DB (${dynamicCommands.filter((c) => c.category === 'database').length})` },
                { id: 'generators', label: `Generators (${dynamicCommands.filter((c) => c.category === 'generators').length})` },
              ].map((cat) => (
                  <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                          selectedCategory === cat.id
                              ? 'bg-[#ffb690] text-[#552100]'
                              : 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155] hover:text-[#f8fafc]'
                      }`}
                  >
                    {cat.label}
                  </button>
              ))}
            </div>
          </div>
        </section>

        {/* Order Notice Info Card */}
        <div className="bg-[#ffb690]/5 border-l-4 border-[#ffb690] p-4 rounded-r-lg flex items-start gap-3 text-xs md:text-sm text-[#cbd5e1] leading-relaxed">
          <span className="material-symbols-outlined text-[#ffb690] text-[20px] shrink-0 mt-0.5">info</span>
          <div>
            <strong className="text-[#f8fafc] font-bold">Correct Generator Argument Order:</strong>
            <p className="mt-0.5 text-[#94a3b8]">
              Specify the command name first (e.g., <code className="text-[#ffb690]">module:make-controller</code>), followed by the module name (e.g., <code className="text-[#7bd0ff]">Order</code>), and thirdly the class/file name (e.g., <code className="text-[#7bd0ff]">OrderController</code>).
            </p>
          </div>
        </div>

        {/* Dynamic Admin / Resource Editor Features & Commands Banner */}
        {docData?.features && docData.features.length > 0 && (
            <div className="bg-[#131b2e] border-2 border-[#38bdf8]/50 rounded-xl p-5 md:p-6 shadow-[0_0_25px_rgba(56,189,248,0.15)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#334155] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#38bdf8]/20 text-[#38bdf8] rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-[#f8fafc] flex items-center gap-2">
                      <span>✨ Commands and capabilities of the version v{docData.version}</span>

                    </h3>

                  </div>
                </div>
                <span className="text-xs font-code text-[#ffb690] bg-[#1e293b] px-3 py-1 rounded-full border border-[#334155]">
              {docData.features.length} features
            </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {docData.features.map((feat, idx) => {
                  const isCmd = feat.includes(':') || feat.toLowerCase().includes('command') || feat.startsWith('module') || feat.startsWith('php ') || feat.startsWith('make');
                  const cmdText = feat.startsWith('php ') ? feat : `php artisan ${feat.split(' ')[0]}`;
                  return (
                      <div key={idx} className="bg-[#0b0f19] border border-[#334155] hover:border-[#38bdf8]/60 p-3.5 rounded-xl transition-all flex items-start justify-between gap-3 group">
                        <div className="flex items-start gap-2.5 min-w-0">
                    <span className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${isCmd ? 'text-[#38bdf8]' : 'text-[#10b981]'}`}>
                      {isCmd ? 'terminal' : 'check_circle'}
                    </span>
                          <div className="min-w-0">
                            <div className="text-xs md:text-sm font-bold text-[#f8fafc] break-words font-code">
                              {feat}
                            </div>
                            <div className="text-[11px] text-[#94a3b8] mt-0.5">
                              {isCmd ? 'Integrated into the list of Artisan commands below' : 'Active version capability ' + docData.version}
                            </div>
                          </div>
                        </div>
                        {isCmd && (
                            <button
                                onClick={(e) => handleCopy(cmdText, e)}
                                className="p-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-[#7bd0ff] transition-colors shrink-0"
                                title="Copy artisan command"
                            >
                      <span className="material-symbols-outlined text-[16px]">
                        {copiedCommand === cmdText ? 'check' : 'content_copy'}
                      </span>
                            </button>
                        )}
                      </div>
                  );
                })}
              </div>
            </div>
        )}

        {/* Commands List Grid */}
        <div className="space-y-3">
          {filteredCommands.length === 0 ? (
              <div className="bg-[#131b2e] border border-[#334155] rounded-xl p-8 text-center text-[#94a3b8]">
                <span className="material-symbols-outlined text-[36px] text-[#64748b] mb-2">search_off</span>
                <p>No Artisan commands found matching "{searchQuery}"</p>
              </div>
          ) : (
              filteredCommands.map((cmd) => {
                const isExpanded = expandedCommand === cmd.name;
                const dynamicCommandText = getDynamicCommand(cmd);
                const isCopied = copiedCommand === dynamicCommandText;

                return (
                    <div
                        key={cmd.name}
                        onClick={() => toggleExpand(cmd.name)}
                        className={`bg-[#131b2e] border rounded-xl transition-all cursor-pointer shadow-md overflow-hidden ${
                            isExpanded ? 'border-[#ffb690] bg-[#162036]' : 'border-[#334155] hover:border-[#ffb690]/50'
                        }`}
                    >
                      {/* Main Header Row */}
                      <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-code font-bold text-sm md:text-base text-[#7bd0ff]">
                        php artisan {cmd.name}
                      </span>
                            <span
                                className={`text-[10px] font-code font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                    cmd.category === 'management'
                                        ? 'bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20'
                                        : cmd.category === 'generators'
                                            ? 'bg-[#a78bfa]/10 text-[#a78bfa] border border-[#a78bfa]/20'
                                            : 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20'
                                }`}
                            >
                        {cmd.category === 'management' ? 'Management' : cmd.category === 'generators' ? 'Generator' : 'Database'}
                      </span>
                            {cmd.arguments && cmd.arguments.length > 0 && (
                                <span className="text-[10px] font-code bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded">
                          {cmd.arguments.length} {cmd.arguments.length === 1 ? 'argument' : 'arguments'}
                        </span>
                            )}
                            {cmd.options && cmd.options.length > 0 && (
                                <span className="text-[10px] font-code bg-[#1e293b] text-[#ffb690] px-2 py-0.5 rounded">
                          {cmd.options.length} {cmd.options.length === 1 ? 'option' : 'options'}
                        </span>
                            )}
                          </div>

                          <p className="text-xs md:text-sm text-[#94a3b8] leading-relaxed">{cmd.description}</p>

                          <div className="text-[11px] font-code text-[#64748b] flex items-center gap-2 pt-1 flex-wrap">
                            <span className="text-[#ffb95f]">Example:</span>
                            <code className="text-[#cbd5e1] bg-[#0b0f19] px-2 py-0.5 rounded border border-[#334155]/60">
                              {dynamicCommandText}
                            </code>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                          <button
                              onClick={(e) => handleCopy(dynamicCommandText, e)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-code flex items-center gap-1.5 transition-all ${
                                  isCopied
                                      ? 'bg-[#10b981] text-white'
                                      : 'bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] border border-[#334155]'
                              }`}
                          >
                      <span className="material-symbols-outlined text-[16px]">
                        {isCopied ? 'check' : 'content_copy'}
                      </span>
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>

                          <span className="material-symbols-outlined text-[#94a3b8] text-[20px] transition-transform duration-200">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                        </div>
                      </div>

                      {/* Expanded Details Drawer */}
                      {isExpanded && (
                          <div className="border-t border-[#334155] bg-[#0b0f19] p-4 md:p-6 space-y-5">
                            {/* Interactive Dynamic Command Banner */}
                            <div className="bg-[#1e293b]/80 border-2 border-[#38bdf8]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(56,189,248,0.1)]">
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">bolt</span>
                                  <span className="text-[11px] font-bold uppercase text-[#38bdf8] tracking-wider font-code">
                            Live Dynamic Command (Click flags below to customize)
                          </span>
                                </div>
                                <code className="text-xs md:text-sm font-code text-[#f8fafc] font-bold block break-all bg-[#0b0f19] px-3 py-2 rounded-lg border border-[#334155]">
                                  {dynamicCommandText}
                                </code>
                              </div>
                              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                                {selectedOptions[cmd.name] !== undefined && (
                                    <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedOptions((prev) => {
                                            const copy = { ...prev };
                                            delete copy[cmd.name];
                                            return copy;
                                          });
                                        }}
                                        className="px-2.5 py-2 rounded-lg text-xs font-bold text-[#ffb690] hover:bg-[#ffb690]/10 transition-colors flex items-center gap-1"
                                        title="Reset flags to default"
                                    >
                                      <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                                      <span>Reset</span>
                                    </button>
                                )}
                                <button
                                    onClick={(e) => handleCopy(dynamicCommandText, e)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold font-code flex items-center gap-1.5 transition-all ${
                                        isCopied
                                            ? 'bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                            : 'bg-[#38bdf8] hover:bg-[#38bdf8]/80 text-[#0f172a] shadow-lg'
                                    }`}
                                >
                          <span className="material-symbols-outlined text-[16px]">
                            {isCopied ? 'check' : 'content_copy'}
                          </span>
                                  <span>{isCopied ? 'Copied' : 'Copy Command'}</span>
                                </button>
                              </div>
                            </div>

                            {/* Signature */}
                            <div>
                              <h4 className="text-xs font-bold uppercase text-[#94a3b8] tracking-wider mb-1.5">
                                Command Signature
                              </h4>
                              <code className="block bg-[#1e293b] text-[#7bd0ff] font-code text-xs p-2.5 rounded border border-[#334155]">
                                php artisan {cmd.signature}
                              </code>
                            </div>

                            {/* Arguments */}
                            {cmd.arguments && cmd.arguments.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-bold uppercase text-[#94a3b8] tracking-wider mb-2">
                                    Arguments
                                  </h4>
                                  <div className="space-y-1.5">
                                    {cmd.arguments.map((arg) => (
                                        <div key={arg.name} className="flex items-start gap-2 text-xs">
                              <span className="font-code font-bold text-[#ffb690] shrink-0">
                                {arg.name}
                              </span>
                                          <span
                                              className={`text-[10px] font-code px-1.5 py-0.2 rounded shrink-0 ${
                                                  arg.required
                                                      ? 'bg-[#ef4444]/20 text-[#f87171] border border-[#ef4444]/30'
                                                      : 'bg-[#64748b]/20 text-[#94a3b8]'
                                              }`}
                                          >
                                {arg.required ? 'required' : 'optional'}
                              </span>
                                          <span className="text-[#94a3b8]">{arg.description}</span>
                                        </div>
                                    ))}
                                  </div>
                                </div>
                            )}

                            {/* Options */}
                            {cmd.options && cmd.options.length > 0 && (
                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-2">
                                    <h4 className="text-xs font-bold uppercase text-[#94a3b8] tracking-wider flex items-center gap-1.5">
                                      <span>Flags & Options</span>
                                      <span className="text-[10px] text-[#38bdf8] lowercase font-normal">({cmd.options.length} available — click to toggle)</span>
                                    </h4>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    {cmd.options.map((opt) => {
                                      const activeFlags =
                                          selectedOptions[cmd.name] !== undefined
                                              ? selectedOptions[cmd.name]
                                              : getDefaultOptions(cmd);
                                      const isSelected = isOptionSelected(opt, activeFlags);

                                      return (
                                          <div
                                              key={opt.flag}
                                              onClick={(e) => handleOptionToggle(cmd, opt, e)}
                                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 select-none ${
                                                  isSelected
                                                      ? 'bg-[#38bdf8]/15 border-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.12)]'
                                                      : 'bg-[#131b2e] border-[#334155] hover:border-[#64748b] hover:bg-[#162036]'
                                              }`}
                                          >
                                            <div className="flex items-center justify-between gap-2">
                                  <span
                                      className={`font-code font-bold text-xs ${
                                          isSelected ? 'text-[#38bdf8]' : 'text-[#7bd0ff]'
                                      }`}
                                  >
                                    {opt.flag}
                                  </span>
                                              <span
                                                  className={`material-symbols-outlined text-[18px] transition-transform ${
                                                      isSelected ? 'text-[#38bdf8] scale-110' : 'text-[#64748b] opacity-50'
                                                  }`}
                                              >
                                    {isSelected ? 'check_box' : 'check_box_outline_blank'}
                                  </span>
                                            </div>
                                            <span
                                                className={`text-[11px] leading-relaxed ${
                                                    isSelected ? 'text-[#e2e8f0]' : 'text-[#94a3b8]'
                                                }`}
                                            >
                                  {opt.description}
                                </span>
                                          </div>
                                      );
                                    })}
                                  </div>
                                </div>
                            )}
                          </div>
                      )}
                    </div>
                );
              })
          )}
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-[#334155] flex justify-between items-center">
          <button
              onClick={() => onNavigate('installation')}
              className="flex items-center gap-2 text-xs font-bold text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Installation & Setup</span>
          </button>

          <button
              onClick={() => onNavigate('create-module')}
              className="flex items-center gap-2 text-xs font-bold text-[#ffb690] hover:text-[#ffa26b] transition-colors"
          >
            <span>Create Module</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
  );
};
