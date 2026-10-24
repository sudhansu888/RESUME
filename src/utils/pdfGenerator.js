import React from 'react';
import { formatResumeFilename } from './roleAdapter';

/**
 * Generates an ATS-compliant PDF with true selectable text directly in the browser
 * and triggers immediate download without opening the print dialog.
 * Dynamically imports @react-pdf/renderer on-demand to keep initial bundle size lean.
 * 
 * @param {Object} adaptedResume - Role-adapted resume object from roleAdapter.js
 * @returns {Promise<{ success: boolean, fileName: string }>}
 */
export async function downloadSelectablePdf(adaptedResume) {
  if (!adaptedResume || !adaptedResume.profile) {
    throw new Error('Valid resume data is required for PDF generation.');
  }

  const fileName = formatResumeFilename(
    adaptedResume.profile.name,
    adaptedResume.fileSlug
  );

  let blobUrl = null;

  try {
    // Dynamic import to keep initial page bundle under 150kB
    const [{ pdf }, { default: ResumePdfDocument }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('../components/ResumePdfDocument')
    ]);

    // Render the React PDF document to a Blob using React.createElement
    const docElement = React.createElement(ResumePdfDocument, { resume: adaptedResume });
    const pdfInstance = pdf(docElement);
    const blob = await pdfInstance.toBlob();

    if (!blob) {
      throw new Error('Failed to generate PDF blob.');
    }

    // Create a temporary object URL
    blobUrl = URL.createObjectURL(blob);

    // Create an invisible anchor tag to trigger download
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = fileName;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    return {
      success: true,
      fileName,
    };
  } catch (error) {
    console.error('[PDF Generator Error]:', error);
    throw new Error(
      error?.message || 'An unexpected error occurred while compiling the PDF document.'
    );
  } finally {
    // Safely revoke object URL after browser download has triggered
    if (blobUrl) {
      setTimeout(() => {
        try {
          URL.revokeObjectURL(blobUrl);
        } catch {
          // Ignore revoke errors on teardown
        }
      }, 3000);
    }
  }
}
