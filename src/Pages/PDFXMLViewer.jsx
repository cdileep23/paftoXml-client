import React, { useState, useEffect, useRef } from 'react';
import { Copy, Download, Check, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import XMLViewer from 'react-xml-viewer';

const PDFXMLViewer = ({ pdfUrl, xmlCode, fileName = "document" }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('pdf');
  const [pdfScale, setPdfScale] = useState(1);
  const containerRef = useRef(null);

  // Custom XML theme for dark mode
  const customTheme = {
    attributeKeyColor: '#9CDCFE',
    attributeValueColor: '#CE9178',
    tagColor: '#569CD6',
    textColor: '#D4D4D4',
    backgroundColor: '#1E1E1E',
    commentColor: '#6A9955',
    separatorColor: '#808080',
    declarationColor: '#808080',
    processingInstructionColor: '#808080',
    processingInstructionValueColor: '#CE9178'
  };

  // Handle copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(xmlCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Handle download XML
  const downloadXml = () => {
    const element = document.createElement('a');
    const file = new Blob([xmlCode], {type: 'text/xml'});
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}.xml`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Zoom in PDF
  const zoomIn = () => {
    setPdfScale(prev => Math.min(prev + 0.25, 3));
  };

  // Zoom out PDF
  const zoomOut = () => {
    setPdfScale(prev => Math.max(prev - 0.25, 0.5));
  };

  // Reset zoom
  const resetZoom = () => {
    setPdfScale(1);
  };

  return (
    <div className="w-full p-2 md:p-4 bg-gray-100" ref={containerRef}>
      <h2 className="text-xl font-bold mb-2 md:mb-4">Document Viewer</h2>
      
      {/* Tab switcher */}
      <div className="flex mb-2 border-b md:hidden">
        <button 
          className={`px-4 py-2 ${activeTab === 'pdf' ? 'bg-blue-50 border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('pdf')}
        >
          PDF
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'xml' ? 'bg-blue-50 border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('xml')}
        >
          XML
        </button>
      </div>
      
      {/* Main container */}
      <div className="flex flex-col md:flex-row w-full gap-2 md:gap-4">
        {/* PDF Viewer */}
        <div className={`w-full md:w-1/2 bg-white rounded-lg shadow-md overflow-hidden ${activeTab !== 'pdf' ? 'hidden md:block' : ''}`}>
          <div className="bg-gray-800 text-white p-2 font-medium flex justify-between items-center">
            <span>PDF Document</span>
            {/* PDF controls */}
            <div className="flex space-x-2">
              <button 
                onClick={zoomIn}
                className="p-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button 
                onClick={zoomOut}
                className="p-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <button 
                onClick={resetZoom}
                className="p-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
                title="Reset Zoom"
              >
                <RotateCw size={16} />
              </button>
            </div>
          </div>
          
          {/* PDF Viewer Container with fixed height and mobile optimization */}
          <div className="h-96 md:h-[calc(100vh-300px)] lg:h-[calc(100vh-250px)] overflow-auto bg-gray-100">
            {pdfUrl ? (
              <iframe
                src={`${pdfUrl}#view=FitH&toolbar=0&navpanes=0&statusbar=0&zoom=${pdfScale * 100}`}
                title="PDF Viewer"
                className="w-full h-full border-none"
                loading="lazy"
                style={{ minHeight: '450px' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <p>No PDF URL provided</p>
              </div>
            )}
          </div>
        </div>

        {/* XML Viewer */}
        <div className={`w-full md:w-1/2 bg-gray-900 rounded-lg shadow-md overflow-hidden ${activeTab !== 'xml' ? 'hidden md:block' : ''}`}>
          <div className="bg-gray-800 text-white p-2 font-medium flex justify-between items-center">
            <span>XML Code</span>
            <div className="flex space-x-2">
              <button 
                onClick={copyToClipboard}
                className="p-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
                title="Copy XML"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="ml-1 hidden sm:inline">Copy</span>
              </button>
              <button 
                onClick={downloadXml}
                className="p-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded flex items-center"
                title="Download XML"
              >
                <Download size={16} />
                <span className="ml-1 hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
          {/* XML Viewer Container with fixed height to match PDF viewer */}
          <div className="h-96 md:h-[calc(100vh-300px)] lg:h-[calc(100vh-250px)] overflow-auto">
            {xmlCode ? (
              <div className="p-4 font-mono text-xs sm:text-sm bg-[#1E1E1E]">
                <XMLViewer 
                  xml={xmlCode} 
                  theme={customTheme}
                  collapsible={true}
                  indentSize={2}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <p>No XML code provided</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFXMLViewer;