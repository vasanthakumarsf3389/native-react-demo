// import React, { forwardRef, useImperativeHandle, useRef, useLayoutEffect } from 'react';
// import { ContentTable } from './ContentTable';

// /**
//  * Content panel component for the grid
//  */
// export const ContentPanelBase = forwardRef((props, ref) => {
//     const { panelAttributes, scrollContentAttributes, setHeaderPadding } = props;
//     const contentPanelRef = useRef(null);
//     const contentScrollRef = useRef(null);

//     useImperativeHandle(ref, () => ({
//         contentPanelRef: contentPanelRef.current,
//         contentScrollRef: contentScrollRef.current,
//         getContentRows: () => {
//             const contentTable = contentScrollRef.current?.querySelector('table');
//             return contentTable?.querySelectorAll('tbody tr');
//         }
//     }), []);

//     // Set header padding when content panel mounts or updates
//     useLayoutEffect(() => {
//         if (setHeaderPadding) {
//             setHeaderPadding();
//         }
//     }, [setHeaderPadding]);

//     return (
//         <div ref={contentPanelRef} {...panelAttributes}>
//             <div ref={contentScrollRef} {...scrollContentAttributes}>
//                 <ContentTable />
//             </div>
//         </div>
//     );
// });

// ContentPanelBase.displayName = 'ContentPanelBase';


// src/renderer/ContentPanel.tsx
import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useMemo,
    memo
} from 'react';
import { ContentTableBase } from './ContentTable';
import {
    useGridComputedProvider
} from '../base/Grid';

// CSS class constants following enterprise naming convention
const CSS_CONTENT_TABLE = 'e-table';

/**
 * Default styles for content table to ensure consistent rendering
 */
const DEFAULT_TABLE_STYLE = {
    borderCollapse: 'separate',
    borderSpacing: '0.25px'
};

/**
 * ContentPanelBase component renders the scrollable grid content area
 */
const ContentPanelBase = memo(forwardRef((props, ref) => {
    const { panelAttributes, scrollContentAttributes } = props;
    const { id } = useGridComputedProvider();

    // Refs for DOM elements and child components
    const contentPanelRef = useRef(null);
    const contentScrollRef = useRef(null);
    const contentTableRef = useRef(null);

    /**
     * Expose internal elements and methods through the forwarded ref
     * Only define properties specific to ContentPanel and forward ContentTable properties
     */
    useImperativeHandle(ref, () => ({
        // ContentPanel specific properties
        contentPanelRef: contentPanelRef.current,
        contentScrollRef: contentScrollRef.current,

        // Forward all properties from ContentTable
        ...(contentTableRef.current)
    }), [contentPanelRef.current, contentScrollRef.current, contentTableRef.current]);

    /**
     * Memoized content table component to prevent unnecessary re-renders
     */
    const contentTable = useMemo(() => (
        <ContentTableBase
            ref={contentTableRef}
            className={CSS_CONTENT_TABLE}
            role="presentation"
            id={`${id}_content_table`}
            style={DEFAULT_TABLE_STYLE}
        />
    ), [id]);

    return (
        <div
            {...panelAttributes}
            ref={contentPanelRef}
        >
            <div
                ref={contentScrollRef}
                {...scrollContentAttributes}
            >
                {contentTable}
            </div>
        </div>
    );
}
), (prevProps, nextProps) => {
    // Custom comparison function for memo to prevent unnecessary re-renders
    // Only re-render if styles have changed
    const prevStyle = prevProps.scrollContentAttributes?.style;
    const nextStyle = nextProps.scrollContentAttributes?.style;
    const isBusyEqual = prevProps.scrollContentAttributes?.['aria-busy'] === nextProps.scrollContentAttributes?.['aria-busy'];

    // Deep comparison of style objects
    const stylesEqual = JSON.stringify(prevStyle) === JSON.stringify(nextStyle);

    return stylesEqual && isBusyEqual;
});

/**
 * Set display name for debugging purposes
 */
ContentPanelBase.displayName = 'ContentPanelBase';

/**
 * Export the ContentPanelBase component for use in other components
 *
 * @internal
 */
export { ContentPanelBase };
