// import React, { forwardRef, useImperativeHandle, useRef } from 'react';
// import { ContentRows } from './ContentRows';
// import { useGridComputedProvider, useGridMutableProvider } from '../base/Grid';

// /**
//  * Content table component
//  */
// export const ContentTable = forwardRef((props, ref) => {
//     const grid = useGridComputedProvider();
//     const { colElements } = useGridMutableProvider();
//     const contentTableRef = useRef(null);

//     useImperativeHandle(ref, () => ({
//         contentTableRef: contentTableRef.current,
//         getContentTable: () => contentTableRef.current
//     }), []);

//     return (
//         <table ref={contentTableRef} className="e-table" role="grid">
//             <colgroup>
//                 {colElements}
//             </colgroup>
//             <ContentRows />
//         </table>
//     );
// });

// ContentTable.displayName = 'ContentTable';

import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useMemo,
    memo
} from 'react';
import { ContentRowsBase } from './ContentRows';
import {
    useGridComputedProvider,
    useGridMutableProvider
} from '../base/Grid';

/**
 * ContentTableBase component renders the table structure for grid content
 */
const ContentTableBase = memo(forwardRef((props, ref) => {
    // Access grid context providers
    const { colElements: ColElements } = useGridMutableProvider();
    const grid = useGridComputedProvider();
    const { id } = grid;

    // Refs for DOM elements and child components
    const contentTableRef = useRef(null);
    const rowSectionRef = useRef(null);

    /**
     * Memoized colgroup element to prevent unnecessary re-renders
     * Contains column definitions for the table
     */
    const colGroupContent = useMemo(() => (
        <colgroup
            key={`content-${id}-colgroup`}
            id={`content-${id}-colgroup`}
        >
            {ColElements.length ? ColElements : null}
        </colgroup>
    ), [ColElements, id]);

    /**
     * Expose internal elements and methods through the forwarded ref
     * Only define properties specific to ContentTable and forward ContentRows properties
     */
    useImperativeHandle(ref, () => ({
        // ContentTable specific properties
        contentTableRef: contentTableRef.current,
        getContentTable: () => contentTableRef.current,
        // Forward all properties from ContentRows
        ...(rowSectionRef.current)
    }), [contentTableRef.current, rowSectionRef.current]);

    /**
     * Memoized content rows component to prevent unnecessary re-renders
     */
    const contentRows = useMemo(() => (
        <ContentRowsBase
            ref={rowSectionRef}
            role="rowgroup"
        />
    ), []);

    return (
        <table
            ref={contentTableRef}
            {...props}
        >
            {colGroupContent}
            {contentRows}
        </table>
    );
}
));

/**
 * Set display name for debugging purposes
 */
ContentTableBase.displayName = 'ContentTableBase';

/**
 * Export the ContentTableBase component for use in other components
 *
 * @internal
 */
export { ContentTableBase };
