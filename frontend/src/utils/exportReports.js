import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { calculateGrade } from './grading';
import { getEthiopianMonthName } from './ethiopianCalendar';

// Export to PDF
export const exportToPDF = (reports, month, year, language = 'en') => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(language === 'am' ? 'የወርሃዊ እድገት ሪፖርት' : 'Monthly Progress Report', 14, 20);
  
  // Month and Year
  doc.setFontSize(12);
  const monthName = getEthiopianMonthName(month, language === 'am' ? 'amharic' : 'english');
  doc.text(`${language === 'am' ? 'ወር' : 'Month'}: ${monthName} ${year}`, 14, 30);
  doc.text(`${language === 'am' ? 'ቀን' : 'Date'}: ${new Date().toLocaleDateString()}`, 14, 37);
  
  // Table
  const tableData = reports.map(report => {
    const gradeInfo = calculateGrade(report.progress_percentage || 0);
    return [
      report.branch_name,
      report.target_amount?.toLocaleString() || '0',
      report.achieved_amount?.toLocaleString() || '0',
      `${(report.progress_percentage || 0).toFixed(1)}%`,
      gradeInfo.grade,
      report.status === 'submitted' ? (language === 'am' ? 'ገብቷል' : 'Submitted') :
      report.status === 'late' ? (language === 'am' ? 'ዘግይቷል' : 'Late') :
      (language === 'am' ? 'በመጠባበቅ ላይ' : 'Pending')
    ];
  });
  
  doc.autoTable({
    startY: 45,
    head: [[
      language === 'am' ? 'ቅርንጫፍ' : 'Branch',
      language === 'am' ? 'ዒላማ' : 'Target',
      language === 'am' ? 'የተሳካ' : 'Achieved',
      language === 'am' ? 'እድገት' : 'Progress',
      language === 'am' ? 'ደረጃ' : 'Grade',
      language === 'am' ? 'ሁኔታ' : 'Status'
    ]],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [124, 58, 237] },
    styles: { fontSize: 10 }
  });
  
  // Summary
  const totalTarget = reports.reduce((sum, r) => sum + (r.target_amount || 0), 0);
  const totalAchieved = reports.reduce((sum, r) => sum + (r.achieved_amount || 0), 0);
  const avgProgress = reports.reduce((sum, r) => sum + (r.progress_percentage || 0), 0) / reports.length;
  
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.text(language === 'am' ? 'ማጠቃለያ:' : 'Summary:', 14, finalY);
  doc.setFontSize(10);
  doc.text(`${language === 'am' ? 'ጠቅላላ ዒላማ' : 'Total Target'}: ${totalTarget.toLocaleString()}`, 14, finalY + 7);
  doc.text(`${language === 'am' ? 'ጠቅላላ የተሳካ' : 'Total Achieved'}: ${totalAchieved.toLocaleString()}`, 14, finalY + 14);
  doc.text(`${language === 'am' ? 'አማካይ እድገት' : 'Average Progress'}: ${avgProgress.toFixed(1)}%`, 14, finalY + 21);
  
  // Save
  doc.save(`monthly-report-${monthName}-${year}.pdf`);
};

// Export to Excel
export const exportToExcel = (reports, month, year, language = 'en') => {
  const monthName = getEthiopianMonthName(month, language === 'am' ? 'amharic' : 'english');
  
  const data = reports.map(report => {
    const gradeInfo = calculateGrade(report.progress_percentage || 0);
    return {
      [language === 'am' ? 'ቅርንጫፍ' : 'Branch']: report.branch_name,
      [language === 'am' ? 'ዒላማ' : 'Target']: report.target_amount || 0,
      [language === 'am' ? 'የተሳካ' : 'Achieved']: report.achieved_amount || 0,
      [language === 'am' ? 'እድገት %' : 'Progress %']: (report.progress_percentage || 0).toFixed(1),
      [language === 'am' ? 'ደረጃ' : 'Grade']: gradeInfo.grade,
      [language === 'am' ? 'ሁኔታ' : 'Status']: 
        report.status === 'submitted' ? (language === 'am' ? 'ገብቷል' : 'Submitted') :
        report.status === 'late' ? (language === 'am' ? 'ዘግይቷል' : 'Late') :
        (language === 'am' ? 'በመጠባበቅ ላይ' : 'Pending'),
      [language === 'am' ? 'የገባበት ቀን' : 'Submitted Date']: 
        report.submitted_at ? new Date(report.submitted_at).toLocaleString() : '-'
    };
  });
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reports');
  
  XLSX.writeFile(wb, `monthly-report-${monthName}-${year}.xlsx`);
};

// Export to Word
export const exportToWord = async (reports, month, year, language = 'en') => {
  const monthName = getEthiopianMonthName(month, language === 'am' ? 'amharic' : 'english');
  
  const tableRows = [
    // Header row
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: language === 'am' ? 'ቅርንጫፍ' : 'Branch', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: language === 'am' ? 'ዒላማ' : 'Target', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: language === 'am' ? 'የተሳካ' : 'Achieved', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: language === 'am' ? 'እድገት' : 'Progress', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: language === 'am' ? 'ደረጃ' : 'Grade', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: language === 'am' ? 'ሁኔታ' : 'Status', bold: true })] })
      ]
    }),
    // Data rows
    ...reports.map(report => {
      const gradeInfo = calculateGrade(report.progress_percentage || 0);
      return new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(report.branch_name)] }),
          new TableCell({ children: [new Paragraph((report.target_amount || 0).toLocaleString())] }),
          new TableCell({ children: [new Paragraph((report.achieved_amount || 0).toLocaleString())] }),
          new TableCell({ children: [new Paragraph(`${(report.progress_percentage || 0).toFixed(1)}%`)] }),
          new TableCell({ children: [new Paragraph(gradeInfo.grade)] }),
          new TableCell({ children: [new Paragraph(
            report.status === 'submitted' ? (language === 'am' ? 'ገብቷል' : 'Submitted') :
            report.status === 'late' ? (language === 'am' ? 'ዘግይቷል' : 'Late') :
            (language === 'am' ? 'በመጠባበቅ ላይ' : 'Pending')
          )] })
        ]
      });
    })
  ];
  
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          text: language === 'am' ? 'የወርሃዊ እድገት ሪፖርት' : 'Monthly Progress Report',
          heading: 'Heading1',
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          text: `${language === 'am' ? 'ወር' : 'Month'}: ${monthName} ${year}`,
          spacing: { before: 200, after: 200 }
        }),
        new Paragraph({
          text: `${language === 'am' ? 'ቀን' : 'Date'}: ${new Date().toLocaleDateString()}`,
          spacing: { after: 400 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows
        }),
        new Paragraph({
          text: language === 'am' ? 'ማጠቃለያ' : 'Summary',
          heading: 'Heading2',
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          text: `${language === 'am' ? 'ጠቅላላ ዒላማ' : 'Total Target'}: ${reports.reduce((sum, r) => sum + (r.target_amount || 0), 0).toLocaleString()}`
        }),
        new Paragraph({
          text: `${language === 'am' ? 'ጠቅላላ የተሳካ' : 'Total Achieved'}: ${reports.reduce((sum, r) => sum + (r.achieved_amount || 0), 0).toLocaleString()}`
        }),
        new Paragraph({
          text: `${language === 'am' ? 'አማካይ እድገት' : 'Average Progress'}: ${(reports.reduce((sum, r) => sum + (r.progress_percentage || 0), 0) / reports.length).toFixed(1)}%`
        })
      ]
    }]
  });
  
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `monthly-report-${monthName}-${year}.docx`);
};
