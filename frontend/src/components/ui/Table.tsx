interface Column<T> {
  header:    string;
  accessor:  keyof T;
  render?:   (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns:  Column<T>[];
  data:     T[];
  loading?: boolean;
}

const Table = <T extends object>({
  columns,
  data,
  loading = false,
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-pink-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                className="
                  px-6 py-3 text-left text-xs
                  font-semibold text-gray-600
                  uppercase tracking-wider
                "
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-gray-400"
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-gray-400"
              >
                No data found.
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                {columns.map((col) => (
                  <td
                    key={String(col.accessor)}
                    className="px-6 py-4 text-sm text-gray-700"
                  >
                    {col.render
                      ? col.render(row[col.accessor], row)
                      : String(row[col.accessor] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;