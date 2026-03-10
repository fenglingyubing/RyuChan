import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'

type TagInputProps = {
	tags: string[]
	availableTags?: string[]
	onChange: (tags: string[]) => void
}

export function TagInput({ tags, availableTags = [], onChange }: TagInputProps) {
	const [tagInput, setTagInput] = useState<string>('')
	const [isSelectorOpen, setIsSelectorOpen] = useState(false)

	const normalizedInput = tagInput.trim().toLowerCase()
	const selectableTags = useMemo(
		() => availableTags.filter(tag => !tags.includes(tag) && (!normalizedInput || tag.toLowerCase().includes(normalizedInput))),
		[availableTags, tags, normalizedInput]
	)

	const handleAddTag = () => {
		if (tagInput.trim() && !tags.includes(tagInput.trim())) {
			onChange([...tags, tagInput.trim()])
			setTagInput('')
		}
	}

	const handleSelectTag = (tag: string) => {
		if (!tags.includes(tag)) {
			onChange([...tags, tag])
		}
		setTagInput('')
	}

	const handleRemoveTag = (index: number) => {
		onChange(tags.filter((_, i) => i !== index))
	}

	return (
		<div className='w-full rounded-lg border border-base-300 bg-base-100 px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all'>
			{tags.length > 0 && (
				<div className='mb-2 flex flex-wrap gap-2'>
					{tags.map((tag, index) => (
						<span key={index} className='badge badge-primary badge-outline gap-1.5 py-3'>
							#{tag}
							<button type='button' onClick={() => handleRemoveTag(index)} className='hover:text-error transition-colors'>
								×
							</button>
						</span>
					))}
				</div>
			)}
			{availableTags.length > 0 && (
				<div className='mb-2 flex items-center justify-between gap-2'>
					<button
						type='button'
						onClick={() => setIsSelectorOpen(open => !open)}
						className='inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80'
					>
						选择已有标签
						<ChevronDown className={`h-3.5 w-3.5 transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
					</button>
					<span className='text-[11px] text-base-content/45'>共 {availableTags.length} 个</span>
				</div>
			)}
			<input
				type='text'
				placeholder='添加标签（按回车）'
				className='w-full bg-transparent text-sm outline-none placeholder:text-base-content/40'
				value={tagInput}
				onChange={e => setTagInput(e.target.value)}
				onKeyDown={e => {
					if (e.key === 'Enter') {
						e.preventDefault()
						handleAddTag()
					}
				}}
			/>
			{isSelectorOpen && availableTags.length > 0 && (
				<div className='mt-3 rounded-xl border border-base-200 bg-base-200/40 p-2'>
					<div className='mb-2 text-[11px] font-medium text-base-content/55'>
						{normalizedInput ? `匹配到 ${selectableTags.length} 个标签` : '点击即可快速加入已有标签'}
					</div>
					<div className='flex max-h-32 flex-wrap gap-2 overflow-y-auto pr-1'>
						{selectableTags.length > 0 ? (
							selectableTags.map(tag => (
								<button
									key={tag}
									type='button'
									onClick={() => handleSelectTag(tag)}
									className='rounded-full border border-primary/20 bg-base-100 px-2.5 py-1 text-xs text-base-content transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary'
								>
									#{tag}
								</button>
							))
						) : (
							<div className='text-xs text-base-content/50'>没有可选的已有标签</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
