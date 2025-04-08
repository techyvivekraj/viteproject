import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], fileName: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const exportToPDF = (data: any[], fileName: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(fileName, 20, 20);
  
  // Convert data to table format
  const tableData = data.map(Object.values);
  const headers = Object.keys(data[0]);
  
  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: 30,
  });

  doc.save(`${fileName}.pdf`);
};