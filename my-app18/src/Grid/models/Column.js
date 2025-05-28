// src/models/Column.tsx
import {
    useEffect,
    useRef,
    useMemo,
    useCallback,
    memo,
} from 'react';
import {
    useGridComputedProvider
} from '../base/Grid';
import {
    CellType
} from '../base/enum';
import { useColumn } from './useColumn';

// CSS class constants following enterprise naming convention
const CSS_HEADER_CELL_DIV = 'e-headercelldiv';
const CSS_HEADER_TEXT = 'e-headertext';
const CSS_RESIZER_HANDLER = 'e-rhandler';
const CSS_RESIZER_CURSOR = 'e-rcursor';
const CSS_RESIZER_SUPPRESS = 'e-rsuppress';

/**
 * ColumnBase component renders a table cell (th or td) with appropriate content
 */
const ColumnBase = memo((props) => {
    const grid = useGridComputedProvider();
    const { headerCellInfo, queryCellInfo } = grid;

    // Get column-specific APIs and properties
    const { publicAPI, privateAPI } = useColumn(props);

    const {
        cellType,
        visibleClass,
        alignHeaderClass,
        alignClass,
        formattedValue
    } = privateAPI;

    const { ...column } = publicAPI;

    const {
        index,
        field,
        allowResizing = grid.allowResizing,
        customAttributes
    } = column;

    const { className } = customAttributes;

    // Create ref for the cell element
    const cellRef = useRef({
        cellRef: useRef(null)
    });

    /**
     * Handle header cell info event
     */
    const handleHeaderCellInfo = useCallback(() => {
        if (headerCellInfo && cellRef.current?.cellRef.current) {
            headerCellInfo({ cell: cellRef.current.cellRef.current });
        }
    }, [headerCellInfo]);

    /**
     * Handle query cell info event
     */
    const handleQueryCellInfo = useCallback(() => {
        if (queryCellInfo && cellRef.current?.cellRef.current) {
            queryCellInfo({ cell: cellRef.current.cellRef.current });
        }
    }, [queryCellInfo]);

    /**
     * Trigger appropriate cell info events based on cell type
     */
    useEffect(() => {
        if (cellType === CellType.Header) {
            handleHeaderCellInfo();
        } else {
            handleQueryCellInfo();
        }

        // No cleanup needed as we're not setting up any subscriptions
    }, [cellType, handleHeaderCellInfo, handleQueryCellInfo]);

    /**
     * Memoized header cell content
     */
    const headerCellContent = useMemo(() => {
        if (cellType !== CellType.Header) { return null; }
        const combinedClassName = `${className} ${alignHeaderClass} ${visibleClass || ''}`.trim();

        // Use the className from customAttributes which includes focus classes
        const finalClassName = `${combinedClassName} ${customAttributes.className}`.trim();

        return (
            <th
                ref={cellRef.current.cellRef}
                {...customAttributes}
                className={finalClassName}
            >
                <div className={CSS_HEADER_CELL_DIV} e-mappinguid={props.cell.column.uid} key={`header-cell-${props.cell?.column?.uid}`}>
                    <span className={CSS_HEADER_TEXT}>{formattedValue || field}</span>
                </div>
                {allowResizing ? (
                    <div className={`${CSS_RESIZER_HANDLER} ${CSS_RESIZER_CURSOR}`} style={{ height: '100%' }}></div>
                ) : grid.allowResizing && (
                    <div className={CSS_RESIZER_SUPPRESS} style={{ height: '100%' }}></div>
                )}
            </th>
        );
    }, [
        cellType,
        index,
        customAttributes,
        className,
        alignHeaderClass,
        visibleClass,
        formattedValue,
        field,
        allowResizing,
        props.row?.index
    ]);

    /**
     * Memoized data cell content
     */
    const dataCellContent = useMemo(() => {
        if (cellType !== CellType.Data) { return null; }

        const combinedClassName = `${className} ${alignClass} ${visibleClass || ''}`.trim();

        // Use the className from customAttributes which includes focus classes
        const finalClassName = `${combinedClassName} ${customAttributes.className}`.trim();

        return (
            <td
                ref={cellRef.current.cellRef}
                {...customAttributes}
                className={finalClassName}
            >
                {formattedValue}
            </td>
        );
    }, [
        cellType,
        customAttributes,
        className,
        alignClass,
        visibleClass,
        formattedValue,
        index,
        props.row?.index
    ]);

    // Return the appropriate cell content based on cell type
    return cellType === CellType.Header ? headerCellContent : dataCellContent;
}
);

/**
 * Set display name for debugging purposes
 */
ColumnBase.displayName = 'ColumnBase';

/**
 * Column component for declarative usage in user code
 *
 * @component
 * @example
 * ```tsx
 * <Column field="name" headerText="Name" />
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Column = (_props) => {
    return null;
};

// /**
//  * Set display name for debugging purposes
//  */
// Column.displayName = 'Column';

/**
 * Export the ColumnBase component for internal use
 *
 * @internal
 */
export { ColumnBase };
