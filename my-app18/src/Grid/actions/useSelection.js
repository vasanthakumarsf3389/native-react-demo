// import { useState, useCallback, useMemo } from 'react';
// import { addClass, removeClass } from '@syncfusion/react-base';

// /**
//  * Custom hook for selection management
//  */
// export const useSelection = (gridRef) => {
//     const [selectedRowIndexes, setSelectedRowIndexes] = useState([]);
//     const [selectedRecords, setSelectedRecords] = useState([]);
//     const [activeTarget, setActiveTarget] = useState(null);

//     /**
//      * Clear all row selections
//      */
//     const clearRowSelection = useCallback(() => {
//         // Remove selection classes from all rows
//         if (gridRef.current?.element) {
//             const selectedRows = gridRef.current.element.querySelectorAll('tr.e-rowselected');
//             selectedRows.forEach(row => {
//                 removeClass([row], ['e-rowselected']);
//             });
//         }
        
//         setSelectedRowIndexes([]);
//         setSelectedRecords([]);
//         setActiveTarget(null);
//     }, [gridRef]);

//     /**
//      * Select a row by index
//      */
//     const selectRow = useCallback((rowIndex, isToggle = false) => {
//         if (!gridRef.current?.element || rowIndex < 0) return;

//         const rows = gridRef.current.element.querySelectorAll('tbody tr');
//         const targetRow = rows[rowIndex];
        
//         if (!targetRow) return;

//         const currentViewData = gridRef.current.currentViewData || [];
//         const rowData = currentViewData[rowIndex];

//         if (isToggle && selectedRowIndexes.includes(rowIndex)) {
//             // Deselect if already selected
//             removeClass([targetRow], ['e-rowselected']);
//             setSelectedRowIndexes(prev => prev.filter(index => index !== rowIndex));
//             setSelectedRecords(prev => prev.filter((_, index) => selectedRowIndexes[index] !== rowIndex));
//         } else {
//             // Clear previous selections for single selection
//             clearRowSelection();
            
//             // Select the new row
//             addClass([targetRow], ['e-rowselected']);
//             setSelectedRowIndexes([rowIndex]);
//             setSelectedRecords([rowData]);
//             setActiveTarget(targetRow);
//         }
//     }, [gridRef, selectedRowIndexes, clearRowSelection]);

//     /**
//      * Select multiple rows by indexes
//      */
//     const selectRows = useCallback((rowIndexes) => {
//         if (!Array.isArray(rowIndexes) || !gridRef.current?.element) return;

//         clearRowSelection();
        
//         const rows = gridRef.current.element.querySelectorAll('tbody tr');
//         const currentViewData = gridRef.current.currentViewData || [];
//         const newSelectedRecords = [];

//         rowIndexes.forEach(rowIndex => {
//             const targetRow = rows[rowIndex];
//             if (targetRow && rowIndex < currentViewData.length) {
//                 addClass([targetRow], ['e-rowselected']);
//                 newSelectedRecords.push(currentViewData[rowIndex]);
//             }
//         });

//         setSelectedRowIndexes(rowIndexes);
//         setSelectedRecords(newSelectedRecords);
//     }, [gridRef, clearRowSelection]);

//     /**
//      * Select a range of rows
//      */
//     const selectRowByRange = useCallback((startIndex, endIndex = startIndex) => {
//         if (startIndex < 0) return;
        
//         const start = Math.min(startIndex, endIndex);
//         const end = Math.max(startIndex, endIndex);
//         const rowIndexes = [];
        
//         for (let i = start; i <= end; i++) {
//             rowIndexes.push(i);
//         }
        
//         selectRows(rowIndexes);
//     }, [selectRows]);

//     /**
//      * Add multiple rows to the current selection
//      */
//     const addRowsToSelection = useCallback((rowIndexes) => {
//         if (!Array.isArray(rowIndexes) || !gridRef.current?.element) return;

