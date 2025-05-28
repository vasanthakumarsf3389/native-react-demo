// import { useState, useCallback, useMemo, useRef } from 'react';
// import { addClass, removeClass } from '@syncfusion/react-base';

// /**
//  * Custom hook for focus strategy management
//  */
// export const useFocusStrategy = (
//     headerRowCount,
//     contentRowCount,
//     columns,
//     gridRef,
//     callbacks = {}
// ) => {
//     const [focusedCell, setFocusedCell] = useState({
//         rowIndex: -1,
//         colIndex: -1,
//         isHeader: false,
//         element: null,
//         elementToFocus: null,
//         uid: null,
//         skipAction: false,
//         outline: false
//     });
    
//     const [isGridFocused, setIsGridFocused] = useState(false);
//     const [activeMatrix, setActiveMatrix] = useState(true); // true for content, false for header
    
//     const prevIndexes = useRef({ rowIndex: -1, cellIndex: -1 });
    
//     // Create focus matrices for header and content
//     const headerMatrix = useMemo(() => createFocusMatrix(headerRowCount, columns?.length || 0), [headerRowCount, columns]);
//     const contentMatrix = useMemo(() => createFocusMatrix(contentRowCount, columns?.length || 0), [contentRowCount, columns]);
    
//     const firstFocusableActiveCellIndex = useMemo(() => [0, 0], []);
//     const lastFocusableActiveCellIndex = useMemo(() => [
//         contentRowCount - 1,
//         (columns?.length || 1) - 1
//     ], [contentRowCount, columns]);

//     /**
//      * Create a focus matrix
//      */
//     function createFocusMatrix(rows, cols) {
//         const matrix = [];
//         for (let i = 0; i < rows; i++) {
//             matrix[i] = [];
//             for (let j = 0; j < cols; j++) {
//                 matrix[i][j] = 1; // 1 means focusable
//             }
//         }
//         return {
//             matrix,
//             current: [-1, -1],
//             columns: cols,
//             rows,
//             set: (rowIndex, columnIndex, allow = true) => {
//                 if (matrix[rowIndex] && matrix[rowIndex][columnIndex] !== undefined) {
//                     matrix[rowIndex][columnIndex] = allow ? 1 : 0;
//                 }
//             },
//             get: (rowIndex, columnIndex, navigator, action, validator, active) => {
//                 // Simple navigation logic
//                 let newRow = rowIndex;
//                 let newCol = columnIndex;
                
//                 if (navigator[0] !== 0) newRow += navigator[0];
//                 if (navigator[1] !== 0) newCol += navigator[1];
                
//                 // Boundary checks
//                 if (newRow < 0) newRow = 0;
//                 if (newRow >= rows) newRow = rows - 1;
//                 if (newCol < 0) newCol = 0;
//                 if (newCol >= cols) newCol = cols - 1;
                
//                 return [newRow, newCol];
//             },
//             select: (rowIndex, columnIndex) => {
//                 matrix.current = [rowIndex, columnIndex];
//             },
//             generate: (rowsData, selector, isRowTemplate) => {
//                 return matrix;
//             },
//             inValid: (value) => value === 0 || value === undefined,
//             first: (vector, index, navigator, moveTo, action) => {
//                 return 0;
//             },
//             findCellIndex: (checkCellIndex, next) => {
//                 return checkCellIndex;
//             }
//         };
//     }

//     /**
//      * Get the active matrix (header or content)
//      */
//     const getActiveMatrix = useCallback(() => {
//         return activeMatrix ? contentMatrix : headerMatrix;
//     }, [activeMatrix, contentMatrix, headerMatrix]);

//     /**
//      * Set the active matrix
//      */
//     const setActiveMatrixState = useCallback((isContent) => {
//         setActiveMatrix(isContent);
//     }, []);

//     /**
//      * Focus a cell
//      */
//     const focus = useCallback((e) => {
//         const matrix = getActiveMatrix();
//         const [rowIndex, colIndex] = matrix.current;
        
//         if (rowIndex >= 0 && colIndex >= 0) {
//             const cellElement = getCellElement(rowIndex, colIndex, !activeMatrix);
//             if (cellElement) {
//                 cellElement.focus();
//                 setFocusedCell({
//                     rowIndex,
//                     colIndex,
//                     isHeader: !activeMatrix,
//                     element: cellElement,
//                     elementToFocus: cellElement,
//                     uid: cellElement.getAttribute('data-uid'),
//                     skipAction: false,
//                     outline: true
//                 });
//             }
//         }
//     }, [getActiveMatrix, activeMatrix]);

//     /**
//      * Remove focus
//      */
//     const removeFocus = useCallback(() => {
//         if (focusedCell.element) {
//             removeClass([focusedCell.element], ['e-focused', 'e-focus']);
//             focusedCell.element.tabIndex = -1;
//         }
//         setFocusedCell({
//             rowIndex: -1,
//             colIndex: -1,
//             isHeader: false,
//             element: null,
//             elementToFocus: null,
//             uid: null,
//             skipAction: false,
//             outline: false
//         });
//     }, [focusedCell]);

//     /**
//      * Add focus to a cell
//      */
//     const addFocus = useCallback((info, e) => {
//         const cellElement = info.element || getCellElement(info.rowIndex, info.colIndex, info.isHeader);
//         if (cellElement) {
//             addClass([cellElement], ['e-focused']);
//             if (info.outline) {
//                 addClass([cellElement], ['e-focus']);
//             }
//             cellElement.tabIndex = 0;
//             setFocusedCell({
//                 ...info,
//                 element: cellElement,
//                 elementToFocus: cellElement
//             });
            
//             if (callbacks.onCellFocus) {
//                 callbacks.onCellFocus({
//                     rowIndex: info.rowIndex,
//                     colIndex: info.colIndex,
//                     element: cellElement,
//                     isHeader: info.isHeader
//                 });
//             }
//         }
//     }, [callbacks]);

//     /**
//      * Get focus info
//      */
//     const getFocusInfo = useCallback(() => {
//         return focusedCell;
//     }, [focusedCell]);

//     /**
//      * Set first focusable tab index
//      */
//     const setFirstFocusableTabIndex = useCallback(() => {
//         const firstCell = getCellElement(0, 0, false); // First content cell
//         if (firstCell) {
//             firstCell.tabIndex = 0;
//         }
//     }, []);

//     /**
//      * Focus content area
//      */
//     const focusContent = useCallback(() => {
//         setActiveMatrix(true);
//         const firstContentCell = getCellElement(0, 0, false);
//         if (firstContentCell) {
//             addFocus({
//                 rowIndex: 0,
//                 colIndex: 0,
//                 isHeader: false,
//                 outline: true
//             });
//         }
//     }, [addFocus]);

//     /**
//      * Add outline to focused cell
//      */
//     const addOutline = useCallback(() => {
//         if (focusedCell.element) {
//             addClass([focusedCell.element], ['e-focus']);
//         }
//     }, [focusedCell]);

//     /**
//      * Clear focus indicator
//      */
//     const clearIndicator = useCallback(() => {
//         if (focusedCell.element) {
//             removeClass([focusedCell.element], ['e-focused', 'e-focus']);
//         }
//     }, [focusedCell]);

//     /**
//      * Handle key down events
//      */
//     const handleKeyDown = useCallback((event) => {
//         if (!isNavigationKey(event)) return;

//         event.preventDefault();
//         const direction = getNavigationDirection(event);
//         navigateToNextCell(direction);
//     }, []);

//     /**
//      * Handle grid click events
//      */
//     const handleGridClick = useCallback((event) => {
//         const target = event.target;
//         const cell = target.closest('td, th');
        
//         if (cell) {
//             const row = cell.closest('tr');
//             const isHeaderCell = cell.tagName === 'TH';
//             const rowIndex = Array.from(row.parentElement.children).indexOf(row);
//             const colIndex = Array.from(row.children).indexOf(cell);
            
//             addFocus({
//                 rowIndex,
//                 colIndex,
//                 isHeader: isHeaderCell,
//                 element: cell,
//                 outline: true
//             });
            
//             if (callbacks.onCellClick) {
//                 callbacks.onCellClick({
//                     rowIndex,
//                     colIndex,
//                     element: cell,
//                     isHeader: isHeaderCell
//                 });
//             }
//         }
//     }, [addFocus, callbacks]);

