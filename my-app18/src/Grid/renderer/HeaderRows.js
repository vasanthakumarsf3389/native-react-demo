// import React, { forwardRef, useImperativeHandle, useRef } from 'react';
// import { useGridComputedProvider } from '../base/Grid';
// import { headerValueAccessor } from '../base/utils';

// /**
//  * Header rows component
//  */
// export const HeaderRows = forwardRef((props, ref) => {
//     const grid = useGridComputedProvider();
//     const { columns } = grid;
//     const headerSectionRef = useRef(null);

//     useImperativeHandle(ref, () => ({
//         headerSectionRef: headerSectionRef.current,
//         getHeaderRows: () => {
//             return headerSectionRef.current?.querySelectorAll('tr');
//         }
//     }), []);

//     const renderHeaderCells = () => {
//         if (!columns || columns.length === 0) return null;

//         return columns.map((column, index) => {
//             const headerText = column.headerText || column.field || '';
            
//             return (
//                 <th
//                     key={`header-${index}`}
//                     className="e-headercell"
//                     style={{ 
//                         textAlign: column.headerTextAlign || column.textAlign || 'left',
//                         width: column.width
//                     }}
//                     role="columnheader"
//                     aria-sort="none"
//                     tabIndex={-1}
//                 >
//                     <div className="e-headercelldiv">
//                         <span className="e-headertext">
//                             {headerText}
//                         </span>
//                     </div>
//                 </th>
//             );
//         });
//     };

//     return (
//         <thead ref={headerSectionRef}>
//             <tr className="e-headerrow" role="row">
//                 {renderHeaderCells()}
//             </tr>
//         </thead>
//     );
// });

// HeaderRows.displayName = 'HeaderRows';

// src/renderer/HeaderRows.tsx
import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useMemo,
    useCallback,
    memo,
    useEffect
} from 'react';
import {
    useGridMutableProvider
} from '../base/Grid';
import { RowBase } from './Row';
import { RenderType } from '../base/enum';

// CSS class constants following enterprise naming convention
const CSS_COLUMN_HEADER = 'e-columnheader';

/**
 * HeaderRowsBase component renders the header rows within the table header section
 */
const HeaderRowsBase = memo(forwardRef((props, ref) => {
    const { columnsDirective, headerRowDepth } = useGridMutableProvider();

    // Refs for DOM elements and child components
    const headerSectionRef = useRef(null);
    const rowsObjectRef = useRef([]);

    /**
     * Returns the collection of header row elements
     *
     * @returns {HTMLCollectionOf<HTMLTableRowElement> | undefined} Collection of header row elements
     */
    const getHeaderRows = useCallback(() => {
        return headerSectionRef.current?.children;
    }, [headerSectionRef.current?.children]);

    /**
     * Returns the row options objects with DOM element references
     */
    const getHeaderRowsObject = useCallback(() => rowsObjectRef.current, [rowsObjectRef.current]);

    /**
     * Expose internal elements and methods through the forwarded ref
     */
    useImperativeHandle(ref, () => ({
        headerSectionRef: headerSectionRef.current,
        getHeaderRows,
        getHeaderRowsObject
    }), [getHeaderRows, getHeaderRowsObject]);

    /**
     * Callback to store row element references directly in the row object
     *
     * @param {number} index - Row index
     * @param {HTMLTableRowElement} element - Row DOM element
     */
    const storeRowRef = useCallback((index, element, cellRef) => {
        // Directly update the element reference in the row object
        rowsObjectRef.current[index].element = element;
        rowsObjectRef.current[index].cells = cellRef;
    }, []);

    /**
     * Memoized header row content to prevent unnecessary re-renders
     */
    const headerRowContent = useMemo(() => {
        const rows = [];
        const rowOptions = [];
        // Generate header rows based on headerRowDepth
        for (let rowIndex = 0; rowIndex < headerRowDepth; rowIndex++) {
            const options = {};
            options.index = rowIndex;
            const rowId = `grid-header-row-${rowIndex}-${Math.random().toString(36).substr(2, 5)}`;
            // Store the options object for getRowsObject
            rowOptions.push({ ...options });
            rows.push(
                <RowBase
                    ref={(element) => {
                        if (element?.rowRef?.current) {
                            storeRowRef(rowIndex, element.rowRef.current, element.getCells());
                        }
                    }}
                    role='row'
                    row={options}
                    key={rowId}
                    rowType={RenderType.Header}
                    className={`${CSS_COLUMN_HEADER}`}
                >
                    {(columnsDirective.props).children}
                </RowBase>
            );
        }
        // Store the row options in the ref for access via getRowsObject
        rowsObjectRef.current = rowOptions;
        return rows;
    }, [columnsDirective]);

    // useEffect(() => {
    //     return () => {
    //         rowsObjectRef.current = [];
    //     };
    // }, []);

    return (
        <thead
            {...props}
            ref={headerSectionRef}
        >
            {headerRowContent}
        </thead>
    );
}
));

/**
 * Set display name for debugging purposes
 */
HeaderRowsBase.displayName = 'HeaderRowsBase';

/**
 * Export the HeaderRowsBase component for use in other components
 *
 * @internal
 */
export { HeaderRowsBase };
