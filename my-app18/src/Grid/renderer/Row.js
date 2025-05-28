import React, {
  forwardRef,
  isValidElement,
  useImperativeHandle,
  useRef,
  Children,
  useEffect,
  ReactElement,
  useMemo,
  useCallback,
  memo,
  RefObject
} from 'react';
import {
  useGridComputedProvider,
  useGridMutableProvider
} from '../base/Grid';
import { ColumnBase } from '../models/Column';
import { CellType, RenderType } from '../base/enum';

// CSS class constants following enterprise naming convention
const CSS_HEADER_CELL = 'e-headercell';
const CSS_LAST_CELL = 'e-lastcell';
const CSS_ROW_CELL = 'e-rowcell';
// const CSS_FOCUS = 'e-focus';
// const CSS_FOCUSED = 'e-focused';

/**
* RowBase component renders a table row with cells based on provided column definitions
*/
const RowBase = memo(forwardRef((props, ref) => {
  const {
      rowType,
      row,
      children,
      ...attr
  } = props;

  // Get the focus strategy from the grid context
  const { headerRowDepth
    // , focusModule
  } = useGridMutableProvider();
  const { rowDataBound } = useGridComputedProvider();
  const rowRef = useRef(null);
  const cellsRef = useRef([]);

  /**
   * Returns the cell options objects
   *
   * @returns {ICell<ColumnModel>[]} Array of cell options objects
   */
  const getCells = useCallback(() => {
      return cellsRef.current;
  }, []);

  /**
   * Expose internal elements through the forwarded ref
   */
  useImperativeHandle(ref, () => ({
      rowRef: rowRef,
      getCells
  }), [getCells]);

  /**
   * Handle row data bound event for content rows
   */
  const handleRowDataBound = useCallback(() => {
      if (rowType === RenderType.Content && rowDataBound && rowRef.current) {
          rowDataBound({ row: rowRef.current });
      }
  }, [rowType, rowDataBound]);

  /**
   * Call rowDataBound callback after render
   */
  useEffect(() => {
      handleRowDataBound();

      // No cleanup needed as we're not setting up any subscriptions
  }, [handleRowDataBound]);

  /**
   * Process children to create column elements with proper props
   */
  const processedChildren = useMemo(() => {
      if (!children) {
          cellsRef.current = [];
          return null;
      }

      const childrenArray = Children.toArray(children);
      const cellOptions = [];
      const elements = [];

      for (let index = 0; index < childrenArray.length; index++) {
          const child = childrenArray[index];
          if (!isValidElement(child)) { continue; }

          // Determine cell class based on row type and position
          const cellClassName = rowType === RenderType.Header
              ? `${CSS_HEADER_CELL}${index === childrenArray.length - 1 ? ` ${CSS_LAST_CELL}` : ''}`
              : CSS_ROW_CELL;

          const cellType = rowType === RenderType.Header ? CellType.Header : CellType.Data;

          const colSpan = !child.props.field && child.props.headerText && (rowType === RenderType.Header &&
              (child.props.columns && child.props.columns.length) || (child.props.children &&
                  (child.props).children.length)) ? child.props.columns?.length ||
          (child.props).children.length : 1;
          const rowSpan = rowType !== RenderType.Header || (rowType === RenderType.Header &&
              ((child.props.columns && child.props.columns.length) || child.props.children)) ? 1 :
              headerRowDepth - row.index;

          const { ...cellAttributes } = child.props.customAttributes || {};

        //   // Get focus strategy methods from the grid context
        //   const { focusedCell } = focusModule;

        //   // Determine if this cell is currently focused
        //   const isFocused = focusedCell &&
        //       (rowType === RenderType.Header ? focusedCell.isHeader : !focusedCell.isHeader) &&
        //       focusedCell.colIndex === index &&
        //       focusedCell.rowIndex === row.index;

        //   // Determine focus classes - we'll add them here for initial render
        //   // The focus strategy will manage them dynamically after that
        //   const focusClasses = isFocused ? ` ${CSS_FOCUSED} ${CSS_FOCUS}` : '';

          // Determine if the cell is visible
          const isVisible = child.props.visible !== false; // Default to true if not specified

          // Create cell options object for getCells method
          const cellOpt = {
              visible: isVisible,
              isDataCell: rowType !== RenderType.Header, // false for header cells, true for data cells
              isTemplate: rowType === RenderType.Header
                  ? Boolean(child.props.headerTemplate)
                  : Boolean(child.props.template),
              rowID: row?.uid || '',
              column: {
                  customAttributes: {
                      ...cellAttributes,
                      className: `${cellClassName}${!isVisible ? ' e-hide' : ''}`,//${focusClasses}
                      role: rowType === RenderType.Header ? 'columnheader' : 'gridcell',
                      tabIndex: -1, //isFocused ? 0 : 
                      colSpan: colSpan,
                      rowSpan: rowSpan,
                      index: rowType !== RenderType.Header ? row.index : undefined,
                      'aria-colindex': index ? index + 1 : 1,
                      'aria-colspan': colSpan,
                      'aria-rowspan': rowSpan,
                      'aria-hidden': !isVisible ? 'true' : 'false'
                  },
                  index,
                  ...child.props
              },
              cellType,
              colSpan: colSpan,
              rowSpan: rowSpan,
              index,
              colIndex: index,
              className: `${cellClassName}${!isVisible ? ' e-hide' : ''}`
          };

          // Build column props
          const columnProps = {
              row,
              cell: cellOpt
              // ...child.props,
          };

          // Store cell options
          cellOptions.push(cellOpt);

          elements.push(
              <ColumnBase
                  key={`${child.props.field || 'col'}-${(rowType === RenderType.Header ? 'header-' : 'data-')
                      + row?.index}-${index}-${Math.random().toString(36).substr(2, 5)}`}
                  {...columnProps}
              />
          );
      }

      // Update the ref with cell options
      cellsRef.current = cellOptions;

      return elements;
  }, [children, row, rowType]);

  // // Determine row class based on row type
  // const rowClassName = `${rowType === RenderType.Header ? CSS_HEADER_ROW : CSS_DATA_ROW} ${CSS_ROW} ${className || ''}`.trim();

  return (
      <tr
          ref={rowRef}
          // className={rowClassName}
          {...attr}
      >
          {processedChildren}
      </tr>
  );
}
));

/**
* Set display name for debugging purposes
*/
RowBase.displayName = 'RowBase';

/**
* Export the RowBase component for use in other components
*
* @internal
*/
export { RowBase };
