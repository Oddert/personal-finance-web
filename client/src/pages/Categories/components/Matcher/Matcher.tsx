import { useMemo, useState } from 'react'

import { Box, Button, ListItem, Typography } from '@mui/material'
import {
    Edit as EditIcon,
    FontDownload as MatchPositiveIcon,
    FontDownloadOutlined as MatchNegativeIcon,
} from '@mui/icons-material'

import { Matcher as MatcherT } from '../../../../types/Matcher'

import EditMatcher from '../EditMatcher/'

interface Props {
    matcher: MatcherT
}

const iconWidth = 50

const Matcher = ({ matcher }: Props) => {
    const [open, setOpen] = useState<boolean>(false)

    const handleSubmit = (matcher: Partial<MatcherT>) => {
        setOpen(false)
        console.log(matcher)
    }
    
    const matchTypeTitle = useMemo(() => {
        switch(matcher?.match_type) {
            case 'any':
                return 'matches this text anywhere in the description'
            case 'exact':
                return 'only matches this exact string (may not have anything before or after)'
            case 'end':
                return 'matches only if this text is at the end of a description'
            case 'start':
                return 'matches only if this text is at the beginning of a description'
        }
    }, [matcher?.match_type])

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

    return (
        <ListItem
            sx={{
                textAlign: 'left',
                paddingLeft: 0,
                paddingRight: 0,
                display: 'grid',
                gridTemplateColumns: `1fr ${iconWidth}px ${iconWidth}px`,
            }}
        >
            <Button
                onClick={() => setOpen(true)}
                sx={(theme) => ({
                    justifySelf: 'flex-start',
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.common.white,
                    '& .MuiSvgIcon-root': {
                        transition: '.2s linear',
                        opacity: 0,
                    },
                    '&:hover': {
                        '& .MuiSvgIcon-root': {
                            opacity: 1,
                        }
                    }
                })}
                variant='text'
            >
                <Typography
                    variant='body2'
                    sx={{
                        marginRight: '8px',
                    }}
                >
                    {matcher.match}
                </Typography>
                <EditIcon />
            </Button>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
                title={
                    matcher.case_sensitive
                        ? 'only matches exact case'
                        : 'ignores case'
                }
            >
                {
                    matcher.case_sensitive
                        ? <MatchPositiveIcon />
                        : <MatchNegativeIcon />
                }
            </Box>
            <Typography title={matchTypeTitle} variant='body1'>
                {matcher.match_type}
            </Typography>
        </ListItem>
    )
}

export default Matcher
