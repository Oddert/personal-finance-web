import { ChangeEvent, FC, Fragment, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    TextField,
} from '@mui/material';

import { initCreateCategory } from '../../redux/slices/categorySlice';

import { useAppDispatch } from '../../hooks/ReduxHookWrappers';

import ColourEdit from '../ColourEdit';

import type { IProps } from './CategoryAdd.types';

/**
 * Dialog component to add a new category.
 * @category Component
 * @subcategory CategoryAdd
 * @component
 * @param props.handleClose Callback function invoked when the component requests to close. Will contain a partial Category if the close is a submission.
 * @param props.open If true, the modal will display.
 */
const CategoryAdd: FC<IProps> = ({ handleClose, open }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [colour, setColour] = useState('#bec3c7');

    const [labelError, setLabelError] = useState(false);
    const [descError, setDescError] = useState(false);

    const [saveModalOpen, setSaveModalOpen] = useState(false);

    const handleTitleChange = useCallback(
        (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setLabel(evt.target.value);
            if (!/\w/gi.test(evt.target.value)) {
                setLabelError(true);
            } else {
                setLabelError(false);
            }
        },
        [],
    );

    const handleDescChange = useCallback(
        (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setDescription(evt.target.value);
            if (!/\w/gi.test(evt.target.value)) {
                setDescError(true);
            } else {
                setDescError(false);
            }
        },
        [],
    );

    const handleColourChange = useCallback((editedColour: string) => {
        setColour(editedColour);
    }, []);

    const handleSaveAndClose = useCallback(() => {
        const payload = {
            label,
            description,
            colour,
            matchers: [],
        };
        dispatch(initCreateCategory({ category: payload }));
        setLabel('');
        setDescription('');
        setColour('#bec3c7');
        setLabelError(false);
        setDescError(false);
        if (handleClose) {
            handleClose(payload);
        }
    }, [colour, description, dispatch, handleClose, label]);

    const handleReset = useCallback(() => {
        setLabel('');
        setDescription('');
        setColour('#bec3c7');
        setLabelError(false);
        setDescError(false);
        setSaveModalOpen(false);
        if (handleClose) {
            handleClose();
        }
    }, [handleClose]);

    const handleConditionalClose = useCallback(() => {
        if (label?.length || description?.length) {
            setSaveModalOpen(true);
        } else {
            if (handleClose) {
                handleClose(null);
            }
        }
    }, [description, handleClose, label]);

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleConditionalClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle
                    id='alert-dialog-title'
                    sx={{
                        minWidth: '50vw',
                    }}
                >
                    {t('Category.addCategory')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        {t('Category.addCategoryDesc')}
                    </DialogContentText>
                    <FormControl
                        fullWidth
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            alignContent: 'start',
                        }}
                    >
                        <FormControlLabel
                            control={
                                <TextField
                                    error={labelError}
                                    onChange={handleTitleChange}
                                    sx={{ width: '100%' }}
                                    value={label}
                                />
                            }
                            label={t('literals.Title')}
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
                        <FormControlLabel
                            control={
                                <TextField
                                    error={descError}
                                    onChange={handleDescChange}
                                    sx={{ width: '100%' }}
                                    value={description}
                                />
                            }
                            label={t('literals.Description')}
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
                        <FormControlLabel
                            control={
                                <ColourEdit onSubmit={handleColourChange} />
                            }
                            label={t('literals.Colour')}
                            labelPlacement='top'
                            sx={{
                                gridColumn: '2',
                                gridRow: '1 / -1',
                            }}
                        />
                        {/* <AddMatcher
                            categoryId={category.id}
                            defaultOpen={defaultOpenAddNew}
                            matcher={defaultOpenMatcher || undefined}
                            onSubmit={onAddNewSubmit}
                        /> */}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConditionalClose}>
                        {t('commonButtons.Cancel')}
                    </Button>
                    <Button autoFocus onClick={handleSaveAndClose}>
                        {t('Category.createCategory')}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={saveModalOpen}
                onClose={() => setSaveModalOpen(false)}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle
                    id='alert-dialog-title'
                    sx={{
                        minWidth: '50vw',
                    }}
                >
                    {t('modalMessages.closeWithoutSaving')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        {t('modalMessages.unsavedChangesWillBeLost')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSaveModalOpen(false)}>
                        {t('commonButtons.keepEditing')}
                    </Button>
                    <Button autoFocus onClick={handleReset}>
                        {t('commonButtons.closeWithoutSaving')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default CategoryAdd;
