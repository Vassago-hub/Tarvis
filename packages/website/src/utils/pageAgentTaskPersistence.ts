interface ActiveTaskRecord {
	originalTask: string
	lastTask: string
	startedAt: number
	updatedAt: number
	lastUrl: string
	resumeCount: number
}

interface TaskHookAgent {
	task: string
}

interface ResumableAgent extends TaskHookAgent {
	status: string
	execute: (task: string) => Promise<unknown>
}

interface PageAgentTaskPersistenceOptions {
	storageKey: string
	resumePrefix: string
	resumeWindowMs?: number
	maxResumeCount?: number
	resumeDelayMs?: number
	buildResumeTask: (record: ActiveTaskRecord) => string
	onResumeError?: (error: unknown) => void
}

const DEFAULT_RESUME_WINDOW_MS = 8 * 60 * 1000
const DEFAULT_MAX_RESUME_COUNT = 8
const DEFAULT_RESUME_DELAY_MS = 1200

export function createPageAgentTaskPersistence(options: PageAgentTaskPersistenceOptions) {
	const resumeWindowMs = options.resumeWindowMs ?? DEFAULT_RESUME_WINDOW_MS
	const maxResumeCount = options.maxResumeCount ?? DEFAULT_MAX_RESUME_COUNT
	const resumeDelayMs = options.resumeDelayMs ?? DEFAULT_RESUME_DELAY_MS

	function readRecord(): ActiveTaskRecord | null {
		try {
			const raw = window.sessionStorage.getItem(options.storageKey)
			if (!raw) return null
			const record = JSON.parse(raw) as ActiveTaskRecord
			return record?.originalTask ? record : null
		} catch {
			return null
		}
	}

	function writeRecord(record: ActiveTaskRecord): void {
		try {
			window.sessionStorage.setItem(options.storageKey, JSON.stringify(record))
		} catch {
			// Storage failures should not block the agent task.
		}
	}

	function clearRecord(): void {
		try {
			window.sessionStorage.removeItem(options.storageKey)
		} catch {
			// Storage failures should not block the agent task.
		}
	}

	function persist(task: string): void {
		if (!task) return

		const now = Date.now()
		const existing = readRecord()
		const isResumeTask = task.startsWith(options.resumePrefix)
		const keepExisting =
			Boolean(existing) && isResumeTask && now - existing!.updatedAt <= resumeWindowMs

		writeRecord({
			originalTask: keepExisting ? existing!.originalTask : task,
			lastTask: task,
			startedAt: keepExisting ? existing!.startedAt : now,
			updatedAt: now,
			lastUrl: window.location.href,
			resumeCount: keepExisting ? existing!.resumeCount : 0,
		})
	}

	return {
		onBeforeTask(agent: TaskHookAgent): void {
			persist(agent.task)
		},
		onAfterStep(agent: TaskHookAgent): void {
			persist(agent.task)
		},
		onAfterTask(): void {
			clearRecord()
		},
		persistBeforeUnload(agent: ResumableAgent): void {
			if (agent.status !== 'running') return
			persist(agent.task)
		},
		tryResume(agent: ResumableAgent): void {
			const record = readRecord()
			if (!record) return

			const now = Date.now()
			if (now - record.updatedAt > resumeWindowMs || record.resumeCount >= maxResumeCount) {
				clearRecord()
				return
			}

			const resumeTask = options.buildResumeTask(record)
			writeRecord({
				...record,
				updatedAt: now,
				lastUrl: window.location.href,
				resumeCount: record.resumeCount + 1,
			})

			window.setTimeout(() => {
				if (agent.status === 'running') return
				void agent.execute(resumeTask).catch((error) => {
					options.onResumeError?.(error)
				})
			}, resumeDelayMs)
		},
	}
}

export type { ActiveTaskRecord, ResumableAgent }