//     /**
//      * Navigate to a specific cell
//      */
//     const navigateToCell = useCallback((rowIndex, colIndex, toHeader = false) => {
//         const cellElement = getCellElement(rowIndex, colIndex, toHeader);
//         if (cellElement) {
//             addFocus({
//                 rowIndex,
//                 colIndex,
//                 isHeader: toHeader,
//                 element: cellElement,
//                 outline: true
//             });
//         }
//     }, [addFocus]);

//     /**
//      * Navigate to next cell based on direction
//      */
//     const navigateToNextCell = useCallback((direction) => {
//         const matrix = getActiveMatrix();
//         const current = focusedCell;
//         let navigator = [0, 0];
        
//         switch (direction) {
//             case 'up':
//                 navigator = [-1, 0];
//                 break;
//             case 'down':
//                 navigator = [1, 0];
//                 break;
//             case 'left':
//                 navigator = [0, -1];
//                 break;
//             case 'right':
//                 navigator = [0, 1];
//                 break;
//         }
        
//         const [newRow, newCol] = matrix.get(current.rowIndex, current.colIndex, navigator);
//         navigateToCell(newRow, newCol, current.isHeader);
//     }, [getActiveMatrix, focusedCell, navigateToCell]);

//     /**
//      * Navigate to first cell
//      */
//     const navigateToFirstCell = useCallback(() => {
//         navigateToCell(0, 0, false);
//     }, [navigateToCell]);

//     /**
//      * Navigate to last cell
//      */
//     const navigateToLastCell = useCallback(() => {
//         const lastRow = contentRowCount - 1;
//         const lastCol = (columns?.length || 1) - 1;
//         navigateToCell(lastRow, lastCol, false);
//     }, [navigateToCell, contentRowCount, columns]);

//     /**
//      * Check if key is a navigation key
//      */
//     const isNavigationKey = useCallback((event) => {
//         const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
//         return keys.includes(event.key);
//     }, []);

//     /**
//      * Get navigation direction from key event
//      */
//     const getNavigationDirection = useCallback((event) => {
//         switch (event.key) {
//             case 'ArrowUp':
//                 return 'up';
//             case 'ArrowDown':
//                 return 'down';
//             case 'ArrowLeft':
//                 return 'left';
//             case 'ArrowRight':
//                 return 'right';
//             case 'Tab':
//                 return event.shiftKey ? 'prevCell' : 'nextCell';
//             case 'Enter':
//                 return 'down';
//             default:
//                 return '';
//         }
//     }, []);

//     /**
//      * Get cell element by coordinates
//      */
//     const getCellElement = useCallback((rowIndex, colIndex, isHeader) => {
//         if (!gridRef.current?.element) return null;
        
//         const selector = isHeader 
//             ? `thead tr:nth-child(${rowIndex + 1}) th:nth-child(${colIndex + 1})`
//             : `tbody tr:nth-child(${rowIndex + 1}) td:nth-child(${colIndex + 1})`;
            
//         return gridRef.current.element.querySelector(selector);
//     }, [gridRef]);

//     return {
//         // State
//         focusedCell,
//         isGridFocused,
//         setGridFocus: setIsGridFocused,
        
//         // Matrix access
//         contentMatrix,
//         headerMatrix,
//         getActiveMatrix,
//         setActiveMatrix: setActiveMatrixState,
        
//         // Focus methods
//         focus,
//         removeFocus,
//         addFocus,
//         getFocusInfo,
//         setFirstFocusableTabIndex,
//         focusContent,
//         addOutline,
//         clearIndicator,
        
//         // Event handlers
//         handleKeyDown,
//         handleGridClick,
        
//         // Navigation methods
//         navigateToCell,
//         navigateToNextCell,
//         navigateToFirstCell,
//         navigateToLastCell,
        
//         // Utility methods
//         isNavigationKey,
//         getNavigationDirection,
        
//         // Previous state tracking
//         prevIndexes,
        
//         // Boundary indices
//         firstFocusableActiveCellIndex,
//         lastFocusableActiveCellIndex
//     };
// };

import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { CellType } from '../base/enum';
// CSS class constants
const CSS_FOCUSED = 'e-focused';
const CSS_FOCUS = 'e-focus';
/**
 * IFocusMatrix class for tracking focusable cells
 *
 * @returns {IFocusMatrix} An object with methods for managing a matrix of focusable cells
 */
