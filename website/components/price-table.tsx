import { pricingRows } from "@/lib/site-data";

export function PriceTable() {
  return (
    <table className="price-table">
      <thead>
        <tr>
          <th>Repair</th>
          <th>Estimated price</th>
          <th>Estimated time</th>
          <th>Warranty</th>
        </tr>
      </thead>
      <tbody>
        {pricingRows.map((row) => (
          <tr key={row[0]}>
            {row.map((cell) => (
              <td key={cell}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
