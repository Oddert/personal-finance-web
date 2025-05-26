import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    FontDownloadOutlined as IconMatchNegative,
    FontDownload as IconMatchPositive,
} from '@mui/icons-material';

import type { MatchType } from '../../../../types/Matcher.d';

import { matchTypesOptions } from '../../../../utils/matcherUtils';

import type { IProps } from './EditMatcher.types';

/**
 * Alternate layout for a Matcher with edit options enabled.
 * @category Component
 * @subcategory Category
 * @component
 * @param props.clearOnBlur If true, the modifications made will be reset on blur.
 * @param props.clearOnCancel If true, the modifications made will be reset when the user cancels.
 * @param props.clearOnSubmit If true, the modifications made will be reset when the user confirms their changes.
 * @param props.matcher The starting values for the Matcher
 * @param props.onBlur Callback function invoked on blur of the outer component.
 * @param props.onCancel Callback function invoked when the user cancels their changes.
 * @param props.onSubmit Callback function invoked when the user confirms their changes.
 */
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
    const { t } = useTranslation();

    const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
    const [match, setMatch] = useState<string>('');
    const [matchType, setMatchType] = useState<MatchType>('any');

    useEffect(() => {
        setMatch(matcher?.match || '');
        setCaseSensitive(Boolean(matcher?.case_sensitive || false));
    }, []);

    const reset = () => {
        setCaseSensitive(false);
        setMatch('');
        setMatchType('any');
    };

    const createResponse = () => ({
        case_sensitive: caseSensitive,
        match,
        match_type: matchType,
    });

    const handleBlur = () => {
        if (onBlur) {
            onBlur(createResponse());
            if (clearOnBlur) {
                reset();
            }
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel(createResponse());
        }
        if (clearOnCancel) {
            reset();
        }
    };

    const handleSave = () => {
        if (onSubmit) {
            onSubmit(createResponse());
        }
        if (clearOnSubmit) {
            reset();
        }
    };

    return (
        <Box
            data-testid='components-Category-EditMatcher'
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
                label={t('Category.matcherLabel')}
                onChange={(event) => {
                    setMatch(event?.target?.value);
                }}
                size='small'
                sx={{
                    alignSelf: 'flex-end',
                }}
                type='text'
                value={match}
            />
            <FormGroup
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    margin: '0 16px',
                }}
            >
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={caseSensitive}
                            checkedIcon={<IconMatchPositive />}
                            icon={<IconMatchNegative />}
                            onChange={() => setCaseSensitive(!caseSensitive)}
                            title={
                                matcher?.case_sensitive
                                    ? t('Category.caseSensitiveOn')
                                    : t('Category.caseSensitiveOff')
                            }
                        />
                    }
                    label={t('Category.caseSensitiveLabel')}
                    slotProps={{
                        typography: {
                            sx: {
                                textWrap: 'wrap',
                                fontSize: '12px',
                            },
                        },
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
                control={
                    <Select
                        aria-labelledby='EditMatcher_match_type'
                        defaultValue={matchTypesOptions[0].value}
                        MenuProps={{
                            sx: (theme) => ({
                                zIndex: theme.zIndex.appBar * 3,
                            }),
                        }}
                        name='match_type_options'
                        onChange={(e) =>
                            setMatchType(e?.target?.value as MatchType)
                        }
                        size='small'
                        value={matchType}
                    >
                        {matchTypesOptions.map(({ label, value }) => (
                            <MenuItem key={value} value={value}>
                                {t(label)}
                            </MenuItem>
                        ))}
                    </Select>
                }
                id='EditMatcher_match_type'
                label={t('Category.matchTypeLabel')}
                slotProps={{
                    typography: {
                        sx: {
                            textWrap: 'wrap',
                            fontSize: '12px',
                        },
                    },
                }}
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
                    gridGap: '8px',
                }}
            >
                <Button onClick={handleCancel}>{t('buttons.Cancel')}</Button>
                <Button onClick={handleSave} variant='contained'>
                    {t('buttons.Save')}
                </Button>
            </Box>
        </Box>
    );
};

export default EditMatcher;