export const createMatrix = () => {
    const matrix = [];
    let current = [];
    let columns = 0;
    let rows = 0;
    /**
     * Sets a cell's focusable state in the matrix
     *
     * @param {number} rowIndex - Row index of the cell
     * @param {number} columnIndex - Column index of the cell
     * @param {boolean} [allow] - Whether the cell is focusable
     * @returns {void}
     */
    const set = (rowIndex, columnIndex, allow) => {
        // Ensure indices are within bounds
        rowIndex = Math.max(0, Math.min(rowIndex, rows));
        columnIndex = Math.max(0, Math.min(columnIndex, columns));
        // Ensure the row array exists
        matrix[rowIndex] = matrix[rowIndex] || [];
        // Set the cell value
        matrix[rowIndex][columnIndex] = allow ? 1 : 0;
    };
    /**
     * Checks if a cell value is invalid (0 or undefined)
     *
     * @param {number} value - Cell value to check
     * @returns {boolean} Whether the value is invalid
     */
    const inValid = (value) => {
        return value === 0 || value === undefined;
    };
    /**
     * Finds the first valid cell in a vector
     *
     * @param {number[]} vector - Array of cell values
     * @param {number} index - Starting index
     * @param {number[]} navigator - Navigation direction
     * @param {boolean} [moveTo] - Whether to move to the first cell
     * @param {string} [action] - Navigation action
     * @returns {number|null} Index of the first valid cell or null if none found
     */
    const first = (vector, index, navigator, moveTo, action) => {
        // Check if we're out of bounds or if there are no valid cells, visible state change helping codes
        if (((index < 0 || index === vector.length) && inValid(vector[index])
            && (action !== 'upArrow' && action !== 'downArrow')) || !vector.some((v) => v === 1)) {
            return null;
        }
        // If current cell is valid, return its index
        if (!inValid(vector[index])) {
            return index;
        }
        // Otherwise, recursively find the next valid cell
        const nextIndex = (['upArrow', 'downArrow', 'shiftUp', 'shiftDown', 'enter', 'shiftEnter'].indexOf(action) !== -1) ?
            (moveTo ? 0 : ++index) : index + navigator[1];
        return first(vector, nextIndex, navigator, false, action);
    };
    /**
     * Finds the next or previous valid cell index in the matrix
     *
     * @param {number[]} checkCellIndex - Current cell index
     * @param {boolean} next - Whether to find next (true) or previous (false) cell
     * @returns {number[]} Next or previous valid cell index
     */
    const findCellIndex = (checkCellIndex, next) => {
        const cellIndex = [...checkCellIndex]; // Create a copy to avoid modifying the original
        let currentCellIndexPass = false;
        if (next) {
            // Find next valid cell
            for (let i = cellIndex[0]; i < matrix.length; i++) {
                const rowCell = matrix[i];
                for (let j = 0; rowCell && j < rowCell.length; j++) {
                    if (currentCellIndexPass && matrix[i][j] === 1) {
                        return [i, j];
                    }
                    if (!currentCellIndexPass && i === cellIndex[0] && j === cellIndex[1]) {
                        currentCellIndexPass = true;
                    }
                }
            }
        }
        else {
            // Find previous valid cell
            for (let i = cellIndex[0]; i >= 0; i--) {
                const rowCell = matrix[i];
                for (let j = rowCell.length - 1; rowCell && j >= 0; j--) {
                    if (currentCellIndexPass && matrix[i][j] === 1) {
                        return [i, j];
                    }
                    if (!currentCellIndexPass && i === cellIndex[0] && j === cellIndex[1]) {
                        currentCellIndexPass = true;
                    }
                }
            }
        }
        return cellIndex;
    };
    /**
     * Gets the next valid cell based on navigation parameters
     *
     * @param {number} rowIndex - Current row index
     * @param {number} columnIndex - Current column index
     * @param {number[]} navigator - Navigation direction
     * @param {string} [action] - Navigation action
     * @param {Function} [validator] - Function to validate cell
     * @param {Object} [active] - Active matrix info
     * @returns {number[]} Next valid cell coordinates
     */
    //  * @param {Function} [getRowsFromIndex] - Function to get rows from index
    const get = (rowIndex, columnIndex, navigator, action, validator, 
    // getRowsFromIndex?: Function,
    active) => {
        const tmp = columnIndex;
        // Check if we're trying to navigate before the first row
        if (rowIndex + navigator[0] < 0) {
            return [rowIndex, columnIndex];
        }
        // Calculate new row index within bounds
        rowIndex = Math.max(0, Math.min(rowIndex + navigator[0], rows));
        // Check if row exists
        if (!matrix[rowIndex]) {
            return null;
        }
        // Calculate new column index within bounds
        columnIndex = Math.max(0, Math.min(columnIndex + navigator[1], matrix[rowIndex].length - 1));
        // Check if we're trying to navigate past the last column
        if (tmp + navigator[1] > matrix[rowIndex].length - 1 && validator(rowIndex, columnIndex, action)) {
            return [rowIndex, tmp];
        }
        // Find first valid cell in the row
        const firstIndex = first(matrix[rowIndex], columnIndex, navigator, true, action);
        columnIndex = firstIndex === null ? tmp : firstIndex;
        const val = matrix[rowIndex]?.[columnIndex];
        // Special handling for down arrow or enter at the last row
        if (rowIndex === rows && (action === 'downArrow' || action === 'enter')) {
            navigator[0] = -1;
        }
        // // Check if cell is visible
        // let cell: Element;
        // if (active && getRowsFromIndex) {
        //     const rows: HTMLCollectionOf<HTMLTableRowElement> = getRowsFromIndex(rowIndex, active);
        //     cell = rows?.[rowIndex as number]?.cells?.[columnIndex as number];
        // }
        // // If cell is not visible, find next visible cell
        // if (cell && (cell as HTMLElement).getBoundingClientRect().width === 0) {
        //     const current: number[] = nextVisibleCellFocus(
        //         rowIndex,
        //         columnIndex,
        //         action,
        //         navigator,
        //         active,
        //         tmp,
        //         matrix,
        //         getRowsFromIndex
        //     );
        //     rowIndex = current[0];
        //     columnIndex = current[1];
        // }
        // // Handle empty table case
        // if (firstIndex === null) {
        //     let emptyTable: boolean = true;
        //     for (let i: number = 0; i < rows; i++) {
        //         if (matrix[i as number]?.some((v: number) => v === 1)) {
        //             emptyTable = false;
        //             break;
        //         }
        //     }
        //     if (emptyTable) {
        //         rowIndex = current?.length ? current[0] : 0;
        //         return [rowIndex, columnIndex];
        //     }
        // }
        // Recursively find valid cell if current is invalid
        return inValid(val) || !validator(rowIndex, columnIndex, action) ?
            get(rowIndex, tmp, navigator, action, validator, 
            // getRowsFromIndex,
            active) : [rowIndex, columnIndex];
    };
    /**
     * Selects a cell in the matrix
     *
     * @param {number} rowIndex - Row index to select
     * @param {number} columnIndex - Column index to select
     * @returns {void}
     */
    const select = (rowIndex, columnIndex) => {
        rowIndex = Math.max(0, Math.min(rowIndex, rows));
        columnIndex = Math.max(0, Math.min(columnIndex, matrix[rowIndex]?.length - 1 || 0));
        // Create a new array instead of modifying the existing one
        current = [rowIndex, columnIndex];
        // // Ensure the cell is valid in the matrix
        // if (!matrix[rowIndex as number]) {
        //     matrix[rowIndex as number] = [];
        // }
        if (!matrix?.[rowIndex]?.[columnIndex]) {
            matrix[rowIndex][columnIndex] = 1;
        }
    };
    /**
     * Generates a matrix from row data
     *
     * @param {Array<IRow<ColumnModel>>} rowsData - Array of row data
     * @param {Function} selector - Function to determine if a cell is focusable
     * @param {boolean} [isRowTemplate] - Whether the row is a template
     * @returns {Array<Array<number>>} The generated matrix
     */
    const generate = (rowsData, selector, isRowTemplate) => {
        // rowsData = rowsData;
        // Update the rows count BEFORE generating the matrix
        rows = rowsData.length - 1;
        // Clear existing matrix
        matrix.length = 0;
        for (let i = 0; i < rowsData.length && Array.isArray(rowsData[i]?.cells); i++) {
            const cells = rowsData[i]?.cells?.filter((c) => c.isSpanned !== true);
            // Update columns count
            columns = Math.max(cells.length - 1, columns || 0);
            let incrementNumber = 0;
            for (let j = 0; j < cells.length; j++) {
                // if (cells[j as number]?.column?.columns) {
                //     incrementNumber = columnsCount(cells[j as number].column.columns, incrementNumber);
                // } else {
                incrementNumber++;
                // }
                // Set cell focusability
                set(i, j, rowsData[i].visible === false ?
                    false : selector(rowsData[i], cells[j], isRowTemplate));
            }
            columns = Math.max(incrementNumber - 1, columns || 0);
        }
        return matrix;
    };
    // /**
    //  * Counts columns in nested column structure
    //  *
    //  * @param {ColumnModel[]} rowColumns - Array of column definitions
    //  * @param {number} currentColumnCount - Current column count
    //  * @returns {number} Total column count
    //  */
    // const columnsCount: (rowColumns: ColumnModel[], currentColumnCount: number) => number =
    // (rowColumns: ColumnModel[], currentColumnCount: number): number => {
    //     const columns: ColumnModel[] = rowColumns;
    //     let incrementNumber: number = currentColumnCount;
    //     for (let i: number = 0; i < columns?.length; i++) {
    //         if (columns[i as number]?.columns) {
    //             incrementNumber = columnsCount(columns[i as number].columns, incrementNumber);
    //         } else {
    //             incrementNumber++;
    //         }
    //     }
    //     return incrementNumber;
    // };
    // /**
    //  * Finds the next visible cell for focus
    //  *
    //  * @param {number} rowIndex - Current row index
    //  * @param {number} columnIndex - Current column index
    //  * @param {string} action - Navigation action
    //  * @param {Array<number>} navigator - Navigation direction
    //  * @param {Object} active - Active matrix info
    //  * @param {number} tmp - Original column index
    //  * @param {Array<Array<number>>} matrix - Matrix to navigate
    //  * @param {Function} getRowsFromIndex - Function to get rows from index
    //  * @returns {Array<number>} Next visible cell coordinates
    //  */
    // const nextVisibleCellFocus: (
    //     rowIndex: number,
    //     columnIndex: number,
    //     action: string,
    //     navigator: number[],
    //     active: Object,
    //     tmp: number,
    //     matrix: number[][],
    //     getRowsFromIndex: Function
    // ) => number[] = (
    //     rowIndex: number,
    //     columnIndex: number,
    //     action: string,
    //     navigator: number[],
    //     active: Object,
    //     tmp: number,
    //     matrix: number[][],
    //     getRowsFromIndex: Function
    // ): number[] => {
    //     let rows: IRow<ColumnModel>[] = getRowsFromIndex(rowIndex, active);
    //     let cell: ICell<ColumnModel> = rows?.[rowIndex as number]?.cells?.[columnIndex as number];
    //     const rowMatrix: number[][] = matrix;
    //     const maxRow: number = rowMatrix.length - 1;
    //     const isTab: boolean = action === 'tab';
    //     const isShiftTab: boolean = action === 'shiftTab';
    //     const skipAction: boolean = action === 'enter' || action === 'shiftEnter' || action === 'downArrow' || action === 'upArrow';
    //     if (skipAction) {
    //         return [rowIndex, columnIndex];
    //     }
    //     while (cell && (cell as HTMLElement).getBoundingClientRect().width === 0) {
    //         if ((isTab && rowIndex === maxRow && columnIndex === rowMatrix[rowIndex as number].lastIndexOf(1)) ||
    //             (isShiftTab && rowIndex === 0 && columnIndex === rowMatrix[rowIndex as number].indexOf(1))) {
    //             columnIndex = tmp;
    //             return [rowIndex, columnIndex];
    //         }
    //         if (isTab) {
    //             if (columnIndex === rowMatrix[rowIndex as number].lastIndexOf(1)) {
    //                 rowIndex++;
    //                 columnIndex = rowMatrix[rowIndex as number].indexOf(1);
    //                 columnIndex = first(matrix[rowIndex as number], columnIndex, navigator, true, action);
    //                 rows = getRowsFromIndex(rowIndex, active);
    //             } else {
    //                 columnIndex++;
    //                 columnIndex = first(matrix[rowIndex as number], columnIndex, navigator, true, action);
    //             }
    //         } else if (isShiftTab) {
    //             if (columnIndex === rowMatrix[rowIndex as number].indexOf(1)) {
    //                 rowIndex--;
    //                 columnIndex = rowMatrix[rowIndex as number].lastIndexOf(1);
    //                 columnIndex = first(matrix[rowIndex as number], columnIndex, navigator, true, action);
    //                 rows = getRowsFromIndex(rowIndex, active);
    //             } else {
    //                 columnIndex--;
    //                 columnIndex = first(matrix[rowIndex as number], columnIndex, navigator, true, action);
    //             }
    //         } else if ((action === 'rightArrow' || action === 'shiftRight')) {
    //             if (columnIndex === rowMatrix[rowIndex as number].lastIndexOf(1)) {
    //                 columnIndex = tmp;
    //             } else {
    //                 columnIndex++;
    //                 columnIndex = first(matrix[rowIndex as number], columnIndex, navigator, true, action);
    //             }
    //         } else if ((action === 'leftArrow' || action === 'shiftLeft')) {
    //             if (columnIndex === rowMatrix[rowIndex as number].indexOf(1)) {
    //                 columnIndex = tmp;
    //             } else {
    //                 columnIndex--;
    //                 columnIndex = first(matrix[rowIndex as number], columnIndex, navigator, true, action);
    //             }
    //         } else if (action === null) {
    //             columnIndex++;
    //             columnIndex = first(matrix[rowIndex as number], columnIndex, navigator, true, action);
    //         }
    //         cell = rows?.[rowIndex as number]?.cells?.[columnIndex as number];
    //     }
    //     return [rowIndex, columnIndex];
    // };
    return {
        matrix,
        current,
        get columns() { return columns; },
        set columns(value) { columns = value; },
        get rows() { return rows; },
        set rows(value) { rows = value; },
        set,
        get,
        select,
        generate,
        // columnsCount,
        inValid,
        first,
        // nextVisibleCellFocus,
        findCellIndex
    };
};
/**
 * Enum for keyboard navigation keys
 */
