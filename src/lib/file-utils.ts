'use client'

const COMPRESSIBLE_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MIN_COMPRESS_BYTES = 250 * 1024
const MAX_IMAGE_DIMENSION = 2200

export type OptimizedImageResult = {
	file: File
	originalSize: number
	optimizedSize: number
	wasCompressed: boolean
}

export function readFileAsText(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(String(reader.result || ''))
		reader.onerror = reject
		reader.readAsText(file)
	})
}

export function fileToBase64NoPrefix(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			const dataUrl = String(reader.result || '')
			resolve(dataUrl.replace(/^data:[^;]+;base64,/, ''))
		}
		reader.onerror = reject
		reader.readAsDataURL(file)
	})
}

export function formatFileSize(bytes: number): string {
	if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'

	const units = ['B', 'KB', 'MB', 'GB']
	let size = bytes
	let unitIndex = 0

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024
		unitIndex += 1
	}

	const fixed = size >= 100 || unitIndex === 0 ? 0 : 1
	return `${size.toFixed(fixed)} ${units[unitIndex]}`
}

function changeFileExtension(filename: string, extension: string): string {
	const sanitizedExt = extension.startsWith('.') ? extension : `.${extension}`
	return filename.replace(/\.[^.]+$/, '') + sanitizedExt
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
	return new Promise(resolve => {
		canvas.toBlob(blob => resolve(blob), type, quality)
	})
}

function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.onload = () => resolve(image)
		image.onerror = () => reject(new Error('图片读取失败'))
		image.src = url
	})
}

function getTargetDimensions(width: number, height: number) {
	const maxSide = Math.max(width, height)
	if (maxSide <= MAX_IMAGE_DIMENSION) {
		return { width, height }
	}

	const ratio = MAX_IMAGE_DIMENSION / maxSide
	return {
		width: Math.max(1, Math.round(width * ratio)),
		height: Math.max(1, Math.round(height * ratio)),
	}
}

export async function optimizeImageForUpload(file: File): Promise<OptimizedImageResult> {
	if (!COMPRESSIBLE_IMAGE_TYPES.has(file.type) || file.size < MIN_COMPRESS_BYTES) {
		return {
			file,
			originalSize: file.size,
			optimizedSize: file.size,
			wasCompressed: false,
		}
	}

	const objectUrl = URL.createObjectURL(file)

	try {
		const image = await loadImage(objectUrl)
		const target = getTargetDimensions(image.naturalWidth || image.width, image.naturalHeight || image.height)

		const canvas = document.createElement('canvas')
		canvas.width = target.width
		canvas.height = target.height

		const context = canvas.getContext('2d', { alpha: true })
		if (!context) {
			return {
				file,
				originalSize: file.size,
				optimizedSize: file.size,
				wasCompressed: false,
			}
		}

		context.drawImage(image, 0, 0, target.width, target.height)

		const qualities = file.size > 4 * 1024 * 1024 ? [0.8, 0.72, 0.64] : [0.86, 0.78]
		let bestBlob: Blob | null = null

		for (const quality of qualities) {
			const blob = await canvasToBlob(canvas, 'image/webp', quality)
			if (!blob) continue
			if (!bestBlob || blob.size < bestBlob.size) {
				bestBlob = blob
			}
		}

		if (!bestBlob) {
			return {
				file,
				originalSize: file.size,
				optimizedSize: file.size,
				wasCompressed: false,
			}
		}

		const sizeRatio = bestBlob.size / file.size
		const resized = target.width !== image.naturalWidth || target.height !== image.naturalHeight
		if (!resized && sizeRatio >= 0.92) {
			return {
				file,
				originalSize: file.size,
				optimizedSize: file.size,
				wasCompressed: false,
			}
		}

		const optimizedFile = new File([bestBlob], changeFileExtension(file.name, '.webp'), {
			type: 'image/webp',
			lastModified: file.lastModified,
		})

		return {
			file: optimizedFile,
			originalSize: file.size,
			optimizedSize: optimizedFile.size,
			wasCompressed: optimizedFile.size < file.size || resized,
		}
	} catch {
		return {
			file,
			originalSize: file.size,
			optimizedSize: file.size,
			wasCompressed: false,
		}
	} finally {
		URL.revokeObjectURL(objectUrl)
	}
}

export async function hashFileSHA256(file: File): Promise<string> {
	const buf = await file.arrayBuffer()
	const digest = await crypto.subtle.digest('SHA-256', buf)
	const bytes = new Uint8Array(digest)
	let hex = ''
	for (let i = 0; i < bytes.length; i++) {
		const h = bytes[i].toString(16).padStart(2, '0')
		hex += h
	}
	return hex.slice(0, 16)
}
