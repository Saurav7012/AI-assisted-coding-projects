// downloadPDF.js — Takes a PDF Blob and triggers a browser download

export function downloadPDF(blob, filename) {
    // Create a temporary URL pointing to the blob data
    const url = window.URL.createObjectURL(blob);

    //Create an invisible <a> tag
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // Add to DOM, click it, then immediately remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the blob URL from memory
    window.URL.revokeObjectURL(url);

}