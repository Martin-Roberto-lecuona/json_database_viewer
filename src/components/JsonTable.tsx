import React from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';

interface Props {
  data: any[];
}

export const JsonTable: React.FC<Props> = ({ data }) => {
  const columns: ColumnDef<any>[] = data.length > 0
    ? Object.keys(data[0]).map((key) => ({ accessorKey: key, header: key }))
    : [];

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div
      style={{
        overflowX: 'auto',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '12px',
        maxWidth: '100%',
      }}
    >
      <table
        style={{
          minWidth: '800px',
          borderCollapse: 'collapse',
          width: '100%',
          fontSize: '14px',
          textAlign: 'left',
        }}
      >
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  style={{
                    border: '1px solid #666',
                    padding: '8px 12px',
                    backgroundColor: '#c01c7b',
                    color: '#fff',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} style={{ cursor: 'default', transition: 'background-color 0.2s' }}>
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px 12px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