//         const rows = gridRef.current.element.querySelectorAll('tbody tr');
//         const currentViewData = gridRef.current.currentViewData || [];
//         const newSelectedIndexes = [...selectedRowIndexes];
//         const newSelectedRecords = [...selectedRecords];

//         rowIndexes.forEach(rowIndex => {
//             if (!newSelectedIndexes.includes(rowIndex)) {
//                 const targetRow = rows[rowIndex];
//                 if (targetRow && rowIndex < currentViewData.length) {
//                     addClass([targetRow], ['e-rowselected']);
//                     newSelectedIndexes.push(rowIndex);
//                     newSelectedRecords.push(currentViewData[rowIndex]);
//                 }
//             }
//         });

//         setSelectedRowIndexes(newSelectedIndexes);
//         setSelectedRecords(newSelectedRecords);
//     }, [gridRef, selectedRowIndexes, selectedRecords]);

//     /**
//      * Get selected row indexes
//      */
//     const getSelectedRowIndexes = useCallback(() => {
//         return selectedRowIndexes;
//     }, [selectedRowIndexes]);

//     /**
//      * Get selected records
//      */
//     const getSelectedRecords = useCallback(() => {
//         return selectedRecords;
//     }, [selectedRecords]);

//     /**
//      * Handle grid click for selection
//      */
//     const handleGridClick = useCallback((event) => {
//         const target = event.target;
//         const row = target.closest('tbody tr');
        
//         if (row) {
//             const rows = Array.from(row.parentElement.children);
//             const rowIndex = rows.indexOf(row);
            
//             if (rowIndex >= 0) {
//                 const isCtrlPressed = event.ctrlKey || event.metaKey;
//                 const isShiftPressed = event.shiftKey;
                
//                 if (isShiftPressed && selectedRowIndexes.length > 0) {
//                     // Range selection
//                     const lastSelectedIndex = selectedRowIndexes[selectedRowIndexes.length - 1];
//                     selectRowByRange(lastSelectedIndex, rowIndex);
//                 } else if (isCtrlPressed) {
//                     // Toggle selection
//                     selectRow(rowIndex, true);
//                 } else {
//                     // Single selection
//                     selectRow(rowIndex, false);
//                 }
//             }
//         }
//     }, [selectedRowIndexes, selectRow, selectRowByRange]);

//     // Memoized API object
//     const selectionAPI = useMemo(() => ({
//         clearRowSelection,
//         selectRow,
//         selectRows,
//         selectRowByRange,
//         addRowsToSelection,
//         getSelectedRowIndexes,
//         getSelectedRecords,
//         handleGridClick,
//         selectedRowIndexes,
//         selectedRecords,
//         activeTarget
//     }), [
//         clearRowSelection,
//         selectRow,
//         selectRows,
//         selectRowByRange,
//         addRowsToSelection,
//         getSelectedRowIndexes,
//         getSelectedRecords,
//         handleGridClick,
//         selectedRowIndexes,
//         selectedRecords,
//         activeTarget
//     ]);

//     return selectionAPI;
// };

import { useCallback, useRef } from 'react';
import { closest, isNullOrUndefined, isUndefined } from '@syncfusion/react-base';
/**
 * Custom hook to manage selection state and API
 *
 * @param {RefObject<GridRef>} gridRef - Reference to the grid component
 * @returns {SelectionAPI} An object containing selection-related state and API
 */
