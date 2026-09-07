import { type SyntheticEvent, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Container, Paper, Typography } from '@mui/material';

import TabControls from '../../components/TabControls';
import TabPanel from '../../components/TabPanel';
import Upload from '../../components/Upload';
import {
    TransactionRange,
    initialState,
    transactionRangeReducer,
} from '../../contexts/transactionRangeContext';

import Edit from './components/Edit';
import RangeControls from './components/RangeControls';
import RequestControls from './components/RequestControls';
import Table from './components/Table';

type TUploadTab = 'upload' | 'edit';

/**
 * Page component to display transactions within a range and upload new transactions.
 * @component
 * @category Pages
 * @subcategory Transactions
 */
const Transactions = () => {
    const [tab, setTab] = useState<TUploadTab>('upload');

    const { t } = useTranslation();

    const [state, dispatch] = useReducer(transactionRangeReducer, initialState);

    const handleChange = (_: SyntheticEvent, nextTab: TUploadTab) => {
        setTab(nextTab);
    };

    return (
        <TransactionRange.Provider value={{ state, dispatch }}>
            <Container>
                <Typography sx={{ margin: '24px 0' }} variant='h2'>
                    {t('pageTitles.transactions')}
                </Typography>
                <TabControls
                    containerAriaLabel='Upload or edit tab controls'
                    onChange={handleChange}
                    options={[
                        { label: 'Upload', value: 'upload' },
                        { label: 'Explore & Edit', value: 'edit' },
                    ]}
                    panelPrefix='upload_edit'
                    tab={tab}
                />
                <TabPanel index={'upload'} panelPrefix='upload_edit' tab={tab}>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(1, 1fr)',
                            margin: '24px 0',
                            gridGap: '16px 32px',
                        }}
                    >
                        <Upload />
                    </Box>
                </TabPanel>
                <TabPanel index={'edit'} panelPrefix='upload_edit' tab={tab}>
                    <Box>
                        <RequestControls />
                        <Paper elevation={0} sx={{ padding: '16px 64px' }}>
                            <RangeControls />
                            <Edit />
                            <Table />
                        </Paper>
                    </Box>
                </TabPanel>
            </Container>
        </TransactionRange.Provider>
    );
};

export default Transactions;
