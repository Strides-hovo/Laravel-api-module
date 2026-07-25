import { useEffect, useRef, useState } from 'react'
import { IconFolder, IconCheck } from './icons.tsx'

const COMMAND = 'php artisan module:make Blog'

// depth controls indentation; folders vs files render slightly differently
const TREE = [

    { label: 'Modules/', depth: 0 },
    { label: 'Blog/', depth: 1 },
    { label: 'Entities/Blog.php', depth: 2 },
    { label: 'Http/Controllers/BlogController.php', depth: 2 },
    { label: 'Database/Migrations/create_blogs_table.php', depth: 2 },
    { label: 'Routes/api.php', depth: 2 },
    { label: 'Repositories/BlogRepository.php', depth: 2 },
]

const TYPE_SPEED_MS = 55
const NODE_STAGGER_MS = 180
const HOLD_MS = 2600
const RESET_PAUSE_MS = 700

export default function TerminalDemo() {
    const [typed, setTyped] = useState('')
    const [visibleNodes, setVisibleNodes] = useState(0)
    const [phase, setPhase] = useState('typing') // typing -> building -> holding -> resetting
    const reducedMotion = useRef(
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    )

    useEffect(() => {
        if (reducedMotion.current) {
            // Respect reduced motion: show the finished state statically, no loop.
            setTyped(COMMAND)
            setVisibleNodes(TREE.length)
            setPhase('holding')
            return
        }

        let timers = []

        function runSequence() {
            setTyped('')
            setVisibleNodes(0)
            setPhase('typing')

            for (let i = 1; i <= COMMAND.length; i++) {
                timers.push(
                    setTimeout(() => setTyped(COMMAND.slice(0, i)), i * TYPE_SPEED_MS),
                )
            }

            const typingDone = COMMAND.length * TYPE_SPEED_MS
            timers.push(setTimeout(() => setPhase('building'), typingDone + 250))

            for (let i = 1; i <= TREE.length; i++) {
                timers.push(
                    setTimeout(
                        () => setVisibleNodes(i),
                        typingDone + 250 + i * NODE_STAGGER_MS,
                    ),
                )
            }

            const buildDone = typingDone + 250 + TREE.length * NODE_STAGGER_MS
            timers.push(setTimeout(() => setPhase('holding'), buildDone + 200))
            timers.push(
                setTimeout(() => setPhase('resetting'), buildDone + HOLD_MS),
            )
            timers.push(
                setTimeout(() => runSequence(), buildDone + HOLD_MS + RESET_PAUSE_MS),
            )
        }

        runSequence()
        return () => timers.forEach(clearTimeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="relative mx-auto w-full max-w-2xl">
            {/* Blueprint corner ticks for a technical-drawing feel */}
            <CornerTicks />

            <div className="rounded-lg border border-blueprint-line/60 bg-blueprint-800/80 shadow-2xl shadow-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 border-b border-blueprint-line/40 px-4 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-blueprint-line/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-blueprint-line/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-blueprint-line/60" />
                    <span className="ml-2 font-mono text-xs text-paper/40">module:make</span>
                </div>

                <div className="px-5 py-4 font-mono text-[13px] leading-relaxed sm:text-sm">
                    <div className="flex items-center gap-2 text-paper/90">
                        <span className="text-moss">$</span>
                        <span>{typed}</span>
                        <span
                            className={
                                phase === 'typing'
                                    ? 'inline-block h-[1.1em] w-[7px] translate-y-[1px] bg-amber animate-blink'
                                    : 'sr-only'
                            }
                            aria-hidden="true"
                        />
                    </div>

                    <div className="mt-3 min-h-[172px] border-l border-dashed border-blueprint-line/60 pl-4">
                        {TREE.map((node, i) => {
                            const isFile = node.label.includes('.php')
                            const revealed = i < visibleNodes
                            return (
                                <div
                                    key={node.label}
                                    className={
                                        revealed
                                            ? 'flex items-center gap-1.5 py-0.5 text-paper/85 animate-drawIn'
                                            : 'flex items-center gap-1.5 py-0.5 opacity-0'
                                    }
                                    style={{ paddingLeft: `${node.depth * 14}px` }}
                                >
                                    {revealed && (
                                        <span className="text-moss">
                      {isFile ? (
                          <IconCheck className="h-3 w-3" />
                      ) : (
                          <IconFolder className="h-3 w-3 text-amber/80" />
                      )}
                    </span>
                                    )}
                                    <span className={isFile ? 'text-paper/70' : 'text-paper/90'}>
                    {node.label}
                  </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

function CornerTicks() {
    const cls = 'absolute h-3 w-3 border-blueprint-line/70'
    return (
        <>
            <span className={`${cls} -left-1.5 -top-1.5 border-l-2 border-t-2`} aria-hidden="true" />
            <span className={`${cls} -right-1.5 -top-1.5 border-r-2 border-t-2`} aria-hidden="true" />
            <span className={`${cls} -bottom-1.5 -left-1.5 border-b-2 border-l-2`} aria-hidden="true" />
            <span className={`${cls} -bottom-1.5 -right-1.5 border-b-2 border-r-2`} aria-hidden="true" />
        </>
    )
}