export const useSelection = (gridRef) => {
    const selectedRowIndexes = useRef([]);
    const selectedRecords = useRef([]);
    const prevRowIndex = useRef(null);
    const activeTarget = useRef(null);
    const isMultiShiftRequest = useRef(false);
    const isMultiCtrlRequest = useRef(false);
    const isRowSelected = useRef(false);
    /**
     * Adds or removes selection classes from row cells
     */
    const addRemoveSelectionClasses = useCallback((row, isAdd) => {
        const cells = Array.from(row.getElementsByClassName('e-rowcell'));
        for (let i = 0; i < cells.length; i++) {
            if (isAdd) {
                cells[parseInt(i.toString(), 10)].classList.add('e-selectionbackground', 'e-active');
                cells[parseInt(i.toString(), 10)].setAttribute('aria-selected', 'true');
            }
            else {
                cells[parseInt(i.toString(), 10)].classList.remove('e-selectionbackground', 'e-active');
                cells[parseInt(i.toString(), 10)].removeAttribute('aria-selected');
            }
        }
    }, []);
    const getRowObj = useCallback((row) => {
        if (isNullOrUndefined(row)) {
            return {};
        }
        if (typeof row === 'number') {
            row = gridRef?.current?.getRowByIndex(row);
        }
        if (row) {
            return gridRef?.current.getRowObjectFromUID(row.getAttribute('data-uid')) || {};
        }
        return {};
    }, []);
    /**
     * Updates row selection state
     */
    const updateRowSelection = useCallback((selectedRow, rowIndex) => {
        selectedRowIndexes?.current.push(rowIndex);
        selectedRecords?.current.push(selectedRow);
        const rowObj = getRowObj(selectedRow);
        rowObj.isSelected = true;
        selectedRow.setAttribute('aria-selected', 'true');
        addRemoveSelectionClasses(selectedRow, true);
    }, [gridRef, selectedRowIndexes?.current, addRemoveSelectionClasses]);
    /**
     * Deselects the currently selected rows.
     *
     * @returns {void}
     */
    const clearRowSelection = useCallback(() => {
        if (isRowSelected?.current) {
            const rows = Array.from(gridRef?.current.getRows() || []);
            const data = [];
            const row = [];
            const rowIndexes = [];
            for (let i = 0, len = selectedRowIndexes?.current.length; i < len; i++) {
                const currentRow = gridRef?.current.getRows()[selectedRowIndexes?.current[parseInt(i.toString(), 10)]];
                const rowObj = getRowObj(currentRow);
                if (rowObj) {
                    data.push(rowObj.data);
                    row.push(currentRow);
                    rowIndexes.push(selectedRowIndexes?.current[parseInt(i.toString(), 10)]);
                    rowObj.isSelected = false;
                }
            }
            const args = {
                data: data,
                rowIndexes: rowIndexes,
                row: row,
                target: activeTarget?.current,
                cancel: false
            };
            // Trigger the onRowDeselecting event
            if (gridRef?.current?.onRowDeselecting) {
                gridRef?.current?.onRowDeselecting(args);
                if (args.cancel) {
                    return;
                } // If canceled, don't proceed with deselection
            }
            const element = [].slice.call(rows.filter((record) => record.hasAttribute('aria-selected')));
            for (let j = 0; j < element.length; j++) {
                element[parseInt(j.toString(), 10)].removeAttribute('aria-selected');
                addRemoveSelectionClasses(element[parseInt(j.toString(), 10)], false);
            }
            selectedRowIndexes.current = [];
            selectedRecords.current = [];
            isRowSelected.current = false;
            if (gridRef?.current?.onRowDeselected) {
                const deselectedArgs = {
                    data: data,
                    rowIndexes: rowIndexes,
                    row: row,
                    target: activeTarget?.current,
                    cancel: false
                };
                gridRef?.current?.onRowDeselected(deselectedArgs);
            }
        }
    }, [gridRef?.current, isRowSelected?.current, addRemoveSelectionClasses]);
    /**
     * Gets the index of the selected row
     */
    const getSelectedRowIndexes = useCallback(() => {
        return selectedRowIndexes?.current;
    }, [selectedRowIndexes?.current]);
    /**
     * Gets the selected row data
     */
    const getSelectedRecords = useCallback(() => {
        let selectedData = [];
        if (selectedRecords?.current.length) {
            selectedData = (gridRef?.current.getRowsObject()).filter((row) => row.isSelected)
                .map((m) => m.data);
        }
        return selectedData;
    }, [selectedRecords?.current]);
    /**
     * Gets a collection of indexes between start and end
     *
     * @param {number} startIndex - The starting index
     * @param {number} [endIndex] - The ending index (optional)
     * @returns {number[]} Array of indexes
     */
    const getCollectionFromIndexes = useCallback((startIndex, endIndex) => {
        const indexes = [];
        // eslint-disable-next-line prefer-const
        let { i, max } = (startIndex <= endIndex) ?
            { i: startIndex, max: endIndex } : { i: endIndex, max: startIndex };
        for (; i <= max; i++) {
            indexes.push(i);
        }
        if (startIndex > endIndex) {
            indexes.reverse();
        }
        return indexes;
    }, []);
    const selectedDataUpdate = useCallback((selectedData, selectedRows, rowIndexes) => {
        for (let i = 0, len = rowIndexes.length; i < len; i++) {
            const currentRow = gridRef?.current.getRows()[rowIndexes[parseInt(i.toString(), 10)]];
            const rowObj = getRowObj(currentRow);
            if (rowObj && rowObj.isDataRow) {
                selectedData.push(rowObj.data);
                selectedRows.push(currentRow);
            }
        }
    }, []);
    const updateRowProps = useCallback((startIndex) => {
        prevRowIndex.current = startIndex;
        isRowSelected.current = selectedRowIndexes?.current.length && true;
    }, [selectedRowIndexes?.current]);
    /**
     * Selects a collection of rows by index.
     *
     * @param  {number[]} rowIndexes - Specifies an array of row indexes.
     * @returns {void}
     */
    const selectRows = useCallback((rowIndexes) => {
        const selectableRowIndex = [...rowIndexes];
        const rowIndex = gridRef?.current.selectionSettings.type !== 'Single' ? rowIndexes[0] : rowIndexes[rowIndexes.length - 1];
        const selectedRows = [];
        const selectedData = [];
        selectedDataUpdate(selectedData, selectedRows, rowIndexes);
        const selectingArgs = {
            cancel: false,
            rowIndexes: selectableRowIndex, row: selectedRows, rowIndex: rowIndex, target: activeTarget.current,
            previousRow: gridRef?.current.getRows()[parseInt(prevRowIndex?.current?.toString(), 10)],
            previousRowIndex: prevRowIndex?.current, isCtrlPressed: isMultiCtrlRequest?.current,
            isShiftPressed: isMultiShiftRequest?.current, data: selectedData
        };
        if (gridRef?.current.onRowSelecting) {
            gridRef?.current.onRowSelecting(selectingArgs);
            if (selectingArgs.cancel) {
                return;
            } // If canceled, don't proceed with deselection
        }
        clearRowSelection();
        if (gridRef?.current.selectionSettings.type !== 'Single') {
            for (const rowIdx of selectableRowIndex) {
                updateRowSelection(gridRef?.current.getRowByIndex(rowIdx), rowIdx);
                updateRowProps(rowIndex);
            }
        }
        else {
            updateRowSelection(gridRef?.current.getRowByIndex(rowIndex), rowIndex);
            updateRowProps(rowIndex);
        }
        const selectedArgs = {
            cancel: false,
            rowIndexes: selectableRowIndex, row: selectedRows, rowIndex: rowIndex, target: activeTarget.current,
            previousRow: gridRef?.current.getRows()[parseInt(prevRowIndex?.current?.toString(), 10)],
            previousRowIndex: prevRowIndex?.current, data: getSelectedRecords()
        };
        if (isRowSelected?.current && gridRef?.current.onRowSelected) {
            gridRef?.current.onRowSelected(selectedArgs);
        }
    }, [gridRef, selectedRowIndexes?.current, selectedRecords?.current]);
    /**
     * Selects a range of rows from start and end row indexes.
     *
     * @param  {number} startIndex - Specifies the start row index.
     * @param  {number} endIndex - Specifies the end row index.
     * @returns {void}
     */
    const selectRowByRange = useCallback((startIndex, endIndex) => {
        const indexes = getCollectionFromIndexes(startIndex, endIndex);
        selectRows(indexes);
    }, [getCollectionFromIndexes, selectRows]);
    /**
     * Adds multiple rows to the current selection
     *
     * @param {number[]} rowIndexes - Array of row indexes to select
     * @returns {void}
     */
    const addRowsToSelection = useCallback((rowIndexes) => {
        const indexes = getSelectedRowIndexes().concat(rowIndexes);
        const selectedRow = gridRef?.current.selectionSettings.type !== 'Single' ? gridRef?.current.getRowByIndex(rowIndexes[0]) :
            gridRef?.current.getRowByIndex(rowIndexes[rowIndexes.length - 1]);
        const selectedRows = [];
        const selectedData = [];
        if (isMultiCtrlRequest?.current) {
            selectedDataUpdate(selectedData, selectedRows, rowIndexes);
        }
        // Process each row index for multi-selection
        for (const rowIndex of rowIndexes) {
            const rowObj = getRowObj(rowIndex);
            const isUnSelected = selectedRowIndexes?.current.indexOf(rowIndex) > -1;
            if (isUnSelected && isMultiCtrlRequest?.current) {
                const rowDeselectingArgs = {
                    data: rowObj.data,
                    rowIndex: rowIndex,
                    row: selectedRow,
                    target: activeTarget.current,
                    cancel: false
                };
                // Trigger the onRowDeselecting event
                if (gridRef?.current.onRowDeselecting) {
                    gridRef?.current.onRowDeselecting(rowDeselectingArgs);
                    if (rowDeselectingArgs.cancel) {
                        return;
                    }
                }
                // Remove selection
                selectedRowIndexes?.current.splice(selectedRowIndexes?.current.indexOf(rowIndex), 1);
                selectedRecords?.current.splice(selectedRecords?.current.indexOf(selectedRow), 1);
                selectedRow.removeAttribute('aria-selected');
                addRemoveSelectionClasses(selectedRow, false);
                // Trigger the onRowDeselected event
                if (gridRef?.current.onRowDeselected) {
                    const rowDeselectedArgs = {
                        data: rowObj.data,
                        rowIndex: rowIndex,
                        row: selectedRow,
                        target: activeTarget.current,
                        cancel: false
                    };
                    gridRef?.current.onRowDeselected(rowDeselectedArgs);
                }
            }
            else if (!isUnSelected) {
                // Create arguments for the selecting event
                const rowSelectArgs = {
                    data: selectedData.length ? selectedData : rowObj.data,
                    rowIndex: rowIndex,
                    row: selectedRows.length ? selectedRows : selectedRow,
                    target: activeTarget.current,
                    previousRow: gridRef?.current.getRows()[parseInt(prevRowIndex?.current?.toString(), 10)],
                    previousRowIndex: prevRowIndex?.current,
                    rowIndexes: indexes,
                    cancel: false
                };
                // Trigger the onRowSelecting event
                if (gridRef?.current.onRowSelecting) {
                    gridRef?.current.onRowSelecting(rowSelectArgs);
                    if (rowSelectArgs.cancel) {
                        return;
                    }
                }
                if (gridRef?.current.selectionSettings.type === 'Single') {
                    clearRowSelection();
                }
                updateRowSelection(selectedRow, rowIndex);
                // Trigger the onRowSelected event
                if (gridRef?.current.onRowSelected) {
                    gridRef?.current.onRowSelected(rowSelectArgs);
                }
                updateRowProps(rowIndex);
            }
        }
    }, [gridRef?.current, selectedRowIndexes?.current, selectedRecords?.current, prevRowIndex?.current,
        updateRowSelection, addRemoveSelectionClasses]);
    /**
     * Selects a row by the given index.
     *
     * @param  {number} rowIndex - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @returns {void}
     */
    const selectRow = useCallback((rowIndex, isToggle) => {
        if (!gridRef?.current || rowIndex < 0) {
            return;
        }
        const selectedRow = gridRef?.current.getRowByIndex(rowIndex);
        const rowData = gridRef?.current.currentViewData?.[parseInt(rowIndex.toString(), 10)];
        const selectData = getRowObj(rowIndex).data;
        if (gridRef?.current.selectionSettings.mode !== 'Row' || !selectedRow || !rowData) {
            return;
        }
        if (!isToggle || !selectedRowIndexes?.current.length) {
            isToggle = false;
        }
        else {
            if (gridRef?.current?.selectionSettings?.type === 'Single' || (selectedRowIndexes?.current.length === 1 && gridRef?.current?.selectionSettings?.type === 'Multiple')) {
                selectedRowIndexes?.current.forEach((index) => {
                    isToggle = index === rowIndex ? true : false;
                });
            }
            else {
                isToggle = false;
            }
        }
        if (!isToggle) {
            const args = {
                data: selectData,
                rowIndex: rowIndex,
                isCtrlPressed: isMultiCtrlRequest?.current,
                isShiftPressed: isMultiShiftRequest?.current,
                row: selectedRow,
                previousRow: gridRef?.current.getRowByIndex(prevRowIndex?.current),
                previousRowIndex: prevRowIndex?.current,
                target: activeTarget.current,
                cancel: false
            };
            if (gridRef?.current.onRowSelecting) {
                gridRef?.current.onRowSelecting(args);
                if (args.cancel) {
                    return;
                }
            }
            if (selectedRowIndexes?.current.length) {
                clearRowSelection();
            }
            updateRowSelection(selectedRow, rowIndex);
            if (gridRef?.current.onRowSelected) {
                const args = { data: selectData, rowIndex: rowIndex, row: selectedRow, cancel: false };
                gridRef?.current.onRowSelected(args);
            }
        }
        else {
            const isRowSelected = selectedRow.hasAttribute('aria-selected');
            if (isRowSelected) {
                clearRowSelection();
            }
            else {
                updateRowSelection(selectedRow, rowIndex);
            }
        }
        updateRowProps(rowIndex);
    }, [gridRef, updateRowSelection, addRemoveSelectionClasses, updateRowProps, selectedRowIndexes?.current]);
    const rowCellSelectionHandler = useCallback((rowIndex) => {
        if ((!isMultiCtrlRequest?.current && !isMultiShiftRequest?.current) || gridRef?.current.selectionSettings.type === 'Single') {
            selectRow(rowIndex, true);
        }
        else if (isMultiShiftRequest?.current) {
            if (!closest(activeTarget.current, '.e-rowcell').classList.contains('e-chkbox')) {
                selectRowByRange(isUndefined(prevRowIndex?.current) ? rowIndex : prevRowIndex?.current, rowIndex);
            }
            else {
                addRowsToSelection([rowIndex]);
            }
        }
        else {
            addRowsToSelection([rowIndex]);
        }
    }, [gridRef, selectRow, addRowsToSelection, selectRowByRange]);
    /**
     * Handle grid-level click event
     *
     * @param {React.MouseEvent} event - Mouse event
     * @returns {void}
     */
    const handleGridClick = useCallback((event) => {
        activeTarget.current = event.target;
        isMultiShiftRequest.current = event.shiftKey;
        isMultiCtrlRequest.current = event.ctrlKey;
        if (gridRef?.current?.allowSelection && event.target.parentElement.classList.contains('e-row')) {
            const rowIndex = parseInt(event.target.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            rowCellSelectionHandler(rowIndex);
        }
        isMultiCtrlRequest.current = false;
        isMultiShiftRequest.current = false;
    }, [gridRef]);
    return {
        clearRowSelection,
        selectRow,
        getSelectedRowIndexes,
        getSelectedRecords,
        handleGridClick,
        selectRows,
        selectRowByRange,
        addRowsToSelection,
        get selectedRowIndexes() { return selectedRowIndexes.current; },
        get selectedRecords() { return selectedRecords.current; },
        get activeTarget() { return activeTarget.current; }
    };
};
