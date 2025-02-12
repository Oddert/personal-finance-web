import { ChangeEvent, FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Add as PlusIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    TextField,
} from '@mui/material';

import { initCreateCategory } from '../../../../../../redux/slices/categorySlice';

import { useAppDispatch } from '../../../../../../hooks/ReduxHookWrappers';

// import ColourEdit from '../../../../ColourEdit';

/**
 * Smaller version of the Category edit / add modal which allows the creation of Categories.
 * @category Components
 * @subcategory Transaction Edit
 * @component
 */
const AddCategory: FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [open, setOpen] = useState(false);
    const [label, setLabel] = useState('');
    const [labelError, setTitleError] = useState(false);
    const [colour, setColour] = useState('#bec3c7');

    const handleLabelChange = useCallback(
        (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setLabel(evt.target.value);
            if (!/\w/gi.test(evt.target.value)) {
                setTitleError(true);
            } else {
                setTitleError(false);
            }
        },
        [],
    );

    // NOTE: temporarily disabled due to z-index bug on colour utility
    // const handleColourChange = useCallback(
    //     (editedColour: string) => {
    //         setColour(editedColour);
    //     },
    //     [],
    // );

    const handleSubmit = useCallback(() => {
        const payload = {
            label,
            colour,
            description: '',
            matchers: [],
        };
        dispatch(initCreateCategory({ category: payload }));
        setLabel('');
        setColour('#bec3c7');
        setTitleError(false);
        setOpen(false);
    }, [colour, dispatch, label]);

    if (open) {
        return (
            <FormControl>
                <Box>
                    <FormControlLabel
                        control={
                            <TextField
                                error={labelError}
                                label='Category title'
                                onChange={handleLabelChange}
                                sx={{ width: '100%', mt: 2 }}
                                value={label}
                            />
                        }
                        label=''
                        labelPlacement='top'
                        required
                        sx={{
                            alignItems: 'flex-start',
                            gridColumn: '1',
                            '& .MuiFormControlLabel-asterisk': {
                                display: 'none',
                            },
                        }}
                    />
                    {/* <FormControlLabel
                        control={
                            <ColourEdit
                                onSubmit={handleColourChange}
                                sx={{ zIndex: 1400 }}
                            />
                        }
                        label='Colour'
                        labelPlacement='top'
                        sx={{
                            gridColumn: '2',
                            gridRow: '1 / -1',
                        }}
                    /> */}
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gridGap: '8px',
                        p: 1,
                    }}
                >
                    <Button onClick={() => setOpen(false)}>
                        {t('Cancel')}
                    </Button>
                    <Button onClick={handleSubmit} variant='contained'>
                        {t('Category.createCategory')}
                    </Button>
                </Box>
            </FormControl>
        );
    }

    return (
        <Button onClick={() => setOpen(true)} sx={{ mt: 2 }}>
            <PlusIcon /> {t('Category.addCategory')}
        </Button>
    );
};

export default AddCategory;
