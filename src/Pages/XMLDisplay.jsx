import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { xml2js } from 'xml-js';

const XmlViewer = ({ xmlString }) => {
  const [activeTab, setActiveTab] = useState('formatted');
  const [expandedSections, setExpandedSections] = useState({});
  
  // Parse XML to JSON for structured view
  const parsedData = xml2js(xmlString, { compact: false, ignoreComment: true });
  
  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Render structured content recursively
  const renderContent = (element, depth = 0) => {
    if (element.type === 'text') return element.text;
    
    return (
      <div className={`xml-element depth-${depth}`}>
        <div 
          className="xml-tag" 
          onClick={() => element.elements && toggleSection(element.name)}
        >
          <span className="tag-name">{`<${element.name}>`}</span>
          {element.attributes && Object.entries(element.attributes).map(([key, value]) => (
            <span className="attribute" key={key}>
              {` ${key}="${value}"`}
            </span>
          ))}
        </div>
        
        {element.elements && (
          <div className={`xml-content ${expandedSections[element.name] ? 'expanded' : 'collapsed'}`}>
            {element.elements.map((child, i) => (
              <React.Fragment key={i}>
                {renderContent(child, depth + 1)}
              </React.Fragment>
            ))}
            <div className="xml-tag">{`</${element.name}>`}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="xml-viewer-container">
      <div className="viewer-tabs">
        <button 
          className={activeTab === 'raw' ? 'active' : ''}
          onClick={() => setActiveTab('raw')}
        >
          Raw XML
        </button>
        <button 
          className={activeTab === 'formatted' ? 'active' : ''}
          onClick={() => setActiveTab('formatted')}
        >
          Formatted View
        </button>
        <button 
          className={activeTab === 'structured' ? 'active' : ''}
          onClick={() => setActiveTab('structured')}
        >
          Document Structure
        </button>
      </div>
      
      <div className="viewer-content">
        {activeTab === 'raw' && (
          <SyntaxHighlighter 
            language="xml" 
            style={atomDark}
            showLineNumbers={true}
            wrapLines={true}
          >
            {xmlString}
          </SyntaxHighlighter>
        )}
        
        {activeTab === 'formatted' && (
          <div className="formatted-document">
            {parsedData.elements[0].elements.map((page, pageIndex) => (
              <div key={pageIndex} className="page">
                <h3>Page {page.attributes.number}</h3>
                {page.elements.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="section">
                    <h4>{section.attributes.title}</h4>
                    {section.elements.map((element, elIndex) => {
                      if (element.name === 'paragraph') {
                        return <p key={elIndex}>{element.elements[0].text}</p>;
                      }
                      if (element.name === 'table') {
                        return (
                          <div key={elIndex} className="table-container">
                            <h5>{element.attributes.name}</h5>
                            <table>
                              <thead>
                                <tr>
                                  {element.elements[0].elements.map((header, i) => (
                                    <th key={i}>{header.elements[0].text}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {element.elements.slice(1).map((row, rowIndex) => (
                                  <tr key={rowIndex}>
                                    {row.elements.map((cell, cellIndex) => (
                                      <td key={cellIndex}>
                                        {cell.elements?.[0]?.text || ''}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'structured' && (
          <div className="xml-structure-view">
            {renderContent(parsedData.elements[0])}
          </div>
        )}
      </div>
    </div>
  );
};

export default XmlViewer;