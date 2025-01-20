import { useEffect, useState } from 'react';

import breakpoints from '../theme/breakpoints';

type TSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const contentWidths = {
    xs: 400,
    sm: 500,
    md: 700,
    lg: 1200,
    xl: 1500,
};

if (!breakpoints.values) {
    console.error(
        'useContentWidth: breakpoints.values is not defined. Please check the theme config to ensure responsiveness.',
    );
}

const bp = breakpoints?.values
    ? breakpoints.values
    : {
          xs: 0,
          sm: 600,
          md: 900,
          lg: 1200,
          xl: 1536,
      };

/**
 * Provides one of a set of pre-set content widths depending on window width.
 *
 * Intended to provide a standard chart width size, rather than using percentages, with upper and lower limits.
 * @category Hooks
 * @subcategory useContentWidth
 */
const useContentWidth = () => {
    const [contentWidth, setContentWidth] = useState(1200);
    const [windowWidth, setWindowWidth] = useState(1200);
    const [breakpoint, setBreakPoint] = useState<TSizes>('xl');

    const handleResize = () => {
        const nextWidth = window.innerWidth;
        console.log('resize', nextWidth);
        setWindowWidth(nextWidth);
        if (nextWidth <= bp.sm && breakpoint !== 'xs') {
            setBreakPoint('xs');
            setContentWidth(contentWidths.xs);
        } else if (nextWidth <= bp.md && breakpoint !== 'sm') {
            setBreakPoint('sm');
            setContentWidth(contentWidths.sm);
        } else if (nextWidth <= bp.lg && breakpoint !== 'md') {
            setBreakPoint('md');
            setContentWidth(contentWidths.md);
        } else if (nextWidth <= bp.xl && breakpoint !== 'lg') {
            setBreakPoint('lg');
            setContentWidth(contentWidths.lg);
        } else {
            setBreakPoint('xl');
            setContentWidth(contentWidths.xl);
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { breakpoint, contentWidth, windowWidth };
};

export default useContentWidth;
