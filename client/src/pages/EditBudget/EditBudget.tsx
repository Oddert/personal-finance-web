import { FC, useEffect, useState } from 'react';

import { IProps } from './EditBudget.types';
import { useParams } from 'react-router';

const EditBudget: FC<IProps> = () => {
	const [isEdit, setIsEdit] = useState(false);
	
	const params = useParams();

	useEffect(() => {
		console.log(params)
	}, [params])

	return null;
}

export default EditBudget;
