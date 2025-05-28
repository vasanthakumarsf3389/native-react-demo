// import React, { forwardRef, useImperativeHandle, useRef, useMemo, memo } from 'react';
// import { useGridComputedProvider, useGridMutableProvider } from '../base/Grid';
// import { valueAccessor } from '../base/utils';

// /**
//  * Content rows component
//  */
// export const ContentRows = memo(forwardRef((props, ref) => {
//     const grid = useGridComputedProvider();
//     const { currentViewData } = useGridMutableProvider();
//     const { columns, emptyRecordTemplate } = grid;
//     const contentSectionRef = useRef(null);

//     useImperativeHandle(ref, () => ({
//         contentSectionRef: contentSectionRef.current,
//         getRows: () => {
//             return contentSectionRef.current?.querySelectorAll('tr');
//         },
//         getCurrentViewRecords: () => {
//             return currentViewData || [];
//         }
//     }), [currentViewData]);

//     const renderDataCells = (rowData, rowIndex) => {
//         if (!columns || columns.length === 0) return null;

//         return columns.map((column, colIndex) => {
//             const cellValue = valueAccessor(column.field, rowData, column);
//             const formattedValue = column.formatValue ? column.formatValue(cellValue) : cellValue;
            
//             return (
//                 <td
//                     key={`cell-${rowIndex}-${colIndex}`}
//                     className="e-rowcell"
//                     style={{ 
//                         textAlign: column.textAlign || 'left',
//                         width: column.width
//                     }}
//                     role="gridcell"
//                     tabIndex={-1}
//                 >
//                     <div className="e-cellvalue">
//                         {column.template ? 
//                             (typeof column.template === 'function' ? 
//                                 column.template({ field: column.field, rowData }) : 
//                                 column.template) : 
//                             (formattedValue?.toString() || '')
//                         }
//                     </div>
//                 </td>
//             );
//         });
//     };

//     const renderEmptyRow = () => {
//         const colSpan = columns?.length || 1;
        
//         return (
//             <tr className="e-row e-norecords" role="row">
//                 <td className="e-rowcell" colSpan={colSpan} role="gridcell">
//                     <div className="e-empty-content">
//                         {emptyRecordTemplate ? 
//                             (typeof emptyRecordTemplate === 'function' ? 
//                                 emptyRecordTemplate() : 
//                                 emptyRecordTemplate) : 
//                             <span className="e-empty-text">No records to display</span>
//                         }
//                     </div>
//                 </td>
//             </tr>
//         );
//     };

//     const renderDataRows = useMemo(() => {
//         if (!currentViewData || currentViewData.length === 0) {
//             return renderEmptyRow();
//         }

//         return currentViewData.map((rowData, rowIndex) => (
//             <tr 
//                 key={`row-${rowIndex}`} 
//                 className={`e-row ${rowIndex % 2 === 1 ? 'e-altrow' : ''}`}
//                 role="row"
//                 aria-rowindex={rowIndex + 1}
//             >
//                 {renderDataCells(rowData, rowIndex)}
//             </tr>
//         ));
//     }, [currentViewData]);

//     return (
//         <tbody ref={contentSectionRef}>
//             {renderDataRows}
//         </tbody>
//     );
// }));

// ContentRows.displayName = 'ContentRows';

// src/renderer/ContentRows.tsx
import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useMemo,
    useCallback,
    memo,
    isValidElement,
    Children,
    useEffect
} from 'react';
import {
    useGridComputedProvider,
    useGridMutableProvider
} from '../base/Grid';
import { ColumnBase } from '../models/Column';
import { RowBase } from './Row';
import { RenderType } from '../base/enum';
import { isNullOrUndefined } from '@syncfusion/react-base';
import { getUid } from '../base/utils';

const CSS_EMPTY_ROW = 'e-emptyrow';
const CSS_DATA_ROW = 'e-row';
const CSS_LEFT_FREEZE = 'e-leftfreeze';

/**
 * RenderEmptyRow component displays when no data is available
 */
const RenderEmptyRow = memo(() => {
    const { serviceLocator, emptyRecordTemplate } = useGridComputedProvider();
    const localization = serviceLocator?.getService('localization');
    const { columnsDirective } = useGridMutableProvider();

    /**
     * Calculate the number of columns to span the empty message
     */
    const columnsLength = useMemo(() => {
        const children = (columnsDirective.props).children;
        return Children.count(children);
    }, [columnsDirective]);

    const rowRef = useRef(null);

    /**
     * Render the empty row template based on configuration
     */
    const renderEmptyTemplate = useMemo(() => {
        if (isNullOrUndefined(emptyRecordTemplate)) {
            return localization?.getConstant('EmptyRecord');
        } else if (typeof emptyRecordTemplate === 'string' || isValidElement(emptyRecordTemplate)) {
            return emptyRecordTemplate;
        } else {
            return emptyRecordTemplate();
        }
    }, [emptyRecordTemplate, localization]);

    return (
        <>
            {useMemo(() => (
                <RowBase
                    ref={rowRef}
                    key="empty-row"
                    row={{ index: 0, uid: 'empty-row-uid' }}
                    rowType={RenderType.Content}
                    role="row"
                    className={CSS_EMPTY_ROW}
                >
                    <ColumnBase
                        key="empty-row"
                        index={0}
                        customAttributes={{
                            className: CSS_LEFT_FREEZE,
                            style: { left: '0px' },
                            colSpan: columnsLength,
                            tabIndex: 0 // Make the empty cell focusable
                        }}
                        template={renderEmptyTemplate}
                    />
                </RowBase>
            ), [columnsLength, renderEmptyTemplate])}
        </>
    );
});

