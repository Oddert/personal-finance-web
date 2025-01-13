import { IDynamicCardLayoutModes } from '../../../../types/Common.types'

export interface IProps {
    layout: IDynamicCardLayoutModes
    setLayout: (value: IDynamicCardLayoutModes) => void
}
