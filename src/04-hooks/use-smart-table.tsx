import { useState, useEffect } from "react";

type Filter = () => boolean;

// different kinds of columns to extend.
interface Column {
  header: string;
  accessor: string;
  isSortable?: boolean;
  isHidden?: boolean;
  isPinned?: boolean;
  format?: (value: any) => string | number | JSX.Element;
  width?: number;
  align?: "start" | "center" | "end";
}

interface ColumnComponent extends Column {
  renderComponent?: (row: any) => JSX.Element;
  renderHeaderComponent?: () => JSX.Element;
}

const checkIfFormatting = (row: any, col: Column) => {
  if (col.format) {
    return col.format(row[col.accessor]);
  }
  return row[col.accessor];
};

const filterByColumn = (data: any, filter: string[], column: string) => {
  const filteredRows = filter.forEach((f) => {
    return data.filter((row: any) => {
      return row[column].toString().toLowerCase().includes(f.toLowerCase());
    });
  });
};

const useSmartTable = (
  data: any,
  columns: Column[],
  pageSize?: number,
  initPage?: number
) => {
  const [rowsState, setRowsState] = useState([]);
  const [columnState, setColumnState] = useState<Column[]>(columns);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState<any>([]);

  const handleSelectRows = (id: string) => {
    const selected = selectedRows.includes(id);
    if (selected) {
      setSelectedRows(selectedRows.filter((row: any) => row !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handlePagination = (itemsByPage: number) => {
    const pages =
      data.lentgh % itemsByPage === 0
        ? Math.ceil(data.length / itemsByPage)
        : Math.ceil(data.length / itemsByPage) - 1;
    const start = itemsByPage * currentPage;
    const end = start + itemsByPage;
    const paginatedData = data.slice(start, end);
    setRowsState(paginatedData);
    setPages(pages);
  };

  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  const setRows = (rows: any) => {
    console.log("rows muestramelas", rows);
    setRowsState(rows);
  };

  return {
    smartRows: rowsState,
    smartColumns: columnState,
    updateCols: setColumnState,
    filterByColumn,
    initData: data,
    handlePagination,
    pages,
    currentPage,
    setPage,
    setRows,
    selectedRows,
    selectRows: handleSelectRows,
  };
};

export default useSmartTable;
