import { useState } from 'react'
import styles from './styles.module.scss'
import Image from 'next/image'

interface FileInputProps {
	label: string
	labelText: string
	accept: string
	onChange: (file: File | null) => void
	image: File | string | null
}

export const FileInput = (props: FileInputProps) => {
	const { onChange, label, labelText, accept, image } = props
	const [key, setKey] = useState(0)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newFile = e.target.files?.[0] || null
		onChange?.(newFile)
		// Reset the input by changing its key to allow reuploading
		setKey(prev => prev + 1)
	}

	return (
		<div className={styles.fileContainer}>
			<label
				htmlFor={label}
				className={styles.fileInput}
			>
				<div className={styles.fileInputTitle}>
					UPLOAD AN IMAGE
				</div>
				<div className={`${styles.fileInputLabel} ${!!image ? styles.fileInputPreview : ''}`}>
					<div className={styles.previewImageContainer}>
						<Image
							src='/images/test/loopy2.jpg'
							alt='Preview'
							width={25}
							height={25}
						/>
					</div>
					<span>
						{labelText}
					</span>
				</div>

				<Image
					className={`${styles.fileUploadIcon} ${!!image ? styles.fileUploadIconVisible : ''}`}
					src='/images/icons/file-upload.svg'
					alt='Upload file'
					width={144}
					height={144}
				/>
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
