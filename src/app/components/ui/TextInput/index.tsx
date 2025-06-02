import styles from './styles.module.scss'

interface TextInputProps {
	value: string
	setValue: (value: string) => void
	placeholder?: string
	className?: string
	style?: React.CSSProperties
}

export const TextInput = (props: TextInputProps) => {
	const { value, setValue, placeholder, className, style } = props

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
	}

	return (
		<input
			value={value}
			onChange={handleChange}
			placeholder={placeholder}
			className={className}
			style={style}
		/>
	)
}

interface TextAreaProps {
	value: string
	setValue: (value: string) => void
	placeholder?: string
	maxLength?: number
	rows?: number
	className?: string
	style?: React.CSSProperties
}

export const TextArea = (props: TextAreaProps) => {
	const { value, setValue, placeholder, maxLength, rows, className, style } = props

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setValue(e.target.value)
	}

	return (
		<div className={styles.textAreaContainer}>
			<textarea
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				className={`${styles.textArea} ${className ?? ''}`}
				style={style}
				maxLength={maxLength}
				rows={rows}
			/>
			{maxLength && (
				<div className={styles.textAreaLength}>
					{value.length}/{maxLength} CHARACTERS
				</div>
			)}
		</div>
	)
}
