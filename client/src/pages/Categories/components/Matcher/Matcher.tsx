import { useState } from 'react'

import { ListItem, Typography } from '@mui/material'
import {
    FontDownloadOutlined as MatchNegativeIcon,
    FontDownload as MatchPositiveIcon,
} from '@mui/icons-material'

import { Matcher as MatcherT } from '../../../../types/Matcher'

import EditMatcher from '../EditMatcher/'

interface Props {
    matcher: MatcherT
}

const Matcher = ({ matcher }: Props) => {
    const [open, setOpen] = useState<boolean>(false)

    const handleSubmit = (matcher: Partial<MatcherT>) => {
        setOpen(false)
        console.log(matcher)
    }

    if (open) {
        return (
            <EditMatcher
                onCancel={() => setOpen(false)}
                onSubmit={handleSubmit}
                clearOnBlur={true}
                clearOnCancel={true}
                clearOnSubmit={true}
            />
        )
    }

    const iconWidth = 50;
    return (
        <ListItem
            onClick={() => setOpen(true)}
            sx={{
                textAlign: 'left',
                paddingLeft: 0,
                paddingRight: 0,
                display: 'grid',
                gridTemplateColumns: `1fr ${iconWidth}px ${iconWidth}px`,
            }}
        >
            <Typography variant='body2'>
                {matcher.match}
            </Typography>
            {
                matcher.case_sensitive
                    ? <MatchPositiveIcon />
                    : <MatchNegativeIcon />
            }
            <Typography variant='body1'>
                {matcher.match_type}
            </Typography>
        </ListItem>
    )
}

export default Matcher
