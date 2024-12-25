import { Container } from '@mui/material'

import ExistingDataLineChart from '../../modules/ExistingDataLineChart/ExistingDataLineChart'
import ProjectionLineChart from '../../modules/ProjectionLineChart/ProjectionLineChart'

const AllData = () => {
    return (
        <Container sx={{ width: '90vw', position: 'relative' }}>
            <ExistingDataLineChart />
            <ProjectionLineChart />
        </Container>
    )
}

export default AllData
