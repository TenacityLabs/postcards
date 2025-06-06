"use client"

import PlusCloudIcon from '../components/icons/PlusCloudIcon'
import styles from './folder.module.scss'
import Image from "next/image"

export default function EmptyFolder() {

	return (
		<div className={styles.container}>
			<button className={styles.title}>
				Create a new Postcard
			</button>
			<button className={styles.folderButton}>
				<Image
					className={styles.folder}
					src='/images/folders/folder-empty.svg'
					alt="Empty Folder"
					width={300}
					height={200}
				/>
				<div className={styles.plusCloud}>
					<PlusCloudIcon width={64} height={64} />
				</div>
			</button>
		</div>
	)
}
