// components/assets/AssetList.js
import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid';
import AssetSearchFilter from './AssetSearchFilter';
import Pagination from '../common/Pagination';
import assetService from '../../services/asset.service';

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  // Define columns for the table
  const columns = useMemo(
    () => [
      {
        Header: 'Asset Name',
        accessor: 'asset_name',
      },
      {
        Header: 'Asset Number',
        accessor: 'asset_number',
      },
      {
        Header: 'Assigned Employee',
        accessor: row => row.Employee ? row.Employee.name : 'Unassigned',
      },
      {
        Header: 'Category',
        accessor: row => row.Category ? row.Category.name : 'Uncategorized',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold
            ${value === 'available' ? 'bg-green-100 text-green-800' : 
              value === 'assigned' ? 'bg-blue-100 text-blue-800' :
              value === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        )
      },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleView(row.original.id)}
              className="text-blue-600 hover:text-blue-900"
            >
              View
            </button>
            <button
              onClick={() => handleEdit(row.original.id)}
              className="text-yellow-600 hover:text-yellow-900"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  } = useTable(
    {
      columns,
      data: assets,
      initialState: { pageIndex: 0, pageSize: 10 },
      manualPagination: true,
      pageCount: totalPages,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;

  useEffect(() => {
    fetchAssets();
  }, [pageIndex, pageSize, globalFilter]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await assetService.getAssets({
        page: pageIndex + 1,
        size: pageSize,
        search: globalFilter || '',
      });
      setAssets(response.assets);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    // Navigate to asset details page
    window.location.href = `/assets/${id}`;
  };

  const handleEdit = (id) => {
    // Navigate to asset edit page
    window.location.href = `/assets/edit/${id}`;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await assetService.deleteAsset(id);
        fetchAssets();
      } catch (error) {
        console.error('Error deleting asset:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <AssetSearchFilter
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>

      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ChevronDownIcon className="w-4 h-4 ml-1" />
                          ) : (
                            <ChevronUpIcon className="w-4 h-4 ml-1" />
                          )
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.map(row => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pageIndex + 1}
        totalPages={pageCount}
        onPageChange={(page) => gotoPage(page - 1)}
        onNextPage={nextPage}
        onPrevPage={previousPage}
        canNextPage={canNextPage}
        canPrevPage={canPreviousPage}
        pageSize={pageSize}
        onPageSizeChange={(size) => setPageSize(size)}
      />
    </div>
  );
};

export default AssetList;