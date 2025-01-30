import { Container, Typography } from '@mui/material';

import ExistingDataLineChart from '../../modules/ExistingDataLineChart/ExistingDataLineChart';
import ProjectionLineChart from '../../modules/ProjectionLineChart/ProjectionLineChart';

import ActiveCard from '../../components/ActiveCard/ActiveCard';
import ActiveBudget from '../../components/ActiveBudget';

/**
 * Displays all historical data.
 * @category Pages
 * @subcategory All Data
 * @component
 */
const AllData = () => {
    return (
        <Container
            sx={{
                width: '90vw',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gridGap: '16px',
            }}
        >
            <Typography sx={{ mt: '16px' }} variant='h2'>
                All historic data
            </Typography>
            <ActiveCard />
            <ActiveBudget />
            <ExistingDataLineChart />
            <ProjectionLineChart />
        </Container>
    );
};

export default AllData;
