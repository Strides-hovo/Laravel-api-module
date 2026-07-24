import React, { useState } from 'react';
import {
    Terminal,
    Copy,
    Check,
    Box,
    Database,
    Zap,
    FolderTree,
    Github,
    ChevronRight,
    BookOpen
} from 'lucide-react';

export default function App() {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('make');

    const installCommand = 'composer require strides-hovo/laravel-api-module';

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const commands = {
        make: {
            cmd: 'php artisan module:make User',
            desc: 'Создает новый API-модуль с полной структурой.',
            output: `[SUCCESS] Module [User] created successfully!\n├── Controllers/UserController.php\n├── Models/User.php\n└── Routes/api.php`
        },
        list: {
            cmd: 'php artisan module:list',
            desc: 'Выводит список всех зарегистрированных модулей.',
            output: `+---------+--------+------------------+\n| Module  | Status | Path             |\n+---------+--------+------------------+\n| User    | Active | app/Modules/User |\n+---------+--------+------------------+`
        },
        delete: {
            cmd: 'php artisan module:delete User',
            desc: 'Удаляет модуль и создает бэкап таблиц БД.',
            output: `[INFO] Creating DB backup for module [User]...\n[SUCCESS] Module deleted safely.`
        }
    };

    return (
        <div className="min-h-screen bg-[#090d16] text-slate-200 font-sans">

            {/* Header */}
            <header className="border-b border-slate-800 bg-[#090d16]/80 sticky top-0 backdrop-blur z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-blue-400">
                            <Box className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg text-white">Laravel API Module</span>
                    </div>
                    <a
                        href="https://github.com/Strides-hovo/Laravel-api-module"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 text-sm bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-full transition"
                    >
                        <Github className="w-4 h-4" />
                        <span>Repository</span>
                    </a>
                </div>
            </header>

            {/* Main Container */}
            <main className="max-w-6xl mx-auto px-6 py-12">

                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                        Laravel API Module: Your Clean, <br />
                        <span className="text-blue-500">Modular REST API Architecture</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                        Организуйте ваш Laravel API на независимые модули с поддержкой автоматических бэкапов и готовыми Artisan-командами.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="#install" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition flex items-center gap-2 shadow-lg shadow-blue-500/20">
                            <Zap className="w-4 h-4" />
                            <span>Install via Composer</span>
                        </a>
                        <a href="https://github.com/Strides-hovo/Laravel-api-module" target="_blank" rel="noreferrer" className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium rounded-xl transition flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Documentation</span>
                        </a>
                    </div>
                </div>

                {/* Installation Section */}
                <div id="install" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="md:col-span-2 bg-[#111726] border border-slate-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-2">Installation</h2>
                        <p className="text-slate-400 text-sm mb-4">Установите пакет в ваш проект через Composer:</p>
                        <div className="bg-[#090d16] border border-slate-800 rounded-xl p-3 flex items-center justify-between font-mono text-sm text-blue-400">
                            <span>$ {installCommand}</span>
                            <button
                                onClick={() => copyToClipboard(installCommand)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-sans rounded-lg transition flex items-center gap-1.5"
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copied ? 'Copied!' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-2">Key Focus</h2>
                        <p className="text-slate-400 text-sm mb-4">Создан специально для современной разработки JSON API на Laravel.</p>
                        <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-emerald-400">
                            <Check className="w-4 h-4" />
                            <span>PSR-4 Autoloading Ready</span>
                        </div>
                    </div>
                </div>

                {/* Interactive Terminal & Structure */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

                    {/* Terminal */}
                    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Artisan Commands</h2>
                        <div className="bg-[#090d16] border border-slate-800 rounded-xl overflow-hidden">
                            <div className="flex border-b border-slate-800 bg-slate-900/50 p-2 gap-2">
                                {['make', 'delete', 'list'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                                            activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                                        }`}
                                    >
                                        module:{tab}
                                    </button>
                                ))}
                            </div>
                            <div className="p-4 font-mono text-xs">
                                <div className="text-slate-500 mb-2">// {commands[activeTab].desc}</div>
                                <div className="text-blue-400 mb-3">$ {commands[activeTab].cmd}</div>
                                <pre className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-slate-300">
                  {commands[activeTab].output}
                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Structure */}
                    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Modular Structure</h2>
                        <div className="bg-[#090d16] border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300">
                            <div className="text-slate-500 mb-2">// Структура модуля app/Modules/User</div>
                            <div className="text-blue-400 font-bold mb-1">app/Modules/User/</div>
                            <div className="pl-4 border-l border-slate-800 ml-1 space-y-1">
                                <div>├── Controllers/ <span className="text-slate-500">UserController.php</span></div>
                                <div>├── Models/ <span className="text-slate-500">User.php</span></div>
                                <div>├── Migrations/</div>
                                <div>└── Routes/ <span className="text-emerald-400">api.php</span></div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Feature icon={Box} title="Modular Isolation" desc="Разделение логики на изолированные модули." />
                    <Feature icon={Terminal} title="Artisan CLI" desc="Генерация и управление через консоль." />
                    <Feature icon={Database} title="Auto-Backups" desc="Бэкап таблиц перед удалением модуля." />
                    <Feature icon={Zap} title="CI/CD Ready" desc="Поддержка --force для авто-пайплайнов." />
                </div>

            </main>
        </div>
    );
}

function Feature({ icon: Icon, title, desc }) {
    return (
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5">
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg w-max text-blue-400 mb-3">
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white mb-1">{title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
        </div>
    );
}