export var KeyboardKeys;
(function (KeyboardKeys) {
    KeyboardKeys["UP"] = "ArrowUp";
    KeyboardKeys["DOWN"] = "ArrowDown";
    KeyboardKeys["LEFT"] = "ArrowLeft";
    KeyboardKeys["RIGHT"] = "ArrowRight";
    KeyboardKeys["TAB"] = "Tab";
    KeyboardKeys["HOME"] = "Home";
    KeyboardKeys["END"] = "End";
    KeyboardKeys["ENTER"] = "Enter";
    KeyboardKeys["SPACE"] = " ";
    KeyboardKeys["ESCAPE"] = "Escape";
    KeyboardKeys["ALT_J"] = "j";
    KeyboardKeys["ALT_W"] = "w";
    KeyboardKeys["PAGE_UP"] = "PageUp";
    KeyboardKeys["PAGE_DOWN"] = "PageDown";
    KeyboardKeys["F2"] = "F2";
    KeyboardKeys["DELETE"] = "Delete";
    KeyboardKeys["CTRL_HOME"] = "Home";
    KeyboardKeys["CTRL_END"] = "End";
})(KeyboardKeys || (KeyboardKeys = {}));
/**
 * Custom hook for managing focus strategy in grid
 * Implements matrix-based navigation similar to the original class implementation
 *
 * @param {number} headerRowCount - Number of header rows
 * @param {number} contentRowCount - Number of content rows
 * @param {ColumnModel} columns - columns state
 * @param {RefObject<GridRef>} gridRef - Reference to the grid
 * @param {FocusStrategyCallbacks} callbacks - Optional callbacks for focus events
 * @returns {FocusStrategyResult} Focus strategy methods and state
 */