/**
 * Set display name for debugging purposes
 */
RenderEmptyRow.displayName = 'RenderEmptyRow';

/**
 * ContentRowsBase component renders the data rows within the table body section
 */
const ContentRowsBase = memo(forwardRef((_props, ref) => {
    const { columnsDirective, currentViewData } = useGridMutableProvider();

    // Refs for DOM elements and child components
    const contentSectionRef = useRef(null);
    const rowsObjectRef = useRef([]);

    /**
     * Returns the collection of content row elements
     */
    const getRows = useCallback(() => {
        return contentSectionRef.current?.children;
    }, [contentSectionRef.current?.children]);

    /**
     * Returns the row options objects with DOM element references
     */
    const getRowsObject = useCallback(() => rowsObjectRef.current, [rowsObjectRef.current]);

    /**
     * Gets a row by index.
     *
     * @param  {number} index - Specifies the row index.
     * @returns {Element} returns the element
     */
    const getRowByIndex = useCallback((index) => {
        return !isNullOrUndefined(index) ? getRows()[parseInt(index.toString(), 10)] : undefined;
    }, []);

    /**
     * @param {string} uid - Defines the uid
     * @hidden
     */
    const getRowObjectFromUID = useCallback((uid) => {
        const rows = getRowsObject();
        if (rows) {
            for (const row of rows) {
                if (row.uid === uid) {
                    return row;
                }
            }
        }
        return null;
    }, []);

    /**
     * Expose internal elements and methods through the forwarded ref
     * Only define properties specific to ContentRows
     */
    useImperativeHandle(ref, () => ({
        contentSectionRef: contentSectionRef.current,
        getRows,
        getRowsObject,
        getRowByIndex,
        getRowObjectFromUID,
        getCurrentViewRecords: () => currentViewData
    }), [getRows, getRowsObject, getRowByIndex, getRowObjectFromUID, currentViewData]);

    /**
     * Memoized empty row component to display when no data is available
     */
    const emptyRowComponent = useMemo(() => {
        if (!columnsDirective || !currentViewData || currentViewData.length === 0) {
            return <RenderEmptyRow />;
        }
        return null;
    }, [columnsDirective, currentViewData]);

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
     * Memoized data rows to prevent unnecessary re-renders
     */
    const dataRows = useMemo(() => {
        if (!columnsDirective || !currentViewData || currentViewData.length === 0) {
            rowsObjectRef.current = [];
            return [];
        }

        const rows = [];
        const rowOptions = [];

        for (let rowIndex = 0; rowIndex < currentViewData.length; rowIndex++) {
            const row = currentViewData[rowIndex];
            const options = {};
            options.uid = getUid('grid-row');
            options.data = row;
            options.index = rowIndex;
            options.isDataRow = true;

            // Store the options object for getRowsObject
            rowOptions.push({ ...options });

            // Create the row element with a callback ref to store the element reference
            rows.push(
                <RowBase
                    ref={(element) => {
                        if (element?.rowRef?.current) {
                            storeRowRef(rowIndex, element.rowRef.current, element.getCells());
                        }
                    }}
                    key={options.uid}
                    row={{ ...options }}
                    rowType={RenderType.Content}
                    className={CSS_DATA_ROW}
                    role="row"
                    aria-rowindex={rowIndex + 1}
                    data-uid={options.uid}
                >
                    {(columnsDirective.props).children}
                </RowBase>
            );
        }

        // Store the row options in the ref for access via getRowsObject
        rowsObjectRef.current = rowOptions;
        return rows;
    }, [columnsDirective, currentViewData, storeRowRef]);

    useEffect(() => {
        return () => {
            rowsObjectRef.current = [];
        };
    }, []);

    return (
        <tbody
            ref={contentSectionRef}
            {..._props}
        >
            {dataRows.length > 0 ? dataRows : emptyRowComponent}
        </tbody>
    );
}
));

/**
 * Set display name for debugging purposes
 */
ContentRowsBase.displayName = 'ContentRowsBase';

/**
 * Export the ContentRowsBase component for use in other components
 *
 * @internal
 */
export { ContentRowsBase };
