import { Box } from '@mui/material';

import Header from '../Header/Header';

/**
 * Adds the nav bar and any other common attributes to a page.
 * @category Components
 * @subcategory Layout
 * @component
 * @param props.children The page contents.
 */
const Layout = ({ children }) => (
    <Box>
        <Header />
        {children}
    </Box>
);

export default Layout;
