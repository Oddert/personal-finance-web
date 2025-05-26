import { Container, Typography } from '@mui/material';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';
import { getUserFirstName } from '../../redux/selectors/authSelectors';

import ExistingDataLineChart from '../../modules/ExistingDataLineChart';
import ProjectionLineChart from '../../modules/ProjectionLineChart';

/**
 * Main home page component.
 *
 * Displays a series of Modules as composable cards.
 * @component
 * @category Pages
 * @subcategory Home
 */
const Home = () => {
    const firstName = useAppSelector(getUserFirstName);
    return (
        <Container
            sx={{
                height: '200vh',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                alignContent: 'start',
                alignItems: 'start',
                gridGap: '20px',
                // gridAutoRows: '400px',
            }}
        >
            <Typography
                sx={{ gridColumn: '1/-1', textAlign: 'left' }}
                variant='h2'
            >
                Welcome {firstName}
            </Typography>
            <ExistingDataLineChart compact />
            <ProjectionLineChart compact />
        </Container>
    );
};

export default Home;
