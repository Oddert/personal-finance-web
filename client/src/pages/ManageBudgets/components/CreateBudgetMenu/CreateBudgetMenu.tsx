import { FC } from 'react';
import { useNavigate } from 'react-router';

import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import {
	CopyAll as FromCopyIcon,
	NoteAdd as CreateFreshIcon,
} from '@mui/icons-material';

import { ROUTES, ROUTES_FACTORY } from '../../../../constants/routerConstants';

import { IProps } from './CreateBudgetMenu.types';

const CreateBudgetMenu: FC<IProps> = ({
	anchorEl,
	handleClose,
}) => {
	const navigate = useNavigate();
	const open = Boolean(anchorEl);

	const handleClickNew = () => {
		navigate(ROUTES.CREATE_BUDGET);
		handleClose();
	};

	const handleClickTemplate = () => {
		navigate(ROUTES_FACTORY.CREATE_BUDGET('undefined'));
		handleClose();
	};

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
			<MenuItem onClick={handleClickNew}>
				<ListItemIcon>
					<FromCopyIcon fontSize="small" />
				</ListItemIcon>
				Create from template
			</MenuItem>
			<MenuItem onClick={handleClickTemplate}>
				<ListItemIcon>
					<CreateFreshIcon fontSize="small" />
				</ListItemIcon>
				New blank budget
			</MenuItem>
		</Menu>
	);
}

export default CreateBudgetMenu;
