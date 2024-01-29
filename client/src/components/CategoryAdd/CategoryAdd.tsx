import { ChangeEvent, FC, useCallback, useState } from 'react'
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

interface Props {
    handleClose: ((event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void) | undefined
    open: boolean
}

const CategoryAdd: FC<Props> = ({ handleClose, open }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [colour, setColour] = useState<string|null>(null)

    const [titleError, setTitleError] = useState(false)
    const [descError, setDescError] = useState(false)

    const handleTitleChange = useCallback(
        (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setTitle(evt.target.value)
            if (/\d/gi.test(evt.target.value)) {
                setTitleError(true)
            } else {
                setTitleError(false)
            }
        },
        [],
    )

    const handleDescChange = useCallback(
        (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setDescription(evt.target.value)
            if (/\d/gi.test(evt.target.value)) {
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

    return (
        <Dialog
            open={open}
            onClose={handleClose}
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
                <FormControl fullWidth>
                    <FormControlLabel
                        control={
                            <TextField
                                error={titleError}
                                onChange={handleTitleChange}
                                sx={{ width: '100%' }}
                                value={title}
                            />
                        }
                        label='Title'
                        labelPlacement='top'
                        required
                        sx={{
                            alignItems: 'flex-start',
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
                            '& .MuiFormControlLabel-asterisk': {
                                display: 'none',
                            }
                        }}
                    />
                    <ColourEdit
                        onSubmit={handleColourChange}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button>Cancel</Button>
                <Button autoFocus>
                    Create Category
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CategoryAdd