export const useFocusStrategy = (headerRowCount, contentRowCount, columns, gridRef, callbacks) => {
    // Create content and header matrices
    const contentMatrix = useRef(createMatrix());
    const headerMatrix = useRef(createMatrix());
    // State for tracking focused cell - single source of truth
    const focusedCell = useRef({
        rowIndex: -1,
        colIndex: -1,
        isHeader: false,
        skipAction: false,
        outline: true
    });
    // State for tracking grid focus
    const [isGridFocused, setIsGridFocused] = useState(false);
    // Ref for swap info
    const swapInfo = useRef({
        swap: false,
        toHeader: false
    });
    // Ref for active matrix
    const activeMatrix = useRef('content');
    // Ref for previous indexes
    const prevIndexes = useRef({});
    // Key action mappings
    const keyActions = useRef({
        'rightArrow': [0, 1],
        'tab': [0, 1],
        'leftArrow': [0, -1],
        'shiftTab': [0, -1],
        'upArrow': [-1, 0],
        'downArrow': [1, 0],
        'shiftUp': [-1, 0],
        'shiftDown': [1, 0],
        'shiftRight': [0, 1],
        'shiftLeft': [0, -1],
        'enter': [1, 0],
        'shiftEnter': [-1, 0]
    });
    // Key indexes by action
    const indexesByKey = useCallback((action) => {
        const matrix = activeMatrix.current === 'content' ? contentMatrix.current :
            headerMatrix.current;
        const opt = {
            'home': [matrix.current[0], -1, 0, 1],
            'end': [matrix.current[0], matrix.columns + 1, 0, -1],
            'ctrlHome': [0, -1, 0, 1],
            'ctrlEnd': [matrix.rows, matrix.columns + 1, 0, -1]
        };
        return opt[action] || null;
    }, []);
    /**
     * Get the active matrix
     *
     * @returns {IFocusMatrix} The active matrix
     */
    const getActiveMatrix = useCallback(() => {
        return activeMatrix.current === 'content' ? contentMatrix.current : headerMatrix.current;
    }, []);
    /**
     * Set the active matrix
     *
     * @param {boolean} isContent - Whether to set content matrix as active
     * @returns {void}
     */
    const setActiveMatrix = useCallback((isContent) => {
        activeMatrix.current = isContent ? 'content' : 'header';
    }, []);
    const firstFocusableHeaderCellIndex = useMemo(() => {
        const matrix = headerMatrix.current;
        return matrix.matrix?.[0]?.[0] === 1 ? [0, 0] : matrix.findCellIndex([0, 0], true);
    }, [activeMatrix.current, headerMatrix.current, columns]);
    const lastFocusableHeaderCellIndex = useMemo(() => {
        const matrix = headerMatrix.current;
        return matrix.matrix?.[matrix.rows]?.[matrix.columns] === 1 ? [matrix.rows, matrix.columns] :
            matrix.findCellIndex([matrix.rows, matrix.columns], matrix.matrix?.[matrix.rows]?.[matrix.columns] !== 0);
    }, [activeMatrix.current, headerMatrix.current, columns]);
    // Future enhancement may require.
    // const firstFocusableContentCellIndex: number[] = useMemo(() => {
    //     const matrix: IFocusMatrix = contentMatrix.current;
    //     return matrix.matrix?.[0]?.[0] === 1 ? [0, 0] : matrix.findCellIndex([0, 0], true);
    // }, [contentMatrix.current, columns]);
    // const lastFocusableContentCellIndex: number[] = useMemo(() => {
    //     const matrix: IFocusMatrix = contentMatrix.current;
    //     return matrix.matrix?.[matrix.rows]?.[matrix.columns] === 1 ? [matrix.rows, matrix.columns] :
    //         matrix.findCellIndex([matrix.rows, matrix.columns], matrix.matrix?.[matrix.rows]?.[matrix.columns] !== 0);
    // }, [contentMatrix.current, columns]);
    const firstFocusableActiveCellIndex = useMemo(() => {
        const matrix = getActiveMatrix();
        return matrix.matrix?.[0]?.[0] === 1 ? [0, 0] : matrix.findCellIndex([0, 0], true);
    }, [activeMatrix.current, columns]);
    const lastFocusableActiveCellIndex = useMemo(() => {
        const matrix = getActiveMatrix();
        return matrix.matrix?.[matrix.rows]?.[matrix.columns] === 1 ? [matrix.rows, matrix.columns] :
            matrix.findCellIndex([matrix.rows, matrix.columns], matrix.matrix?.[matrix.rows]?.[matrix.columns] !== 0);
    }, [activeMatrix.current, columns]);
    // /**
    //  * Get rows from index
    //  *
    //  * @param {number} rowIndex - Row index
    //  * @param {boolean} isContent - Whether to get content rows
    //  * @returns {HTMLTableRowElement|HTMLCollectionOf<HTMLTableRowElement>} Table rows
    //  */
    // const getRowsFromIndex: (rowIndex: number, isContent: boolean) => HTMLTableRowElement | HTMLCollectionOf<HTMLTableRowElement> =
    //     useCallback((rowIndex: number, isContent: boolean): HTMLTableRowElement | HTMLCollectionOf<HTMLTableRowElement> => {
    //         const table: HTMLTableElement | null = isContent ? gridRef.current?.getContentTable() : gridRef.current?.getHeaderTable();
    //         if (!table || !table.rows || rowIndex >= table.rows.length) { return null; }
    //         const row: HTMLTableRowElement = table.rows[rowIndex as number];
    //         if (!row) { return null; }
    //         return row.classList.contains('e-added-row') || row.classList.contains('e-addedrow')
    //             ? row.querySelector('table')?.rows
    //             : table.rows;
    //     }, [gridRef]);
    /**
     * Validator function for cell navigation
     *
     * @returns {Function} Validator function
     */
    const validator = useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return (_rowIndex, _columnIndex, _action) => {
            return true; // Simplified validator - can be enhanced based on original implementation
        };
    }, []);
    /**
     * Get the current from action
     *
     * @param {string} action - Navigation action
     * @param {number[]} navigator - Navigation direction
     * @param {boolean} [isPresent] - Whether the action is present
     * @param {KeyboardEvent} [_e] - Keyboard event
     * @returns {number[]|null} Current cell coordinates
     */
    const getCurrentFromAction = useCallback((action, navigator = [0, 0], 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _isPresent, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _e) => {
        const matrix = getActiveMatrix();
        // if (!isPresent && !indexesByKey(action) || (matrix.current.length === 0)) {
        //     return null;
        // }
        // Get current indexes based on action
        const [rowIndex, cellIndex, rN, cN] = indexesByKey(action) || [...matrix.current, ...navigator];
        // Handle special actions
        if (action === 'ctrlHome') {
            // First cell of first row
            return firstFocusableActiveCellIndex;
        }
        else if (action === 'ctrlEnd') {
            // Last cell of last row
            // return lastFocusableActiveCellIndex;
            return activeMatrix.current === 'content' ? lastFocusableActiveCellIndex : lastFocusableHeaderCellIndex;
        }
        else if (action === 'home') {
            // First cell of current row
            return [rowIndex, firstFocusableActiveCellIndex[1]];
        }
        else if (action === 'end') {
            // Last cell of current row
            return [rowIndex, lastFocusableActiveCellIndex[1]];
        }
        // For tab/shift+tab navigation at boundaries
        if (action === 'tab' && cellIndex >= lastFocusableActiveCellIndex[1]) { //matrix.matrix[rowIndex as number]?.length - 1
            // At the end of a row, move to the first cell of the next row
            if (rowIndex < matrix.rows) {
                return [rowIndex + 1, firstFocusableActiveCellIndex[1]]; //0
            }
        }
        else if (action === 'shiftTab' && cellIndex <= firstFocusableActiveCellIndex[1]) { //0
            // At the beginning of a row, move to the last cell of the previous row
            if (rowIndex > 0) {
                return [rowIndex - 1, lastFocusableActiveCellIndex[1]]; //prevRowLastCol
            }
        }
        // Get next valid cell
        const current = matrix.get(rowIndex, cellIndex, [rN, cN], action, validator(), 
        // (rowIdx: number) => getRowsFromIndex(rowIdx, activeMatrix.current === 'content'),
        { matrix: matrix });
        return current;
    }, [getActiveMatrix, indexesByKey, validator,
        // getRowsFromIndex,
        activeMatrix.current]);
    /**
     * Handle key press event
     *
     * @param {KeyboardEvent} e - Keyboard event
     * @returns {boolean} Whether the key press was handled
     */
    const onKeyPress = useCallback((e) => {
        const isMacLike = /(Mac)/i.test(navigator.platform);
        let action = '';
        // Convert key to action
        switch (e.key) {
            case 'ArrowRight':
                action = 'rightArrow';
                break;
            case 'ArrowLeft':
                action = 'leftArrow';
                break;
            case 'ArrowUp':
                action = 'upArrow';
                break;
            case 'ArrowDown':
                action = 'downArrow';
                break;
            case 'Tab':
                action = e.shiftKey ? 'shiftTab' : 'tab';
                break;
            case 'Enter':
                action = e.shiftKey ? 'shiftEnter' : 'enter';
                break;
            case 'Home':
                action = e.ctrlKey || (isMacLike && e.metaKey) ? 'ctrlHome' : 'home';
                break;
            case 'End':
                action = e.ctrlKey || (isMacLike && e.metaKey) ? 'ctrlEnd' : 'end';
                break;
            default: return true; // Not a navigation key
        }
        // Handle Mac-specific key combinations
        if (isMacLike && e.metaKey && ['downArrow', 'upArrow', 'leftArrow', 'rightArrow'].indexOf(action) !== -1) {
            return true;
        }
        // Get navigation vectors
        const navigators = keyActions.current[action];
        // Get current position from action
        const matrix = getActiveMatrix();
        const current = getCurrentFromAction(action, navigators, action in keyActions.current, e);
        if (!current) {
            return true;
        }
        // Check if we're at the boundary of the current matrix
        const isAtHeaderBottom = activeMatrix.current === 'header' &&
            current.toString() === headerMatrix.current.current.toString() && action === 'downArrow';
        const isAtContentTop = activeMatrix.current === 'content' &&
            current.toString() === contentMatrix.current.current.toString() && action === 'upArrow';
        const isAtHeaderRight = activeMatrix.current === 'header' &&
            current.toString() === headerMatrix.current.current.toString() && action === 'tab';
        const isAtContentLeft = activeMatrix.current === 'content' &&
            current.toString() === contentMatrix.current.current.toString() && action === 'shiftTab';
        // Handle boundary navigation between header and content
        if (isAtHeaderBottom || isAtHeaderRight) {
            swapInfo.current = { swap: true, toHeader: false };
            return false;
        }
        else if (isAtContentTop || isAtContentLeft) {
            swapInfo.current = { swap: true, toHeader: true };
            return false;
        }
        // Update matrix selection - IMPORTANT: Create a new array to ensure React detects the change
        matrix.select(current[0], current[1]);
        // CRITICAL: This line is key for keyboard navigation to work properly
        // We need to create a new array to ensure the reference changes
        matrix.current = [...current]; // Create a new array reference
        return true;
    }, [getCurrentFromAction, getActiveMatrix, activeMatrix.current, focusedCell.current]);
    /**
     * Clear focus indicator without changing focus state
     * Used when focus moves out of grid or during specific actions
     *
     * @returns {void}
     */
    const clearIndicator = useCallback(() => {
        if (focusedCell.current.element) {
            // Remove focus classes directly from DOM
            focusedCell.current.element.classList.remove(CSS_FOCUSED, CSS_FOCUS);
            focusedCell.current.elementToFocus.classList.remove(CSS_FOCUSED, CSS_FOCUS);
        }
    }, [focusedCell.current]);
    /**
     * Remove focus from current cell - update state and DOM
     *
     * @returns {void}
     */
    const removeFocus = useCallback(() => {
        if (focusedCell.current.element) {
            // Remove focus classes directly from DOM
            focusedCell.current.element.classList.remove(CSS_FOCUSED, CSS_FOCUS);
            focusedCell.current.element.tabIndex = -1;
        }
        // Update state
        focusedCell.current = {
            rowIndex: -1,
            colIndex: -1,
            isHeader: false,
            skipAction: false,
            outline: true
        };
    }, [focusedCell.current]);
    /**
     * Add focus to a cell - update state and DOM
     *
     * @param {FocusedCellInfo} info - Cell info to focus
     * @param {KeyboardEvent} [e] - Keyboard event
     * @returns {void}
     */
    const addFocus = useCallback((info, e) => {
        // Find the currently focused cell and remove focus
        const currentFocusedCell = gridRef.current?.element?.querySelectorAll('[tabindex="0"]');
        currentFocusedCell?.forEach((cell) => {
            cell.classList.remove(CSS_FOCUSED, CSS_FOCUS);
            cell.tabIndex = -1;
        });
        const newInfo = {
            ...info,
            outline: info.outline !== false, // Default to true if not explicitly set to false
            element: info.element,
            elementToFocus: info.elementToFocus
        };
        // Update the focused cell state
        focusedCell.current = newInfo;
        // Add focus classes directly to DOM
        if (newInfo.outline) {
            newInfo.element.classList.add(CSS_FOCUSED);
        }
        newInfo.elementToFocus.classList.add(CSS_FOCUS);
        // Set tabIndex - ensure only one element has tabIndex=0
        newInfo.element.tabIndex = 0;
        // Focus the element using DOM API
        requestAnimationFrame(() => {
            newInfo.elementToFocus?.focus();
        });
        // Notify cell focused
        const matrix = getActiveMatrix();
        const args = {
            element: newInfo.elementToFocus,
            parent: newInfo.element,
            indexes: matrix.current,
            byKey: !!e,
            byClick: !e,
            keyArgs: e,
            isJump: swapInfo.current.swap,
            container: { isContent: activeMatrix.current === 'content' },
            outline: newInfo.outline,
            swapInfo: swapInfo.current,
            rowIndex: newInfo.rowIndex,
            colIndex: newInfo.colIndex
        };
        callbacks?.onCellFocus?.(args);
        // Update previous indexes
        const [rowIndex, cellIndex] = matrix.current;
        prevIndexes.current = { rowIndex, cellIndex };
    }, [getActiveMatrix, callbacks, focusedCell.current, activeMatrix.current, gridRef]);
    /**
     * Handle click event
     *
     * @param {MouseEvent} e - Mouse event
     * @param {boolean} [_force] - Force flag
     * @returns {boolean} Whether the click was handled
     */
    const onClick = useCallback((e, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _force) => {
        const target = e.target;
        const cellElement = target.closest('td, th');
        if (!cellElement) {
            return false;
        }
        const rowElement = cellElement.closest('tr');
        // if (!rowElement) { return false; }
        // const table: HTMLTableElement = cellElement.closest('table');
        // if (!table) { return false; }
        const isHeader = cellElement.tagName.toLowerCase() === 'th';
        setActiveMatrix(!isHeader);
        const matrix = getActiveMatrix();
        const rows = isHeader ? gridRef.current?.getHeaderTable()?.rows :
            gridRef.current?.getContentTable()?.rows;
        if (!rows) {
            return false;
        }
        const rowIndex = Array.from(rows).indexOf(rowElement);
        const cellIndex = Array.from(rowElement.cells).indexOf(cellElement);
        if (rowIndex < 0 || cellIndex < 0) {
            return false;
        }
        // Before cell focus event
        const beforeArgs = {
            cancel: false,
            byKey: false,
            byClick: true,
            rowIndex: rowIndex,
            colIndex: cellIndex,
            element: cellElement
        };
        callbacks?.beforeCellFocus?.(beforeArgs);
        if (beforeArgs.cancel) {
            return false;
        }
        // Update the matrix selection
        matrix.select(rowIndex, cellIndex);
        // Create a new array to ensure the reference changes
        matrix.current = [rowIndex, cellIndex];
        // Create focus info for the clicked cell
        const info = {
            rowIndex: rowIndex,
            colIndex: cellIndex,
            isHeader: isHeader,
            element: cellElement,
            elementToFocus: cellElement,
            outline: true
        };
        // Add focus to the clicked cell
        addFocus(info);
        // Notify cell clicked
        const args = {
            element: cellElement,
            parent: cellElement,
            indexes: [rowIndex, cellIndex],
            byKey: false,
            byClick: true,
            isJump: false,
            container: { isContent: !isHeader },
            outline: true,
            rowIndex: rowIndex,
            colIndex: cellIndex
        };
        callbacks?.onCellClick?.(args);
        return true;
    }, [getActiveMatrix, setActiveMatrix, gridRef, callbacks, addFocus, removeFocus, activeMatrix.current]);
    /**
     * Get focus info for the current cell
     *
     * @returns {FocusedCellInfo} Focus info
     */
    const getFocusInfo = useCallback(() => {
        const info = {
            rowIndex: 0,
            colIndex: 0,
            isHeader: false
        };
        const matrix = getActiveMatrix();
        const [rowIndex, cellIndex] = matrix.current;
        matrix.current = [rowIndex, cellIndex];
        const isContent = activeMatrix.current === 'content';
        const table = isContent ? gridRef.current?.getContentTable() :
            gridRef.current?.getHeaderTable();
        if (!table || !table.rows || rowIndex >= table.rows.length) {
            return info;
        }
        const row = table.rows[rowIndex];
        if (!row) {
            return info;
        }
        info.element = row.cells[cellIndex];
        if (!info.element) {
            return info;
        }
        info.elementToFocus = info.element;
        info.outline = true;
        info.uid = row.getAttribute('data-uid');
        info.isHeader = !isContent;
        info.rowIndex = rowIndex;
        info.colIndex = cellIndex;
        return info;
    }, [getActiveMatrix, gridRef, activeMatrix.current]);
    /**
     * Focus a cell
     *
     * @param {KeyboardEvent} [e] - Keyboard event
     * @returns {void}
     */
    const focus = useCallback((e) => {
        // Get the current matrix
        const matrix = getActiveMatrix();
        // Get the current position from the matrix
        const [rowIndex, cellIndex] = matrix.current;
        // Get the table based on active matrix
        const table = activeMatrix.current === 'content' ?
            gridRef.current?.getContentTable() : gridRef.current?.getHeaderTable();
        // Create focus info object
        const info = {
            rowIndex,
            colIndex: cellIndex,
            isHeader: activeMatrix.current === 'header',
            outline: true
        };
        // Find the element in the DOM
        if (table && table.rows.length > rowIndex &&
            table.rows[rowIndex] &&
            table.rows[rowIndex].cells.length > cellIndex) {
            info.element = table.rows[rowIndex].cells[cellIndex];
            info.elementToFocus = info.element;
            // If we found an element, add focus to it
            addFocus(info, e);
            return;
        }
    }, [getFocusInfo, getActiveMatrix, activeMatrix, gridRef, addFocus, activeMatrix.current]);
    /**
     * Handle keyboard navigation
     *
     * @param {KeyboardEvent} event - Keyboard event
     * @returns {void}
     */
    const handleKeyDown = useCallback((event) => {
        // Set grid as focused if it's not already
        if (!isGridFocused) {
            setIsGridFocused(true);
        }
        // Skip if not a navigation key
        if (!isNavigationKey(event)) {
            return;
        }
        // Prevent default browser behavior for navigation keys
        event.preventDefault();
        // Before cell focus event
        const beforeArgs = {
            cancel: false,
            byKey: true,
            byClick: false,
            keyArgs: event,
            rowIndex: focusedCell.current.rowIndex,
            colIndex: focusedCell.current.colIndex
        };
        callbacks?.beforeCellFocus?.(beforeArgs);
        if (beforeArgs.cancel) {
            return;
        }
        // Process key press
        const result = onKeyPress(event);
        if (result === false) {
            // Handle boundary navigation
            if (swapInfo.current.swap) {
                // Determine if we're moving to header or content
                const movingToHeader = swapInfo.current.toHeader;
                setActiveMatrix(!movingToHeader);
                // Get the appropriate matrix after switching
                const matrix = getActiveMatrix();
                // Determine the action from the key event
                const action = getNavigationDirection(event);
                if (movingToHeader) {
                    // Moving to header - find appropriate header cell based on navigation direction
                    if (headerRowCount > 0 && columns?.length > 0) {
                        if (action === 'upArrow' || action === 'shiftTab') {
                            // When moving up to header or shift+tab to header, go to the last cell in the header
                            const lastHeaderRow = headerRowCount - 1;
                            // const lastHeaderCol: number = action === 'upArrow' ? focusedCell.current.colIndex : lastFocusableActiveCellIndex[1];
                            const lastHeaderCol = action === 'upArrow' && contentRowCount > 0 ? focusedCell.current.colIndex :
                                (action === 'upArrow' ? firstFocusableHeaderCellIndex[1] : lastFocusableHeaderCellIndex[1]);
                            matrix.select(lastHeaderRow, lastHeaderCol);
                            matrix.current = [lastHeaderRow, lastHeaderCol];
                        }
                    }
                }
                else {
                    // Moving to content - find appropriate content cell based on navigation direction
                    if (contentRowCount > 0 && columns?.length > 0) {
                        if (action === 'downArrow' || action === 'tab') {
                            // When moving down to content or tab to content, go to the first cell in content
                            const firstContentCol = action === 'downArrow' ? focusedCell.current.colIndex : firstFocusableActiveCellIndex[1]; //0
                            matrix.select(0, firstContentCol);
                            matrix.current = [0, firstContentCol];
                        }
                    }
                }
                // Reset swap info
                swapInfo.current = { swap: false, toHeader: false };
                // Focus the cell after swapping
                focus(event);
            }
            return;
        }
        // Focus the cell
        focus(event);
    }, [isGridFocused, setIsGridFocused, focusedCell.current, onKeyPress, setActiveMatrix, getActiveMatrix, focus, callbacks, headerRowCount,
        contentRowCount, columns?.length, activeMatrix.current]);
    /**
     * Handle grid-level click event
     *
     * @param {MouseEvent} event - Mouse event
     * @returns {void}
     */
    const handleGridClick = useCallback((event) => {
        // Set grid as focused
        setIsGridFocused(true);
        // Handle the click
        onClick(event);
    }, [onClick, setIsGridFocused]);
    /**
     * Initialize matrices when row or column count changes
     */
    useEffect(() => {
        // Initialize content matrix
        if (contentRowCount > 0 && columns?.length > 0) {
            // Create proper row models similar to the original implementation
            // Use Array.from with index parameter to avoid unused variables
            const rows = gridRef.current.getRowsObject();
            // Set the rows count explicitly before generating
            contentMatrix.current.rows = contentRowCount - 1;
            contentMatrix.current.columns = columns?.length - 1;
            // Generate matrix with proper selector function
            contentMatrix.current.generate(rows, (row, cell) => {
                return (row.isDataRow && cell.visible && (cell.isDataCell)) || // || cell.isTemplate
                    (cell.column && cell.visible) // && cell.column.type === 'checkbox'
                    || (cell.cellType === CellType.CommandColumn);
            });
            // Initialize current position to first valid cell
            const firstValidCell = contentMatrix.current.matrix[0][0] === 1 ? [0, 0] :
                contentMatrix.current.findCellIndex([0, 0], true);
            contentMatrix.current.current = [...firstValidCell];
        }
        else {
            contentMatrix.current.matrix[0] = [1]; // empty no records cell [1]
        }
        // Initialize header matrix
        if (headerRowCount > 0 && columns?.length > 0) {
            // Create proper header row models
            // Use Array.from with index parameter to avoid unused variables
            const rows = gridRef.current.getHeaderRowsObject();
            // Set the rows count explicitly before generating
            headerMatrix.current.rows = headerRowCount - 1;
            headerMatrix.current.columns = columns?.length - 1;
            // Generate matrix with proper selector function for headers
            // Use destructuring to ignore the first parameter
            headerMatrix.current.generate(rows, (_unusedRow, cell) => {
                return cell.visible && (cell.column.field !== undefined || cell.isTemplate ||
                    cell.column.template !== undefined || // || cell.column.commands !== undefined
                    cell.column.type === 'checkbox' || cell.cellType === CellType.StackedHeader);
            });
            // Initialize current position to first valid cell
            const firstValidCell = headerMatrix.current.matrix?.[0]?.[0] === 1 ? [0, 0] :
                headerMatrix.current.findCellIndex([0, 0], true);
            headerMatrix.current.current = [...firstValidCell];
        }
    }, [headerRowCount, contentRowCount, columns?.length, columns]);
    /**
     * Set the first focusable element's tabIndex to 0
     * This is used to allow users to tab into the grid
     *
     * @returns {void}
     */
    const setFirstFocusableTabIndex = useCallback(() => {
        if (!gridRef.current || !gridRef.current.element) {
            return;
        }
        // Set grid element tabIndex to -1
        gridRef.current.element.tabIndex = -1;
        // Clear any existing tabIndex=0 and focus classes
        const currentFocusableCell = gridRef.current.element.querySelector('[tabindex="0"]');
        if (currentFocusableCell) {
            currentFocusableCell.tabIndex = -1;
            currentFocusableCell.classList.remove(CSS_FOCUSED, CSS_FOCUS);
        }
        // For basic grid, set first visible header cell tabIndex to 0
        if (columns?.length > 0) {
            const headerTable = gridRef.current.getHeaderTable();
            if (headerTable && headerTable.rows.length > 0) {
                // Set active matrix to header
                setActiveMatrix(false);
                // Get the active matrix (which should now be the header matrix)
                const matrix = getActiveMatrix();
                // Use the first focusable cell index from the matrix
                if (firstFocusableActiveCellIndex &&
                    firstFocusableActiveCellIndex.length === 2 &&
                    firstFocusableActiveCellIndex[0] >= 0 &&
                    firstFocusableActiveCellIndex[1] >= 0 &&
                    firstFocusableActiveCellIndex[0] < headerTable.rows.length &&
                    headerTable.rows[firstFocusableActiveCellIndex[0]] &&
                    firstFocusableActiveCellIndex[1] < headerTable.rows[firstFocusableActiveCellIndex[0]].cells.length) {
                    const firstHeaderCell = headerTable.rows[firstFocusableActiveCellIndex[0]].cells[firstFocusableActiveCellIndex[1]];
                    if (firstHeaderCell && !firstHeaderCell.classList.contains('e-hide')) {
                        // Set tabIndex to 0 for first cell
                        firstHeaderCell.tabIndex = 0;
                        // Update the matrix current position
                        matrix.select(firstFocusableActiveCellIndex[0], firstFocusableActiveCellIndex[1]);
                        matrix.current = [...firstFocusableActiveCellIndex]; // Create a new array to ensure React detects the change
                        return;
                    }
                }
                // Fallback to first visible header cell if the calculated one is hidden or invalid
                const firstVisibleHeaderCell = headerTable.querySelector('.e-headercell:not(.e-hide)');
                firstVisibleHeaderCell.tabIndex = 0;
                // Find the row and cell index of this element
                const row = firstVisibleHeaderCell.closest('tr');
                const rowIndex = Array.from(headerTable.rows).indexOf(row);
                const cellIndex = Array.from(row.cells).indexOf(firstVisibleHeaderCell);
                // Update the matrix current position
                matrix.select(rowIndex, cellIndex);
                matrix.current = [rowIndex, cellIndex];
            }
        }
    }, [gridRef, columns?.length, setActiveMatrix, getActiveMatrix, firstFocusableActiveCellIndex]);
    /**
     * Check if a key event is for navigation
     *
     * @param {KeyboardEvent} event - Keyboard event
     * @returns {boolean} Whether the key is for navigation
     */
    const isNavigationKey = useCallback((event) => {
        return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End', 'Enter'].includes(event.key);
    }, []);
    /**
     * Get navigation direction from key event
     *
     * @param {KeyboardEvent} event - Keyboard event
     * @returns {string|null} Navigation direction
     */
    const getNavigationDirection = useCallback((event) => {
        switch (event.key) {
            case 'ArrowUp': return 'upArrow';
            case 'ArrowDown': return 'downArrow';
            case 'ArrowLeft': return 'leftArrow';
            case 'ArrowRight': return 'rightArrow';
            case 'Tab': return event.shiftKey ? 'shiftTab' : 'tab';
            case 'Home': return event.ctrlKey ? 'ctrlHome' : 'home';
            case 'End': return event.ctrlKey ? 'ctrlEnd' : 'end';
            case 'Enter': return event.shiftKey ? 'shiftEnter' : 'enter';
            default: return null;
        }
    }, []);
    /**
     * Set the last content cell's tabIndex to 0
     * This helps with backward tabbing from elements after the grid
     *
     * @returns {void}
     */
    const setLastContentCellTabIndex = useCallback(() => {
        // Clear any existing tabIndex=0 in content cells
        const currentFocusableCell = gridRef.current.getContentTable()?.querySelector('[tabindex="0"]');
        if (currentFocusableCell) {
            currentFocusableCell.tabIndex = -1;
            currentFocusableCell.classList.remove(CSS_FOCUSED, CSS_FOCUS);
        }
        const contentTable = gridRef.current.getContentTable();
        if (contentTable && contentTable.rows.length > 0) {
            // Use the last focusable cell index from the matrix
            if (lastFocusableActiveCellIndex && lastFocusableActiveCellIndex.length === 2) {
                const [rowIndex, colIndex] = lastFocusableActiveCellIndex;
                // Ensure the indices are valid
                if (rowIndex >= 0 && rowIndex < contentTable.rows.length &&
                    colIndex >= 0 && contentTable.rows[rowIndex] &&
                    colIndex < contentTable.rows[rowIndex].cells.length) {
                    const cell = contentTable.rows[rowIndex].cells[colIndex];
                    if (cell && !cell.classList.contains('e-hide')) {
                        // Set tabIndex to 0 for last cell
                        cell.tabIndex = 0;
                        // Update the content matrix to reflect this cell as the current one
                        contentMatrix.current.select(rowIndex, colIndex);
                        contentMatrix.current.current = [rowIndex, colIndex]; // Create a new array reference
                        // Set active matrix to content
                        setActiveMatrix(true);
                        return;
                    }
                }
            }
        }
    }, [gridRef, lastFocusableActiveCellIndex, contentMatrix, setActiveMatrix]);
    /**
     * Set grid focus state
     *
     * @param {boolean} focused - Whether the grid is focused
     * @returns {void}
     */
    const setGridFocus = useCallback((focused) => {
        // Update the grid focus state
        setIsGridFocused(focused);
        // When grid loses focus, we need to reset focus state
        if (!focused) {
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                // 1. Remove focus from current cell
                removeFocus();
                // 2. Reset active matrix to header (similar to original TS implementation)
                setActiveMatrix(false);
                // 3. Set tabIndex for first header cell and last content cell
                // This ensures proper tab navigation when returning to the grid
                setFirstFocusableTabIndex();
                setLastContentCellTabIndex();
                // 4. Reset previous indexes to ensure clean state
                prevIndexes.current = {};
                // 5. Clear any focus indicators
                clearIndicator();
            });
        }
        else {
            // When grid gains focus, ensure proper tabIndex setup
            setFirstFocusableTabIndex();
            setLastContentCellTabIndex();
        }
    }, [removeFocus, setActiveMatrix, setFirstFocusableTabIndex, setLastContentCellTabIndex, clearIndicator]);
    /**
     * Navigate to a specific cell
     *
     * @param {number} rowIndex - Row index
     * @param {number} colIndex - Column index
     * @param {boolean} [isHeader] - Whether the cell is in the header
     * @returns {void}
     */
    const navigateToCell = useCallback((rowIndex, colIndex, isHeader) => {
        // Set the active matrix
        setActiveMatrix(!isHeader);
        // Get the active matrix
        const matrix = getActiveMatrix();
        // Check if the cell is valid
        if (rowIndex >= 0 && colIndex >= 0) {
            // Before cell focus event
            const beforeArgs = {
                cancel: false,
                byKey: false,
                byClick: false,
                rowIndex: rowIndex,
                colIndex: colIndex
            };
            callbacks?.beforeCellFocus?.(beforeArgs);
            if (beforeArgs.cancel) {
                return;
            }
            // Update the matrix selection
            matrix.select(rowIndex, colIndex);
            // Create a new array to ensure the reference changes
            matrix.current = [rowIndex, colIndex];
            // Get the table
            const table = isHeader ? gridRef.current?.getHeaderTable()
                : gridRef.current?.getContentTable();
            if (table && table.rows.length > rowIndex) {
                const row = table.rows[rowIndex];
                if (row && row.cells.length > colIndex) {
                    // Get the cell element
                    const cellElement = row.cells[colIndex];
                    // Create focus info
                    const info = {
                        rowIndex: rowIndex,
                        colIndex: colIndex,
                        isHeader: isHeader,
                        element: cellElement,
                        elementToFocus: cellElement,
                        outline: true
                    };
                    // Add focus to the cell
                    addFocus(info);
                }
            }
        }
    }, [setActiveMatrix, getActiveMatrix, gridRef, addFocus, activeMatrix.current]);
    /**
     * Navigate to first cell, specifically useful for no parent sibling available case.
     *
     * @returns {void}
     */
    const navigateToFirstCell = useCallback(() => {
        const startInHeader = headerRowCount > 0;
        setActiveMatrix(!startInHeader);
        const matrix = getActiveMatrix();
        // Find first valid cell using findCellIndex
        const firstCell = matrix.matrix[0][0] === 1 ? [0, 0] : matrix.findCellIndex([0, 0], true);
        matrix.select(firstCell[0], firstCell[1]);
        matrix.current = [...firstCell]; // Create a new array reference
        focus();
    }, [headerRowCount, setActiveMatrix, getActiveMatrix, focus, activeMatrix.current]);
    /**
     * Navigate to last cell
     *
     * @returns {void}
     */
    const navigateToLastCell = useCallback(() => {
        // Always navigate to content area for last cell
        setActiveMatrix(true);
        const matrix = getActiveMatrix();
        // Use the last focusable cell index if available
        const [rowIndex, colIndex] = lastFocusableActiveCellIndex;
        // Update the matrix selection
        matrix.select(rowIndex, colIndex);
        matrix.current = [rowIndex, colIndex]; // Create a new array reference
        // Set the tabIndex for the last cell
        setLastContentCellTabIndex();
        // Focus the cell
        focus();
        return;
    }, [contentRowCount, setActiveMatrix, getActiveMatrix, focus, lastFocusableActiveCellIndex, setLastContentCellTabIndex]);
    /**
     * Navigate to next cell based on direction
     *
     * @param {'up'|'down'|'left'|'right'|'nextCell'|'prevCell'} direction - Navigation direction
     * @returns {void}
     */
    const navigateToNextCell = useCallback((direction) => {
        const matrix = getActiveMatrix();
        let action;
        switch (direction) {
            case 'up':
                action = 'upArrow';
                break;
            case 'down':
                action = 'downArrow';
                break;
            case 'left':
                action = 'leftArrow';
                break;
            case 'right':
                action = 'rightArrow';
                break;
            case 'nextCell':
                action = 'tab';
                break;
            case 'prevCell':
                action = 'shiftTab';
                break;
        }
        const navigators = keyActions.current[action];
        const current = getCurrentFromAction(action, navigators, true);
        if (current) {
            matrix.select(current[0], current[1]);
            // Create a new array to ensure the reference changes
            matrix.current = [...current];
            focus();
        }
    }, [getActiveMatrix, getCurrentFromAction, focus, activeMatrix.current]);
    /**
     * Focus the content area of the grid
     * Used by Alt+W shortcut
     *
     * @returns {void}
     */
    const focusContent = useCallback(() => {
        // Set active matrix to content
        setActiveMatrix(true);
        // Reset focus to first cell in content
        const matrix = getActiveMatrix();
        const firstCell = matrix.matrix[0][0] === 1 ? [0, 0] : matrix.findCellIndex([0, 0], true);
        matrix.select(firstCell[0], firstCell[1]);
        matrix.current = [...firstCell];
        setIsGridFocused(true);
        focus();
    }, [setActiveMatrix, getActiveMatrix, focus]);
    /**
     * Add outline to the focused cell
     * Used by Alt+W shortcut
     *
     * @returns {void}
     */
    const addOutline = useCallback(() => {
        const info = getFocusInfo();
        info.element?.classList.add(CSS_FOCUSED);
        info.elementToFocus?.classList.add(CSS_FOCUS);
    }, [getFocusInfo]);
    return {
        // State
        focusedCell: focusedCell.current,
        isGridFocused,
        setGridFocus,
        // IFocusMatrix access
        contentMatrix: contentMatrix.current,
        headerMatrix: headerMatrix.current,
        getActiveMatrix,
        setActiveMatrix,
        // Focus methods
        focus,
        removeFocus,
        addFocus,
        getFocusInfo,
        setFirstFocusableTabIndex,
        focusContent,
        addOutline,
        clearIndicator,
        // Event handlers
        handleKeyDown,
        handleGridClick,
        // Navigation methods
        navigateToCell,
        navigateToNextCell,
        navigateToFirstCell,
        navigateToLastCell,
        // Utility methods
        isNavigationKey,
        getNavigationDirection,
        // Previous state tracking
        prevIndexes: prevIndexes.current,
        // Boundary indices
        firstFocusableActiveCellIndex,
        lastFocusableActiveCellIndex
    };
};
export default useFocusStrategy;
