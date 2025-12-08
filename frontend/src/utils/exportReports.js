import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { calculateGrade } from './grading';
import { getEthiopianMonthName } from './ethiopianCalendar';

// Export to PDF
export const exportToPDF = (reports, month, year, language = 'en') => {
  try {
    console.log('Exporting to PDF:', { reports, month, year, language });
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
    const gradeInfo = calculateGrade(Number(report.progress_percentage) || 0);
    return [
      report.branch_name || '',
      (Number(report.target_amount) || 0).toLocaleString(),
      (Number(report.achieved_amount) || 0).toLocaleString(),
      `${(Number(report.progress_percentage) || 0).toFixed(1)}%`,
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
  
  // Add new page for charts
  doc.addPage();
  
  // Chart Title
  doc.setFontSize(16);
  doc.text(language === 'am' ? 'የእድገት ግራፍ' : 'Progress Chart', 14, 20);
  
  // Sort reports by progress for better visualization
  const sortedReports = [...reports].sort((a, b) => 
    (Number(b.progress_percentage) || 0) - (Number(a.progress_percentage) || 0)
  );
  
  // Bar Chart - Branch Progress
  const chartStartY = 35;
  const chartHeight = 120;
  const chartWidth = 180;
  const barWidth = Math.min(15, chartWidth / sortedReports.length - 2);
  const maxProgress = 100;
  
  // Draw axes
  doc.setDrawColor(100);
  doc.setLineWidth(0.5);
  doc.line(14, chartStartY + chartHeight, 14 + chartWidth, chartStartY + chartHeight); // X-axis
  doc.line(14, chartStartY, 14, chartStartY + chartHeight); // Y-axis
  
  // Y-axis labels
  doc.setFontSize(8);
  doc.setTextColor(100);
  for (let i = 0; i <= 5; i++) {
    const y = chartStartY + chartHeight - (i * chartHeight / 5);
    const label = (i * 20).toString() + '%';
    doc.text(label, 8, y + 2, { align: 'right' });
    doc.setDrawColor(200);
    doc.line(14, y, 14 + chartWidth, y); // Grid lines
  }
  
  // Draw bars
  sortedReports.forEach((report, index) => {
    const progress = Number(report.progress_percentage) || 0;
    const barHeight = (progress / maxProgress) * chartHeight;
    const x = 14 + (index * (barWidth + 2)) + 5;
    const y = chartStartY + chartHeight - barHeight;
    
    // Color based on grade
    const gradeInfo = calculateGrade(progress);
    let color;
    if (progress >= 90) color = [16, 185, 129]; // Green
    else if (progress >= 75) color = [59, 130, 246]; // Blue
    else if (progress >= 60) color = [251, 146, 60]; // Orange
    else color = [239, 68, 68]; // Red
    
    doc.setFillColor(...color);
    doc.rect(x, y, barWidth, barHeight, 'F');
    
    // Branch name (rotated)
    doc.setFontSize(7);
    doc.setTextColor(0);
    doc.text(report.branch_name || '', x + barWidth/2, chartStartY + chartHeight + 5, {
      angle: 45,
      maxWidth: 30
    });
    
    // Progress value on top of bar
    doc.setFontSize(7);
    doc.text(`${progress.toFixed(0)}%`, x + barWidth/2, y - 2, { align: 'center' });
  });
  
  // Grade Distribution Pie Chart
  const pieY = chartStartY + chartHeight + 40;
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text(language === 'am' ? 'የደረጃ ስርጭት' : 'Grade Distribution', 14, pieY);
  
  // Calculate grade distribution
  const gradeDistribution = {};
  reports.forEach(report => {
    const gradeInfo = calculateGrade(Number(report.progress_percentage) || 0);
    gradeDistribution[gradeInfo.grade] = (gradeDistribution[gradeInfo.grade] || 0) + 1;
  });
  
  // Draw pie chart
  const pieX = 105;
  const pieYCenter = pieY + 30;
  const pieRadius = 25;
  let startAngle = 0;
  const colors = {
    'A+': [16, 185, 129], 'A': [34, 197, 94], 'B+': [59, 130, 246], 'B': [96, 165, 250],
    'C+': [251, 146, 60], 'C': [251, 191, 36], 'D': [239, 68, 68], 'F': [220, 38, 38]
  };
  
  Object.entries(gradeDistribution).forEach(([grade, count]) => {
    const angle = (count / reports.length) * 2 * Math.PI;
    const color = colors[grade] || [150, 150, 150];
    
    doc.setFillColor(...color);
    
    // Draw pie slice
    const endAngle = startAngle + angle;
    doc.circle(pieX, pieYCenter, pieRadius, 'F');
    
    // Draw wedge (simplified - just showing concept)
    const midAngle = startAngle + angle / 2;
    const labelX = pieX + (pieRadius + 15) * Math.cos(midAngle);
    const labelY = pieYCenter + (pieRadius + 15) * Math.sin(midAngle);
    
    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.text(`${grade}: ${count}`, labelX, labelY, { align: 'center' });
    
    startAngle = endAngle;
  });
  
  // Summary on new page or below
  const summaryY = pieY + 70;
  const totalTarget = reports.reduce((sum, r) => sum + (Number(r.target_amount) || 0), 0);
  const totalAchieved = reports.reduce((sum, r) => sum + (Number(r.achieved_amount) || 0), 0);
  const avgProgress = reports.length > 0 
    ? reports.reduce((sum, r) => sum + (Number(r.progress_percentage) || 0), 0) / reports.length 
    : 0;
  
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(language === 'am' ? 'ማጠቃለያ:' : 'Summary:', 14, summaryY);
  doc.setFontSize(10);
  doc.text(`${language === 'am' ? 'ጠቅላላ ዒላማ' : 'Total Target'}: ${totalTarget.toLocaleString()}`, 14, summaryY + 7);
  doc.text(`${language === 'am' ? 'ጠቅላላ የተሳካ' : 'Total Achieved'}: ${totalAchieved.toLocaleString()}`, 14, summaryY + 14);
  doc.text(`${language === 'am' ? 'አማካይ እድገት' : 'Average Progress'}: ${(Number(avgProgress) || 0).toFixed(1)}%`, 14, summaryY + 21);
  
  // Save
    doc.save(`monthly-report-${monthName}-${year}.pdf`);
    console.log('PDF exported successfully');
  } catch (error) {
    console.error('Error exporting PDF:', error);
    alert(`Failed to export PDF: ${error.message}`);
  }
};

// Export to Excel
export const exportToExcel = (reports, month, year, language = 'en') => {
  try {
    console.log('Exporting to Excel:', { reports, month, year, language });
    const monthName = getEthiopianMonthName(month, language === 'am' ? 'amharic' : 'english');
  
  const data = reports.map(report => {
    const gradeInfo = calculateGrade(Number(report.progress_percentage) || 0);
    return {
      [language === 'am' ? 'ቅርንጫፍ' : 'Branch']: report.branch_name || '',
      [language === 'am' ? 'ዒላማ' : 'Target']: Number(report.target_amount) || 0,
      [language === 'am' ? 'የተሳካ' : 'Achieved']: Number(report.achieved_amount) || 0,
      [language === 'am' ? 'እድገት %' : 'Progress %']: (Number(report.progress_percentage) || 0).toFixed(1),
      [language === 'am' ? 'ደረጃ' : 'Grade']: gradeInfo.grade,
      [language === 'am' ? 'ሁኔታ' : 'Status']: 
        report.status === 'submitted' ? (language === 'am' ? 'ገብቷል' : 'Submitted') :
        report.status === 'late' ? (language === 'am' ? 'ዘግይቷል' : 'Late') :
        (language === 'am' ? 'በመጠባበቅ ላይ' : 'Pending'),
      [language === 'am' ? 'የገባበት ቀን' : 'Submitted Date']: 
        report.submitted_at ? new Date(report.submitted_at).toLocaleString() : '-'
    };
  });
  
  // Create main reports sheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    
    // Create chart data sheet (sorted by progress)
    const chartData = reports
      .map(report => ({
        [language === 'am' ? 'ቅርንጫፍ' : 'Branch']: report.branch_name || '',
        [language === 'am' ? 'እድገት %' : 'Progress %']: Number(report.progress_percentage) || 0,
        [language === 'am' ? 'ደረጃ' : 'Grade']: calculateGrade(Number(report.progress_percentage) || 0).grade
      }))
      .sort((a, b) => b[language === 'am' ? 'እድገት %' : 'Progress %'] - a[language === 'am' ? 'እድገት %' : 'Progress %']);
    
    const wsChart = XLSX.utils.json_to_sheet(chartData);
    XLSX.utils.book_append_sheet(wb, wsChart, 'Chart Data');
    
    // Create summary sheet
    const totalTarget = reports.reduce((sum, r) => sum + (Number(r.target_amount) || 0), 0);
    const totalAchieved = reports.reduce((sum, r) => sum + (Number(r.achieved_amount) || 0), 0);
    const avgProgress = reports.length > 0 
      ? reports.reduce((sum, r) => sum + (Number(r.progress_percentage) || 0), 0) / reports.length 
      : 0;
    
    const summaryData = [
      { [language === 'am' ? 'መለኪያ' : 'Metric']: language === 'am' ? 'ጠቅላላ ዒላማ' : 'Total Target', [language === 'am' ? 'ዋጋ' : 'Value']: totalTarget },
      { [language === 'am' ? 'መለኪያ' : 'Metric']: language === 'am' ? 'ጠቅላላ የተሳካ' : 'Total Achieved', [language === 'am' ? 'ዋጋ' : 'Value']: totalAchieved },
      { [language === 'am' ? 'መለኪያ' : 'Metric']: language === 'am' ? 'አማካይ እድገት %' : 'Average Progress %', [language === 'am' ? 'ዋጋ' : 'Value']: Number(avgProgress).toFixed(1) },
      { [language === 'am' ? 'መለኪያ' : 'Metric']: language === 'am' ? 'ጠቅላላ ሪፖርቶች' : 'Total Reports', [language === 'am' ? 'ዋጋ' : 'Value']: reports.length }
    ];
    
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
    
    XLSX.writeFile(wb, `monthly-report-${monthName}-${year}.xlsx`);
    console.log('Excel exported successfully');
  } catch (error) {
    console.error('Error exporting Excel:', error);
    alert(`Failed to export Excel: ${error.message}`);
  }
};

// Export to Word
export const exportToWord = async (reports, month, year, language = 'en') => {
  try {
    console.log('Exporting to Word:', { reports, month, year, language });
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
      const gradeInfo = calculateGrade(Number(report.progress_percentage) || 0);
      return new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(report.branch_name || '')] }),
          new TableCell({ children: [new Paragraph((Number(report.target_amount) || 0).toLocaleString())] }),
          new TableCell({ children: [new Paragraph((Number(report.achieved_amount) || 0).toLocaleString())] }),
          new TableCell({ children: [new Paragraph(`${(Number(report.progress_percentage) || 0).toFixed(1)}%`)] }),
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
          text: `${language === 'am' ? 'ጠቅላላ ዒላማ' : 'Total Target'}: ${reports.reduce((sum, r) => sum + (Number(r.target_amount) || 0), 0).toLocaleString()}`
        }),
        new Paragraph({
          text: `${language === 'am' ? 'ጠቅላላ የተሳካ' : 'Total Achieved'}: ${reports.reduce((sum, r) => sum + (Number(r.achieved_amount) || 0), 0).toLocaleString()}`
        }),
        new Paragraph({
          text: `${language === 'am' ? 'አማካይ እድገት' : 'Average Progress'}: ${(reports.length > 0 ? reports.reduce((sum, r) => sum + (Number(r.progress_percentage) || 0), 0) / reports.length : 0).toFixed(1)}%`
        })
      ]
    }]
  });
  
  const blob = await Packer.toBlob(doc);
    saveAs(blob, `monthly-report-${monthName}-${year}.docx`);
    console.log('Word exported successfully');
  } catch (error) {
    console.error('Error exporting Word:', error);
    alert(`Failed to export Word: ${error.message}`);
  }
};
