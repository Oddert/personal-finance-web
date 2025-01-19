import { FC } from 'react';

import { List } from '@mui/material';

import { IProps } from './DynamicCardList.types';

const DynamicCardList: FC<IProps> = ({ children, layout }) => {
	return (
		<List
			sx={(theme) => layout === 'list' ? ({
				display: 'flex',
				flexDirection: 'column',
				[theme.breakpoints.down('sm')]: {
					gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
					gridGap: '10px',
				}
			}) : layout === 'compact' ? ({
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
				alignItems: 'start',
				gridGap: '4px',
				[theme.breakpoints.down('sm')]: {
					gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
					gridGap: '10px',
				}
			}) : ({
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
				alignItems: 'start',
				gridGap: '16px',
				[theme.breakpoints.down('sm')]: {
					gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
					gridGap: '10px',
				}
			})}
		>
			{children}
		</List>
	)
}

export default DynamicCardList;
