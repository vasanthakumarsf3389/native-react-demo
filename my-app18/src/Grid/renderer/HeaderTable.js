// import React, { forwardRef, useImperativeHandle, useRef } from 'react';
// import { HeaderRows } from './HeaderRows';
// import { useGridComputedProvider, useGridMutableProvider } from '../base/Grid';

// /**
//  * Header table component
//  */
// export const HeaderTable = forwardRef((props, ref) => {
//     const grid = useGridComputedProvider();
//     const { colElements } = useGridMutableProvider();
//     const headerTableRef = useRef(null);

//     useImperativeHandle(ref, () => ({
//         headerTableRef: headerTableRef.current,
//         getHeaderTable: () => headerTableRef.current
//     }), []);

//     return (
//         <table ref={headerTableRef} className="e-table" role="grid">
//             <colgroup>
//                 {colElements}
//             </colgroup>
//             <HeaderRows />
//         </table>
//     );
// });

// HeaderTable.displayName = 'HeaderTable';

import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useMemo,
    memo
} from 'react';
import { HeaderRowsBase } from './HeaderRows';
import {
    useGridComputedProvider,
    useGridMutableProvider
} from '../base/Grid';

/**
 * HeaderTableBase component renders the table structure for grid headers
 */
const HeaderTableBase = memo(forwardRef((props, ref) => {
    // Access grid context providers
    const { colElements: ColElements } = useGridMutableProvider();
    const { id } = useGridComputedProvider();

    // Refs for DOM elements and child components
    const headerTableRef = useRef(null);
    const rowSectionRef = useRef(null);

    /**
     * Memoized colgroup element to prevent unnecessary re-renders
     * Contains column definitions for the table
     */
    const colGroupContent = useMemo(() => (
        <colgroup
            key={`${id}-colgroup`}
            id={`${id}-colgroup`}
        >
            {ColElements.length ? ColElements : null}
        </colgroup>
    ), [ColElements, id]);

    /**
     * Expose internal elements and methods through the forwarded ref
     */
    useImperativeHandle(ref, () => ({
        headerTableRef: headerTableRef.current,
        getHeaderTable: () => headerTableRef.current,
        ...(rowSectionRef.current)
    }), [headerTableRef.current, rowSectionRef.current]);

    /**
     * Memoized header rows component to prevent unnecessary re-renders
     */
    const headerRows = useMemo(() => (
        <HeaderRowsBase
            ref={rowSectionRef}
            role="rowgroup"
        />
    ), []);

    return (
        <table
            ref={headerTableRef}
            {...props}
        >
            {colGroupContent}
            {headerRows}
        </table>
    );
}
));

/**
 * Set display name for debugging purposes
 */
HeaderTableBase.displayName = 'HeaderTableBase';

/**
 * Export the HeaderTableBase component for use in other components
 *
 * @internal
 */
export { HeaderTableBase };
