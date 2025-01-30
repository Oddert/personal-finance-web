import { FC, useContext } from 'react';

import { Checkbox } from '@mui/material';

import {
    changeSingleSelected,
    TransactionEditContext,
} from '../../../contexts/transactionEditContext';

import { IProps } from './SelectOption.types';

/**
 * Renders the selected checkbox.
 * @component
 * @category Components
 * @category Transaction Edit
 * @param props.idx The transaction index.
 * @param props.transaction The transaction row.
 */
const SelectOption: FC<IProps> = ({ idx, transaction }) => {
    const { dispatch } = useContext(TransactionEditContext);

    return (
        <Checkbox
            checked={Boolean(transaction.selected)}
            onChange={(event) =>
                dispatch(changeSingleSelected(idx, event.target.checked))
            }
        />
    );
};

export default SelectOption;
