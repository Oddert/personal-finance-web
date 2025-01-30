import { FC, useEffect, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { IDynamicCardLayoutModes } from '../../types/Common.types';

import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';

import { refreshBudgets } from '../../redux/thunks/budgetThunks';
import { getCardResponse } from '../../redux/selectors/cardSelectors';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import DynamicCardList from '../../components/DynamicCardList';
import LayoutControls from '../../components/LayoutControls';

import CardTile from './components/CardTile';
import CreateCardButton from './components/CreateCardButton';
import CreateCardTile from './components/CreateCardTile';

import { IProps } from './ManageCards.types';

/**
 * Page component to display all cards.
 * @component
 * @category Pages
 * @subcategory Manage Cards
 */
const ManageCards: FC<IProps> = () => {
    const dispatch = useAppDispatch();

    const [layout, setLayout] = useState<IDynamicCardLayoutModes>('standard');

    const cards = useAppSelector(getCardResponse);

    useEffect(() => {
        dispatch(refreshBudgets(true));
        // TODO: re-enable react-hooks/exhaustive-deps
    }, []);

    console.log(setLayout, cards);

    return (
        <ResponsiveContainer>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gridGap: '16px',
                    padding: '0 0 64px 0',
                }}
            >
                <Typography variant='h2' sx={{ margin: '32px 0' }}>
                    Manage Cards
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0 8px',
                    }}
                >
                    <LayoutControls layout={layout} setLayout={setLayout} />
                    <CreateCardButton />
                </Box>
                <DynamicCardList layout={layout}>
                    {cards.map((card, idx) => (
                        <CardTile card={card} key={idx} />
                    ))}
                    <CreateCardTile />
                </DynamicCardList>
            </Box>
        </ResponsiveContainer>
    );
};

export default ManageCards;
