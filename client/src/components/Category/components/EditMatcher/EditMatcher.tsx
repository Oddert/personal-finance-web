import { FC, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import {
    FontDownloadOutlined as MatchNegativeIcon,
    FontDownload as MatchPositiveIcon,
} from '@mui/icons-material';

import type { MatchType, Matcher } from '../../../../types/Matcher';

import { matchTypesOptions } from '../../../../utils/matcherUtils';

interface IProps {
    clearOnBlur?: boolean
    clearOnCancel: boolean
    clearOnSubmit: boolean
    matcher?: Partial<Matcher>
    onBlur?: (matcher: Partial<Matcher>) => void
    onCancel?: (matcher: Partial<Matcher>) => void
    onSubmit?: (matcher: Partial<Matcher>) => void
}

const EditMatcher: FC<IProps> = ({
    clearOnBlur = false,
    clearOnCancel = false,
    clearOnSubmit = false,
    matcher = {
		case_sensitive: false,
		match: '',
		matchType: 'any',
	},
    onBlur = () => {},
    onCancel = () => {},
    onSubmit = () => {},
}) => {
    const [caseSensitive, setCaseSensitive] = useState<boolean>(false)
    const [match, setMatch] = useState<string>('')
    const [matchType, setMatchType] = useState<MatchType>('any')

    useEffect(() => {
        setMatch(matcher?.match || '')
        setCaseSensitive(Boolean(matcher?.case_sensitive || false))
    }, [matcher])

    const reset = () => {
        setCaseSensitive(false)
        setMatch('')
        setMatchType('any')
    }

    const createResponse = () => ({
        case_sensitive: caseSensitive,
        match,
        match_type: matchType,
    })

    const handleBlur = () => {
        if (onBlur) {
            onBlur(createResponse())
            if (clearOnBlur) {
                reset()
            }
        }
    }

    const handleCancel = () => {
        if (onCancel) {
            onCancel(createResponse())
        }
        if (clearOnCancel) {
            reset()
        }
    }

    const handleSave = () => {
        if (onSubmit) {
            onSubmit(createResponse())
        }
        if (clearOnSubmit) {
            reset()
        }
    }

    return (
        <Box
            onBlur={handleBlur}
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gridTemplateRows: 'repeat(2, auto)',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
            }}
        >
            <TextField
                autoFocus
                label='Match'
                onChange={(e) => setMatch(e?.target?.value)}
                size='small'
                sx={{
                    alignSelf: 'flex-end',
                }}
                type='text'
                value={match}
            />
            <FormGroup sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                margin: '0 16px',
            }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={caseSensitive}
                            checkedIcon={<MatchPositiveIcon />}
                            icon={<MatchNegativeIcon />}
                            onChange={() => setCaseSensitive(!caseSensitive)}
                            title={matcher?.case_sensitive ? 'match exact case' : 'match any case'}
                        />
                    }
                    label={`Case Sensitive`}
                    componentsProps={{
                        typography: {
                            sx: {
                                textWrap: 'wrap',
                                fontSize: '12px',
                            }
                        }
                    }}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        whiteSpace: 'pre-line',
                        margin: 0,
                    }}
                />
            </FormGroup>
            <FormControlLabel
                componentsProps={{
                    typography: {
                        sx: {
                            textWrap: 'wrap',
                            fontSize: '12px',
                        }
                    }
                }}
                control={
                    <Select
                        aria-labelledby='EditMatcher_match_type'
                        defaultValue={matchTypesOptions[0].value}
                        name='match_type_options'
                        onChange={(e) => setMatchType(e?.target?.value as MatchType)}
                        size='small'
                        value={matchType}
                        MenuProps={{
                            sx: (theme) => ({
                                zIndex: theme.zIndex.appBar * 3,
                            })
                        }}
                    >
                        {matchTypesOptions.map(({ label, value }) => (
                            <MenuItem key={value} value={value}>{label}</MenuItem>
                        ))}
                    </Select>
                }
                id='EditMatcher_match_type'
                label={'Match Type'}
                sx={{
                    fontSize: '12px',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    margin: 0,
                }}
                value={matchType}
            />
            <Box
                sx={{
                    gridColumn: '1 / span 3',
                    gridRow: '2',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '16px',
                }}
            >
                <Button
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant='contained'
                >
                    Save
                </Button>
            </Box>
        </Box>
    )
}

export default EditMatcher
