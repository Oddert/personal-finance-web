import { FC, Fragment, MouseEvent, useState } from 'react';

import { Button } from '@mui/material';
import { Add as PlusIcon } from '@mui/icons-material';

import CreateBudgetMenu from '../CreateBudgetMenu';

import { IProps } from './CreateBudgetButton.types';

const CreateBudgetButton: FC<IProps> = () => {
	const [anchorEl, setAnchorEl] = useState<Element | null>(null);

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	}

	const handleClose = () => {
		setAnchorEl(null);
	}

	return (
		<Fragment>
			<Button onClick={handleClick} variant='contained'>
				<PlusIcon /> Create new budget
			</Button>
			<CreateBudgetMenu
				anchorEl={anchorEl}
				handleClose={handleClose}
			/>
		</Fragment>
	);
}

export default CreateBudgetButton;
