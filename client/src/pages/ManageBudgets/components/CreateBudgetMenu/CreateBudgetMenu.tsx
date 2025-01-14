import { FC } from 'react';

import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import {
	CopyAll as FromCopyIcon,
	NoteAdd as CreateFreshIcon,
} from '@mui/icons-material';

import { IProps } from './CreateBudgetMenu.types';

const CreateBudgetMenu: FC<IProps> = ({
	anchorEl,
	handleClose,
}) => {
	const open = Boolean(anchorEl);
	return (
		<Menu
			id='basic-menu'
			anchorEl={anchorEl}
			open={open}
			onClose={handleClose}
			MenuListProps={{
				'aria-labelledby': 'basic-button',
			}}
		>
			<MenuItem onClick={handleClose}>
				<ListItemIcon>
					<FromCopyIcon fontSize="small" />
				</ListItemIcon>
				Create from template
			</MenuItem>
			<MenuItem onClick={handleClose}>
				<ListItemIcon>
					<CreateFreshIcon fontSize="small" />
				</ListItemIcon>
				New blank budget
			</MenuItem>
		</Menu>
	);
}

export default CreateBudgetMenu;
