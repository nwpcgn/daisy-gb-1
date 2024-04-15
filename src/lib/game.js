import { writable, derived } from 'svelte/store'

export const pixelRatio = writable(window.devicePixelRatio)
export const canvas = writable()
export const stage = writable()
export const height = derived(stage, ($stage, set) => {
	if (!$stage) return
	const ro = new ResizeObserver(([entry]) => {
		set(Math.floor(entry.contentRect.height))
	})
	ro.observe($stage)
	return () => ro.disconnect()
})
export const width = derived(stage, ($stage, set) => {
	if (!$stage) return
	const ro = new ResizeObserver(([entry]) => {
		set(Math.floor(entry.contentRect.width))
	})
	ro.observe($stage)
	return () => ro.disconnect()
})
export const props = deriveObject({
	width,
	height,
	canvas,
	stage,
	pixelRatio
})

function deriveObject(obj) {
	const keys = Object.keys(obj)
	const list = keys.map((key) => {
		return obj[key]
	})
	return derived(list, (array) => {
		return array.reduce((dict, value, i) => {
			dict[keys[i]] = value
			return dict
		}, {})
	})
}
