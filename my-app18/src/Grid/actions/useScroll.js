// import { useState, useCallback, useMemo } from 'react';

// /**
//  * Custom hook for scroll management
//  */
// export const useScroll = () => {
//     const [headerScrollElement, setHeaderScrollElement] = useState(null);
//     const [contentScrollElement, setContentScrollElement] = useState(null);
//     const [headerPadding, setHeaderPadding] = useState({});
//     const [headerContentBorder, setHeaderContentBorder] = useState({});

//     /**
//      * Set padding for scroll elements
//      */
//     const setPadding = useCallback(() => {
//         if (contentScrollElement) {
//             const scrollbarWidth = contentScrollElement.offsetWidth - contentScrollElement.clientWidth;
            
//             if (scrollbarWidth > 0) {
//                 setHeaderPadding({
//                     paddingRight: `${scrollbarWidth}px`
//                 });
//                 setHeaderContentBorder({
//                     borderRight: `${scrollbarWidth}px solid transparent`
//                 });
//             } else {
//                 setHeaderPadding({});
//                 setHeaderContentBorder({});
//             }
//         }
//     }, [contentScrollElement]);

//     /**
//      * Handle content scroll
//      */
//     const onContentScroll = useCallback((event) => {
//         if (headerScrollElement && event.target) {
//             headerScrollElement.scrollLeft = event.target.scrollLeft;
//         }
//     }, [headerScrollElement]);

//     /**
//      * Handle header scroll
//      */
//     const onHeaderScroll = useCallback((event) => {
//         if (contentScrollElement && event.target) {
//             contentScrollElement.scrollLeft = event.target.scrollLeft;
//         }
//     }, [contentScrollElement]);

//     // Private API for internal operations
//     const privateScrollAPI = useMemo(() => ({
//         headerContentBorder,
//         headerPadding,
//         onContentScroll,
//         onHeaderScroll
//     }), [headerContentBorder, headerPadding, onContentScroll, onHeaderScroll]);

//     // Protected API for internal components
//     const protectedScrollAPI = useMemo(() => ({
//         setPadding
//     }), [setPadding]);

//     return {
//         privateScrollAPI,
//         protectedScrollAPI,
//         setHeaderScrollElement,
//         setContentScrollElement
//     };
// };

import { CSSProperties, useCallback, useLayoutEffect, useRef, UIEvent, useMemo, useState, useEffect, RefObject } from 'react';
import { Browser } from '@syncfusion/react-base';
import { useGridComputedProvider } from '../base/Grid';


// CSS class names following enterprise naming convention

/**
 * Custom hook to manage scroll synchronization between header and content panels
 *
 * @returns {UseScrollResult} Scroll-related APIs and functions
 */
