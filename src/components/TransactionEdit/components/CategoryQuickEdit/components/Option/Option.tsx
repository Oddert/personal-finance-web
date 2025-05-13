import { FC, useCallback, useContext, useState } from 'react';
import { Button } from '@mui/material';

import type { IMatcher, TMatchType } from '../../../../../../types/Matcher';

import {
    tecWriteTransactions,
    toggleSideBar,
    TransactionEditContext,
} from '../../../../../../contexts/transactionEditContext';

import { autoMatchCategories } from '../../../../../../utils/uploadUtils';

import Category from '../../../../../Category/Category';
import ColourBase from '../../../../../ColourBase';
import TitleBase from '../../../../../Category/components/TitleBase';

import type { IProps } from './Option.types';

/**
 * Displays a category.
 * @category Components
 * @subcategory Transaction Edit
 * @component
 * @param props.onClose Callback function invoked when the submit succeeds.
 */
const Option: FC<IProps> = ({ category }) => {
    const {
        dispatch,
        state: { match, transactions },
    } = useContext(TransactionEditContext);

    const [open, setOpen] = useState(false);

    const handleClose = useCallback(
        (partialMatcher: Partial<IMatcher>) => {
            const matcher: IMatcher = {
                id: '0',
                match: partialMatcher.match as string,
                match_type: partialMatcher.match_type as TMatchType,
                case_sensitive: partialMatcher.case_sensitive as
                    | boolean
                    | 0
                    | 1,
                created_on: '',
                updated_on: '',
            };
            dispatch(
                tecWriteTransactions(
                    autoMatchCategories(transactions, [
                        {
                            ...category,
                            matchers: [matcher],
                        },
                    ]),
                ),
            );
            dispatch(toggleSideBar(false));
        },
        [category, dispatch, transactions],
    );

    if (open) {
        return (
            <Category
                category={category}
                defaultOpenAddNew
                defaultOpenMatcher={{ match }}
                onAddNewSubmit={handleClose}
            />
        );
    }
    return (
        <Button
            onClick={() => setOpen(true)}
            sx={(theme) => ({
                padding: '10px 30px',
                [theme.breakpoints.down('xs')]: {
                    padding: '15px',
                },
                minWidth: '300px',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                color: theme.palette.common.white,
            })}
        >
            <ColourBase asButton={false} colour={category.colour} size='sm' />
            <TitleBase
                colour={category.colour}
                editable={false}
                text={category.label}
            />
        </Button>
    );
};

export default Option;
