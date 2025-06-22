import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import locale from 'locale-codes';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    // AccordionSummary,
    Autocomplete,
    Box,
    Button,
    List,
    ListItem,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import {
    KeyboardArrowDown as IconDown,
    Language as IconLanguage,
    KeyboardArrowUp as IconUp,
} from '@mui/icons-material';

import {
    reorderLanguages,
    updateLanguagePreferences,
} from '../../../../redux/thunks/profileThunks';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';

import { getUserLanguages } from '../../../../redux/selectors/profileSelectors';

import { IProps } from './LanguageSelector.types';

/**
 * Presents controls for the user to select their preferred languages and priority order.
 * @component
 * @category Pages
 * @subcategory Profile
 */
const LanguageSelector: FC<IProps> = () => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const usersLanguages = useAppSelector(getUserLanguages);

    return (
        <Paper
            sx={{
                mb: 2,
                px: 4,
                py: 2,
                display: 'grid',
                gridTemplateColumns: 'auto 1fr 1fr',
                gridGap: '16px 24px',
                alignItems: 'center',
            }}
        >
            <IconLanguage sx={{ gridRow: '1 / span 2' }} />
            <Box>
                <Typography textAlign='left' sx={{ mb: 1 }} variant='h3'>
                    Preferred languages
                </Typography>
                <Typography textAlign='left'>
                    Select other languages which can be used if your selected
                    language is not available
                </Typography>
            </Box>
            <Autocomplete
                getOptionLabel={(option) => `${option.name} (${option.tag})`}
                getOptionKey={(option) => option.tag}
                onChange={(event, nextValue) => {
                    if (nextValue) {
                        dispatch(
                            updateLanguagePreferences([
                                ...usersLanguages,
                                {
                                    displayName: nextValue.name,
                                    code: nextValue.tag,
                                },
                            ]),
                        );
                    }
                }}
                options={locale.all}
                renderInput={(props) => (
                    <TextField {...props} label={t('Add language')} />
                )}
                sx={{
                    mt: '24px',
                }}
                value={null}
            />
            <Accordion defaultExpanded sx={{ gridColumn: '1 / -1' }}>
                <AccordionSummary>{t('buttons.changeOrder')}</AccordionSummary>
                <AccordionDetails>
                    <List>
                        {usersLanguages.map((language, idx) => (
                            <ListItem key={idx} divider>
                                <Box>
                                    <Button
                                        disabled={idx === 0}
                                        onClick={() =>
                                            dispatch(
                                                reorderLanguages(idx, idx - 1),
                                            )
                                        }
                                        title={t('Move up in sort order')}
                                    >
                                        <IconUp />
                                    </Button>
                                    <Button
                                        disabled={
                                            idx === usersLanguages.length - 1
                                        }
                                        onClick={() =>
                                            dispatch(
                                                reorderLanguages(idx, idx + 1),
                                            )
                                        }
                                        title={t('Move down in sort order')}
                                    >
                                        <IconDown />
                                    </Button>
                                </Box>
                                <Typography>
                                    {language.displayName} ({language.code})
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};

export default LanguageSelector;
