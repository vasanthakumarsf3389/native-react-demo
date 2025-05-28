// import React, { forwardRef, useImperativeHandle, useRef } from 'react';
// import { HeaderTable } from './HeaderTable';

// /**
//  * Header panel component for the grid
//  */
// export const HeaderPanelBase = forwardRef((props, ref) => {
//     const { panelAttributes, scrollContentAttributes } = props;
//     const headerPanelRef = useRef(null);
//     const headerScrollRef = useRef(null);

//     useImperativeHandle(ref, () => ({
//         headerPanelRef: headerPanelRef.current,
//         headerScrollRef: headerScrollRef.current,
//         getHeaderRows: () => {
//             const headerTable = headerScrollRef.current?.querySelector('table');
//             return headerTable?.querySelectorAll('tr');
//         }
//     }), []);

//     return (
//         <div ref={headerPanelRef} {...panelAttributes}>
//             <div ref={headerScrollRef} {...scrollContentAttributes}>
//                 <HeaderTable />
//             </div>
//         </div>
//     );
// });

// HeaderPanelBase.displayName = 'HeaderPanelBase';


// src/renderer/HeaderPanel.tsx
import { forwardRef, useImperativeHandle, useRef, useMemo, memo } from 'react';
import { HeaderTableBase } from './HeaderTable';

// CSS class constants following enterprise naming convention
const CSS_HEADER_TABLE = 'e-table';

/**
 * Default styles for header table to ensure consistent rendering
 */
const DEFAULT_TABLE_STYLE = {
    borderCollapse: 'separate',
    borderSpacing: '0.25px'
};

/**
 * HeaderPanelBase component renders the static area for the grid header.
 * This component wraps the HeaderTableBase in a scrollable container and
 * is responsible for organizing the header rows and synchronizing scrolling behavior.
 */
const HeaderPanelBase = memo(forwardRef((props, ref) => {
    const { panelAttributes, scrollContentAttributes } = props;

    // Refs for DOM elements and child components
    const headerPanelRef = useRef(null);
    const headerScrollRef = useRef(null);
    const headerTableRef = useRef(null);

    /**
     * Expose internal elements and methods through the forwarded ref
     * Only define properties specific to HeaderPanel and forward HeaderTable properties
     */
    useImperativeHandle(ref, () => ({
        // HeaderPanel specific properties
        headerPanelRef: headerPanelRef.current,
        headerScrollRef: headerScrollRef.current,

        // Forward all properties from HeaderTable
        ...(headerTableRef.current)
    }), [headerPanelRef.current, headerScrollRef.current, headerTableRef.current]);

    /**
     * Memoized header table component to prevent unnecessary re-renders
     */
    const headerTable = useMemo(() => (
        <HeaderTableBase
            ref={headerTableRef}
            className={CSS_HEADER_TABLE}
            role="presentation"
            style={DEFAULT_TABLE_STYLE}
        />
    ), []);

    return (
        <div
            ref={headerPanelRef}
            {...panelAttributes}
        >
            <div
                ref={headerScrollRef}
                {...scrollContentAttributes}
            >
                {headerTable}
            </div>
        </div>
    );
}
), (prevProps, nextProps) => {
    // Custom comparison function for memo to prevent unnecessary re-renders
    // Only re-render if styles have changed
    const prevStyle = prevProps.panelAttributes?.style;
    const nextStyle = nextProps.panelAttributes?.style;
    const prevScrollStyle = prevProps.scrollContentAttributes?.style;
    const nextScrollStyle = nextProps.scrollContentAttributes?.style;

    // Deep comparison of style objects
    const stylesEqual =
        JSON.stringify(prevStyle) === JSON.stringify(nextStyle) &&
        JSON.stringify(prevScrollStyle) === JSON.stringify(nextScrollStyle);

    return stylesEqual;
});

/**
 * Set display name for debugging purposes
 */
HeaderPanelBase.displayName = 'HeaderPanelBase';

/**
 * Export the HeaderPanelBase component for direct usage if needed
 *
 * @internal
 */
export { HeaderPanelBase };
