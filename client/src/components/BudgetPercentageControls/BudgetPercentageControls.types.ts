export interface IProps {
	setUseFloat: (value: boolean) => void
	setZoomDim: (value: { height: number, width: number }) => void
	useFloat: boolean
	zoomDimensionsLookup: [
		{ height: number, width: number },
		{ height: number, width: number },
		{ height: number, width: number },
		{ height: number, width: number },
		{ height: number, width: number },
	]
}
