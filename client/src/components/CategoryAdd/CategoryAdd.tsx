import { ChangeEvent, FC, Fragment, useCallback, useState } from 'react'
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
} from '@mui/material'

import ColourEdit from '../ColourEdit'
import { useAppDispatch } from '../../hooks/ReduxHookWrappers'
import { initCreateCategory } from '../../redux/slices/categorySlice'

interface Props {
    handleClose: (payload?: any) => void
    open: boolean
}

const CategoryAdd: FC<Props> = ({ handleClose, open }) => {
    const dispatch = useAppDispatch()

    const [label, setLabel] = useState('')
    const [description, setDescription] = useState('')
    const [colour, setColour] = useState('#bec3c7')

    const [labelError, setLabelError] = useState(false)
    const [descError, setDescError] = useState(false)

    const [saveModalOpen, setSaveModalOpen] = useState(false)

    const handleTitleChange = useCallback(
        (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setLabel(evt.target.value)
            if (!/\w/gi.test(evt.target.value)) {
                setLabelError(true)
            } else {
                setLabelError(false)
            }
        },
        [],
    )

    const handleDescChange = useCallback(
        (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setDescription(evt.target.value)
            if (!/\w/gi.test(evt.target.value)) {
                setDescError(true)
            } else {
                setDescError(false)
            }
        },
        [],
    )

    const handleColourChange = useCallback(
        (editedColour: string) => {
            setColour(editedColour)
        },
        [],
    )

    const handleSaveAndClose = useCallback(() => {
        const payload = {
            label,
            description,
            colour,
            matchers: [],
        }
        dispatch(initCreateCategory({ category: payload }))
        setLabel('')
        setDescription('')
        setColour('#bec3c7')
        setLabelError(false)
        setDescError(false)
        if (handleClose) {
            handleClose(payload)
        }
    }, [colour, description, dispatch, handleClose, label])

    const handleReset = useCallback(() => {
        setLabel('')
        setDescription('')
        setColour('#bec3c7')
        setLabelError(false)
        setDescError(false)
        setSaveModalOpen(false)
        if (handleClose) {
            handleClose()
        }
    }, [handleClose])
    
    const handleConditionalClose = useCallback(
        (event?: any, reason?: 'backdropClick' | 'escapeKeyDown') => {
            if (
                label?.length ||
                description?.length
            ) {
                setSaveModalOpen(true)
            } else {
                if (handleClose) {
                    handleClose(null)
                }
            }
        },
        [description, handleClose, label],
    )

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
                    Add Category
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        Add a new category of Transaction.
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
                            label='Title'
                            labelPlacement='top'
                            required
                            sx={{
                                alignItems: 'flex-start',
                                gridColumn: '1',
                                '& .MuiFormControlLabel-asterisk': {
                                    display: 'none',
                                }
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
                            label='Description'
                            labelPlacement='top'
                            required
                            sx={{
                                alignItems: 'flex-start',
                                gridColumn: '1',
                                '& .MuiFormControlLabel-asterisk': {
                                    display: 'none',
                                }
                            }}
                        />
                        <FormControlLabel
                            control={
                                <ColourEdit
                                    onSubmit={handleColourChange}
                                />
                            }
                            label='Colour'
                            labelPlacement='top'
                            sx={{
                                gridColumn: '2',
                                gridRow: '1 / -1',
                            }}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConditionalClose}>Cancel</Button>
                    <Button autoFocus onClick={handleSaveAndClose}>
                        Create Category
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
                    Close without saving?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        You have unsaved changes that will be lost.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSaveModalOpen(false)}>
                        Keep editing
                    </Button>
                    <Button autoFocus onClick={handleReset}>
                        Close without saving changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}

export default CategoryAdd