export const useScroll = () => {
    const grid = useGridComputedProvider();
    const { height, enableRtl } = grid;
    const [scrollStyles, setScrollStyles] = useState({
        headerPadding: {},
        headerContentBorder: {}
    });

    // Use ref to maintain references to DOM elements
    const elementsRef = useRef({
        headerScrollElement: null,
        contentScrollElement: null,
        isScrolling: false
    });

    /**
     * Determine CSS properties based on RTL/LTR mode
     *
     * @returns {ScrollCss} CSS properties for scroll customization
     */
    const getCssProperties = useMemo(() => {
        return {
            border: enableRtl ? 'borderLeftWidth' : 'borderRightWidth',
            padding: enableRtl ? 'paddingLeft' : 'paddingRight'
        };
    }, [enableRtl]);

    /**
     * Get browser-specific threshold for scrollbar calculations
     *
     * @returns {number} Threshold value
     */
    const getThreshold = useCallback(() => {
        // Safely access Browser.info with multiple fallbacks
        if (!Browser?.info) { return 1; }
        const browserName = Browser.info.name;
        return browserName === 'mozilla' ? 0.5 : 1;
    }, []);

    /**
     * Calculate scrollbar width
     *
     * @returns {number} Width of the scrollbar
     */
    const getScrollBarWidth = useCallback(() => {
        const { contentScrollElement } = elementsRef.current;
        return (contentScrollElement.offsetWidth - contentScrollElement.clientWidth) | 0;
    }, []);

    /**
     * Set padding based on scrollbar width to ensure header and content alignment
     */
    const setPadding = useCallback(() => {

        const scrollWidth = getScrollBarWidth() - getThreshold();
        const cssProps = getCssProperties;

        const paddingValue = scrollWidth > 0 ? `${scrollWidth}px` : '0px';
        const borderValue = scrollWidth > 0 ? '1px' : '0px';

        setScrollStyles({
            headerPadding: { [cssProps.padding]: paddingValue },
            headerContentBorder: { [cssProps.border]: borderValue }
        });
    }, [getScrollBarWidth, getThreshold, getCssProperties]);

    // Update padding when height or RTL mode changes
    useLayoutEffect(() => {
        if (elementsRef.current.contentScrollElement) {
            setPadding();
        }
    }, [height, enableRtl, setPadding]);

    /**
     * Set reference to header scroll element
     *
     * @param {HTMLElement | null} element - Header scroll DOM element
     */
    const setHeaderScrollElement = useCallback((element) => {
        elementsRef.current.headerScrollElement = element;
    }, []);

    /**
     * Set reference to content scroll element
     *
     * @param {HTMLElement | null} element - Content scroll DOM element
     */
    const setContentScrollElement = useCallback((element) => {
        elementsRef.current.contentScrollElement = element;
    }, []);

    /**
     * Handle content scroll events and synchronize header scroll position
     *
     * @param {UIEvent<HTMLDivElement>} args - Scroll event arguments
     */
    const onContentScroll = useCallback((args) => {
        const { headerScrollElement, isScrolling } = elementsRef.current;
        if (!headerScrollElement || isScrolling) { return; } // if we remove shaking hard UI appears when we scroll horizontally slowly.
        // Set flag to prevent infinite scroll loops
        elementsRef.current.isScrolling = true;

        const target = args.target;
        const left = target.scrollLeft;

        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            // Use Object.assign to avoid if-else statements completely
            // This will only modify the object if it exists
            headerScrollElement.scrollLeft = left;
            // Reset flag after a short delay to allow scroll to complete
            setTimeout(() => {
                elementsRef.current.isScrolling = false;
            }, 0);
        });
    }, []);

    /**
     * Handle header scroll events and synchronize content scroll position
     * This is especially important for keyboard navigation (tabbing)
     *
     * @param {UIEvent<HTMLDivElement>} args - Scroll event arguments
     */
    const onHeaderScroll = useCallback((args) => {
        const { contentScrollElement, isScrolling } = elementsRef.current;
        if (!contentScrollElement || isScrolling) { return; } // if we remove shaking hard UI appears when we scroll horizontally slowly.
        // Set flag to prevent infinite scroll loops
        elementsRef.current.isScrolling = true;

        const target = args.target;

        const left = target.scrollLeft;
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            // Use Object.assign to avoid if-else statements completely
            // This will only modify the object if it exists
            contentScrollElement.scrollLeft = left;
            // Reset flag after a short delay to allow scroll to complete
            setTimeout(() => {
                elementsRef.current.isScrolling = false;
            }, 0);
        });
    }, []);

    // Clean up resources on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            // Clear references to DOM elements
            elementsRef.current = {
                headerScrollElement: null,
                contentScrollElement: null,
                isScrolling: false
            };
        };
    }, []);

    // Memoize API objects to prevent unnecessary re-renders
    const publicScrollAPI = useMemo(() => ({ ...grid }), [grid]);

    const privateScrollAPI = useMemo(() => ({
        getCssProperties,
        headerContentBorder: scrollStyles.headerContentBorder,
        headerPadding: scrollStyles.headerPadding,
        onContentScroll,
        onHeaderScroll
    }), [getCssProperties, scrollStyles.headerContentBorder, scrollStyles.headerPadding, onContentScroll, onHeaderScroll]);

    const protectedScrollAPI = useMemo(() => ({
        setPadding
    }), [setPadding]);

    return {
        publicScrollAPI,
        privateScrollAPI,
        protectedScrollAPI,
        setHeaderScrollElement,
        setContentScrollElement
    };
};
