import { FC, useMemo } from 'react';
import { Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

import EditableText from '../../../EditableText/EditableText';

import type { IProps } from './TitleBase.types';

const sizeMap = {
    xs: '10px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
};

/**
 * Lower level component to display the title with optional edit capability.
 * @category Component
 * @subcategory Category
 * @component
 * @param props.colour The selected category colour, used decoratively as the title underline if `showBorder` is true.
 * @param props.editable If true, the edit capabilities will be enabled.
 * @param props.handleChange Callback function invoked when a change is committed.
 * @param props.text The title text content.
 * @param props.showBorder If true title `colour` underline will be shown.
 * @param props.size The display size.
 */
const TitleBase: FC<IProps> = ({
    colour = '',
    editable = true,
    handleChange = () => {},
    text = '',
    showBorder = false,
    size = 'md',
}) => {
    const headingProps = useMemo(() => {
        return {
            sx: {
                alignSelf: 'stretch',
                borderBottom: showBorder ? `2px solid ${colour}` : 'none',
                fontSize: sizeMap[size],
            },
            variant: 'h3' as Variant | 'inherit' | undefined,
        };
    }, [colour, size, showBorder]);

    if (editable) {
        return (
            <EditableText
                headingProps={headingProps}
                iconPosition='start'
                onChange={handleChange}
                text={text}
                verticalCenter
            />
        );
    }
    return <Typography {...headingProps}>{text}</Typography>;
};

export default TitleBase;
