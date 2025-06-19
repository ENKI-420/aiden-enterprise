import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export a specific DOM element to a paginated, high-resolution PDF.
 * @param selector A CSS selector that matches the element you want to export. Defaults to `#export-target`.
 * @param filename  Optional file name for the generated PDF.
 */
export const exportPDF = async (
  selector: string = '#export-target',
  filename: string = 'Executive_Conference_Summary.pdf'
) => {
  const element = document.querySelector(selector) as HTMLElement | null;
  if (!element) {
    console.error(`❌ Element not found for selector: ${selector}`);
    return;
  }

  // Temporarily lock scrolling while the screenshot is captured
  const originalOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  try {
    const scale = 2; // Higher scale = higher resolution
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      scrollY: -window.scrollY, // Freeze the viewport so fixed elements render correctly
    });

    const imgData = canvas.toDataURL('image/png');
    const imgProps = {
      width: 210, // A4 width in mm
      height: (canvas.height * 210) / canvas.width,
    };

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageHeight = 297; // A4 height in mm
    let y = 0;

    while (y < imgProps.height) {
      pdf.addImage(imgData, 'PNG', 0, -y, imgProps.width, imgProps.height);
      if (y + pageHeight < imgProps.height) pdf.addPage();
      y += pageHeight;
    }

    pdf.save(filename);
    console.log(`✅ PDF exported as ${filename}`);
  } catch (error) {
    console.error('❌ Failed to export PDF:', error);
  } finally {
    document.body.style.overflow = originalOverflow;
  }
};