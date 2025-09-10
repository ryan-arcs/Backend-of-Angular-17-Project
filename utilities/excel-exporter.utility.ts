import ExcelJS from "exceljs";
import { ListQueryParams } from "../interfaces";
export const exportToExcel = async (data: any[], orderedColumns: string, params: ListQueryParams): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Applications");

  // Parse orderedColumns string → { dbColumn: Label }
  const colMappings = orderedColumns
    .split(",")
    .map((c) => c.split(":"))
    .reduce((acc, [key, label]) => {
      if (key && label) acc[key] = decodeURIComponent(label);
      return acc;
    }, {} as Record<string, string>);

  const colKeys = Object.keys(colMappings);

  // --- Add filters row at the top ---
  let filterText = "";
  if (params.globalSearch) {
    filterText += `global_contains("${params.globalSearch}") `;
  }

  if (params.columnFilters?.length) {
    params.columnFilters.forEach((filter) => {
      filter.conditions.forEach((cond: any) => {
        filterText += `${filter.columnName} ${cond.type}("${cond.searchTags.join(", ")}") `;
      });
    });
  }

  if (filterText) {
    worksheet.addRow([`Filters: ${filterText.trim()}`]);
  } else {
    worksheet.addRow(["Filters: None"]);
  }

  // --- Header Row ---
  const headerRow = worksheet.addRow(["S.No.", ...Object.values(colMappings)]);

  // Style header row
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1F497D" }, // dark blue
    };
    cell.font = { color: { argb: "FFFFFF" }, bold: true }; // white text
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });


  data.forEach((row, index) => {
    const rowValues = colKeys.map((col) => {
      const val = row[col];

      if (["is_gxp", "is_sox"].includes(col.toLowerCase())) {
        if (val === true || val === 1) return "Yes";
        if (val === false || val === 0) return "No";
      }

      if (Array.isArray(val)) {
        return val
          .map((v: any) => v.fullname_preferred || v.email || JSON.stringify(v))
          .join(", ");
      }
      if (typeof val === "object" && val !== null) {
        return JSON.stringify(val);
      }
      return val ?? "";
    });
    worksheet.addRow([index + 1, ...rowValues]);
  });

  // Enable filter on header row
  worksheet.autoFilter = {
    from: { row: headerRow.number, column: 1 },
    to: { row: headerRow.number, column: colKeys.length + 1  },
  };

  // Resize columns
  worksheet.columns.forEach((col) => {
    col.width = 20;
  });

  worksheet.views = [{ state: "frozen", ySplit: 2 }];
  
  const uint8Array = await workbook.xlsx.writeBuffer();
  return Buffer.from(uint8Array);
};
