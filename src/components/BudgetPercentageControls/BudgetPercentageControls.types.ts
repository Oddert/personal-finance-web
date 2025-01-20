export interface IProps {
    setUseFloat: (value: boolean) => void;
    setZoomDim: (value: { height: number; width: number }) => void;
    useFloat: boolean;
    zoomDimensionsLookup: [
        { height: number; width: number },
        { height: number; width: number },
        { height: number; width: number },
        { height: number; width: number },
        { height: number; width: number },
    ];
}

// Integer equivalent to 'xs', 'sm', 'md', 'lg', 'xl'
export type IZoomLevel = 0 | 1 | 2 | 3 | 4;
