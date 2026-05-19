import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, FormLabel } from '@mui/material';

import type { IProps } from './ActiveCard.types';

import CardSelector from '../CardSelector';

/**
 * Displays a form control for the {@link CardSelector} with a left-aligned label and some formatting.
 *
 * Refreshes the transactions on change.
 * @component
 * @category Components
 * @subcategory Active Card
 */
const ActiveCard: FC<IProps> = () => {
    const { t } = useTranslation();
    return (
        <Box
            sx={{
                display: 'inline-flex',
                gridGap: '16px',
                alignItems: 'center',
            }}
        >
            <FormLabel
                data-testid='components-ActiveCard__title'
                sx={{ minWidth: '75px', textAlign: 'left' }}
            >
                {t('literals.Card')}:
            </FormLabel>
            <CardSelector refreshTransactions sx={{ width: '100%' }} />
        </Box>
    );
};

export default ActiveCard;
