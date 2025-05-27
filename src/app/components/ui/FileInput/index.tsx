import { useState } from 'react'
import styles from './style.module.scss'

interface FileInputProps {
	label: string
	labelText?: string
	accept?: string
	onChange?: (file: File | null) => void
}

export const FileInput = (props: FileInputProps) => {
	const { onChange, label, labelText, accept } = props
	const [key, setKey] = useState(0)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newFile = e.target.files?.[0] || null
		onChange?.(newFile)
		// Reset the input by changing its key to allow reuploading
		setKey(prev => prev + 1)
	}

	return (
		<div>
			<label htmlFor={label}>
				{labelText || 'No file selected'}
			</label>
			<input
				className={styles.hidden}
				type="file"
				id={label}
				accept={accept}
				multiple={false}
				onChange={handleChange}
				key={key}
			/>
		</div>
	)
}
