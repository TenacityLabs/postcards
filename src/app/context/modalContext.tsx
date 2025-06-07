"use client"

import styles from './modal.module.scss'
import { clearTimeoutIfExists } from '@/utils'
import { createContext, useContext, useState, ReactNode, useCallback, useRef, useEffect } from 'react'

interface ModalContextType {
	isOpen: boolean
	updateModal: (content: ReactNode, backgroundClass?: string) => void
	hideModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false)
	const [modal, setModal] = useState<ReactNode | null>(null)
	const [backgroundClass, setBackgroundClass] = useState<string | null>(null)
	const openModalRef = useRef<NodeJS.Timeout | null>(null)
	const modalContentUpdateRef = useRef<NodeJS.Timeout | null>(null)

	const clearTimeouts = useCallback(() => {
		clearTimeoutIfExists(modalContentUpdateRef.current)
		clearTimeoutIfExists(openModalRef.current)
		modalContentUpdateRef.current = null
		openModalRef.current = null
	}, [])

	const updateModal = useCallback((content: ReactNode, backgroundClass?: string) => {
		clearTimeouts()
		setModal(content)
		if (backgroundClass) {
			setBackgroundClass(backgroundClass)
		}
		openModalRef.current = setTimeout(() => {
			setIsOpen(true)
		}, 50)
	}, [clearTimeouts])

	const hideModal = useCallback(() => {
		clearTimeouts()
		setIsOpen(false)
		modalContentUpdateRef.current = setTimeout(() => {
			setModal(null)
			setBackgroundClass(null)
		}, 300)
	}, [clearTimeouts])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') hideModal()
		}

		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown)
		}
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, hideModal])

	return (
		<>
			<ModalContext.Provider
				value={{
					isOpen,
					updateModal,
					hideModal,
				}}
			>
				{children}
			</ModalContext.Provider>
			<div
				className={`${styles.modalContainer} ${backgroundClass ? backgroundClass : ''} ${isOpen ? styles.open : ''}`}
				onClick={hideModal}
			>
				<div
					className={`${styles.modal} ${isOpen ? styles.open : ''}`}
					onClick={(e) => e.stopPropagation()}
				>
					{modal}
				</div>
			</div>
		</>
	)
}

export function useModal() {
	const context = useContext(ModalContext)
	if (context === undefined) {
		throw new Error('useModal must be used within a ModalProvider')
	}
	return context
}
