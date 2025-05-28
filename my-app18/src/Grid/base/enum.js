/**
 * Enum defining various types of cells in the grid
 *
 * @hidden
 */
export var CellType;
(function (CellType) {
    /**  Defines CellType as Data */
    CellType[CellType["Data"] = 0] = "Data";
    /**  Defines CellType as Header */
    CellType[CellType["Header"] = 1] = "Header";
    /**  Defines CellType as Summary */
    CellType[CellType["Summary"] = 2] = "Summary";
    /**  Defines CellType as GroupSummary */
    CellType[CellType["GroupSummary"] = 3] = "GroupSummary";
    /**  Defines CellType as CaptionSummary */
    CellType[CellType["CaptionSummary"] = 4] = "CaptionSummary";
    /**  Defines CellType as Filter */
    CellType[CellType["Filter"] = 5] = "Filter";
    /**  Defines CellType as Indent */
    CellType[CellType["Indent"] = 6] = "Indent";
    /**  Defines CellType as GroupCaption */
    CellType[CellType["GroupCaption"] = 7] = "GroupCaption";
    /**  Defines CellType as GroupCaptionEmpty */
    CellType[CellType["GroupCaptionEmpty"] = 8] = "GroupCaptionEmpty";
    /**  Defines CellType as Expand */
    CellType[CellType["Expand"] = 9] = "Expand";
    /**  Defines CellType as HeaderIndent */
    CellType[CellType["HeaderIndent"] = 10] = "HeaderIndent";
    /**  Defines CellType as StackedHeader */
    CellType[CellType["StackedHeader"] = 11] = "StackedHeader";
    /**  Defines CellType as DetailHeader */
    CellType[CellType["DetailHeader"] = 12] = "DetailHeader";
    /**  Defines CellType as DetailExpand */
    CellType[CellType["DetailExpand"] = 13] = "DetailExpand";
    /**  Defines CellType as CommandColumn */
    CellType[CellType["CommandColumn"] = 14] = "CommandColumn";
    /**  Defines CellType as DetailFooterIntent */
    CellType[CellType["DetailFooterIntent"] = 15] = "DetailFooterIntent";
    /**  Defines CellType as RowDrag */
    CellType[CellType["RowDragIcon"] = 16] = "RowDragIcon";
    /**  Defines CellType as RowDragHeader */
    CellType[CellType["RowDragHIcon"] = 17] = "RowDragHIcon";
})(CellType || (CellType = {}));
/**
 * Defines types of Render
 *
 * @hidden
 */
export var RenderType;
(function (RenderType) {
    /**  Defines RenderType as Header */
    RenderType[RenderType["Header"] = 0] = "Header";
    /**  Defines RenderType as Content */
    RenderType[RenderType["Content"] = 1] = "Content";
    /**  Defines RenderType as Summary */
    RenderType[RenderType["Summary"] = 2] = "Summary";
})(RenderType || (RenderType = {}));
