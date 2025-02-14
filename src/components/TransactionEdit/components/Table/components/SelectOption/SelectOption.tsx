import { FC, useContext } from 'react';

import { Checkbox, TableCell } from '@mui/material';

import {
    changeSingleSelected,
    TransactionEditContext,
} from '../../../../../../contexts/transactionEditContext';

import { IProps } from './SelectOption.types';

/**
 * Renders the selected checkbox.
 * @component
 * @category Components
 * @category Transaction Edit
 * @param props.idx The transaction index.
 * @param props.transaction The transaction row.
 */
const SelectOption: FC<IProps> = ({ transaction }) => {
    const { dispatch } = useContext(TransactionEditContext);

    return (
        <TableCell>
            <Checkbox
                checked={Boolean(transaction.selected)}
                onChange={(event) =>
                    dispatch(
                        changeSingleSelected(
                            transaction.tecTempId as string,
                            event.target.checked,
                        ),
                    )
                }
            />
        </TableCell>
    );
};

export default SelectOption;
