import React, { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';

const PDFXMLViewer = ({ pdfUrl, xmlCode, fileName = "document" }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('pdf'); // For mobile view tab switching

  // Improved XML formatting function
  const formatXML = (xml) => {
    if (!xml) return '';
    
    try {
      // Define a proper XML formatting function
      const formatXmlString = (xmlStr) => {
        const PADDING = ' '.repeat(2); // 2 spaces of padding
        let formatted = '';
        let indent = '';
        
        // Remove line breaks and extra spaces first to normalize the input
        const normalized = xmlStr.replace(/>\s+</g, '><').trim();
        
        // Add newlines and proper indentation
        normalized.split(/></).forEach(node => {
          // Check if this is a closing tag or self-closing tag to adjust indentation
          if (node.match(/^\/\w/)) {
            // This is a closing tag, so reduce indent before adding the node
            indent = indent.substring(PADDING.length);
          }
          
          // Add the node with proper indentation
          formatted += indent + '<' + node + '>\n';
          
          // If this is not a closing tag, a self-closing tag, or a declaration, increase indent
          if (!node.match(/^\//) && !node.match(/\/\s*$/) && !node.match(/^\?/) && !node.match(/!--/)) {
            indent += PADDING;
          }
        });
        
        // Clean up the result
        return formatted
          .replace(/(<([^>]+)>)\n\s*(<\/([^>]+)>)/g, '$1$3') // Put short content on one line
          .replace(/^\s*</g, '<') // Remove spaces at the beginning of lines
          .replace(/>\n/g, '>\n'); // Ensure consistent newlines
      };
      
      // Try to parse and format the XML
      return formatXmlString(xml);
    } catch (e) {
      console.error("XML formatting error:", e);
      // If formatting fails, still try to add some basic formatting to prevent single line
      return xml.replace(/></g, '>\n<')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    }
  };

  // Enhanced XML syntax highlighting with proper newline preservation
  const enhancedXmlHighlighting = (formattedXml) => {
    if (!formattedXml) return '';
    
    // Ensure we're working with escaped characters for HTML rendering
    let sanitized = formattedXml
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    
    // Apply syntax highlighting
    return sanitized
      // Preserve newlines and spaces
      .replace(/\n/g, '<br>')
      .replace(/\s{2}/g, '&nbsp;&nbsp;')
      // Handle comments
      .replace(/(&lt;!--.*?--&gt;)/g, '<span style="color: #6A9955;">$1</span>')
      // Handle doctype and declarations
      .replace(/(&lt;\?.*?\?&gt;)/g, '<span style="color: #808080;">$1</span>')
      // Handle attributes and their values
      .replace(/\s([a-zA-Z0-9_-]+)=(&quot;)(.*?)(&quot;)/g, 
               ' <span style="color: #9CDCFE;">$1</span>=<span style="color: #CE9178;">$2$3$4</span>')
      // Handle tag names
      .replace(/(&lt;\/?)([\w:-]+)/g, '$1<span style="color: #569CD6;">$2</span>');
  };

  // Handle copy to clipboard - ensure proper XML without HTML formatting
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

  return (
    <div className="w-full p-2 md:p-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-2 md:mb-4">Document Viewer</h2>
      
      {/* Tab switcher for mobile view only */}
      <div className="flex md:hidden mb-2 border-b">
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
      
      {/* Main container - row on medium+ screens, controlled by tabs on small screens */}
      <div className="flex flex-col md:flex-row w-full gap-2 md:gap-4">
        {/* PDF Viewer */}
        <div className={`w-full md:w-1/2 bg-white rounded-lg shadow-md overflow-hidden ${activeTab !== 'pdf' ? 'hidden md:block' : ''}`}>
          <div className="bg-gray-800 text-white p-2 font-medium">PDF Document</div>
          {/* Static height container for all devices */}
          <div className="h-106 md:h-96 lg:h-96"> {/* Fixed height at 24rem (384px) for all screens */}
            {pdfUrl ? (
              <iframe
              src={`${pdfUrl}#view=fit`}
                title="PDF Viewer"
                fittopage="true"
                className="w-full h-full border-none"
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
          {/* Static height container for all devices */}
          <div className="h-96 md:h-96 lg:h-96 overflow-auto"> {/* Fixed height at 24rem (384px) for all screens */}
            {xmlCode ? (
              <pre className="p-4 text-gray-300 font-mono text-xs sm:text-sm bg-[#1E1E1E] whitespace-pre-wrap">
                <div dangerouslySetInnerHTML={{ __html: enhancedXmlHighlighting(formatXML(xmlCode)) }} />
              </pre>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <p>No XML code provided</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Optional Resizing Controls - Uncomment if you want manual resizing */}
      {/*
      <div className="flex justify-center mt-4 md:hidden">
        <button 
          className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium"
          onClick={() => {
            // Get current viewers and toggle their height class
            const viewers = document.querySelectorAll('.h-96');
            viewers.forEach(viewer => {
              if (viewer.classList.contains('h-96')) {
                viewer.classList.remove('h-96');
                viewer.classList.add('h-64'); // Smaller
              } else {
                viewer.classList.remove('h-64');
                viewer.classList.add('h-96'); // Larger
              }
            });
          }}
        >
          Resize Viewers
        </button>
      </div>
      */}
    </div>
  );
};

export default PDFXMLViewer;