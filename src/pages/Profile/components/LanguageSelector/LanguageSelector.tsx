import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import locale from 'locale-codes';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    Button,
    List,
    ListItem,
    TextField,
    Typography,
} from '@mui/material';
import {
    KeyboardArrowUp as IconUp,
    KeyboardArrowDown as IconDown,
} from '@mui/icons-material';

import {
    reorderLanguages,
    updateLanguages,
} from '../../../../redux/slices/profileSlice';

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
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridGap: '16px',
                '& .MuiAccordion-heading': {
                    background: 'red !important',
                },
            }}
        >
            <Autocomplete
                getOptionLabel={(option) => `${option.name} (${option.tag})`}
                getOptionKey={(option) => option.tag}
                multiple
                onChange={(event, nextValue) => {
                    if (nextValue) {
                        dispatch(
                            updateLanguages({
                                languages: nextValue.map((lang) => ({
                                    displayName: lang.name,
                                    code: lang.tag,
                                })),
                            }),
                        );
                    }
                }}
                options={locale.all}
                renderInput={(props) => (
                    <TextField {...props} label={t('Favourite languages')} />
                )}
                sx={{
                    mt: '24px',
                }}
                value={usersLanguages.map((lang) => ({
                    name: lang.displayName,
                    tag: lang.code,
                    lcid: 0,
                }))}
            />
            <Accordion>
                <AccordionSummary>
                    {t('commonButtons.changeOrder')}
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {usersLanguages.map((language, idx) => (
                            <ListItem key={idx} divider>
                                <Box>
                                    <Button
                                        disabled={idx === 0}
                                        onClick={() =>
                                            dispatch(
                                                reorderLanguages({
                                                    from: idx,
                                                    to: idx - 1,
                                                }),
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
                                                reorderLanguages({
                                                    from: idx,
                                                    to: idx + 1,
                                                }),
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
        </Box>
    );
};

export default LanguageSelector;
