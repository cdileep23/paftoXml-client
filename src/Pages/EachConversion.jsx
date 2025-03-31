import React, { useState, useEffect } from 'react';
import { BASE_URL } from '@/util/url';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, File, FileText } from 'lucide-react';
import PDFXMLViewer from './PDFXMLViewer';

const EachConversion = () => {
  const [conversion, setConversion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    getConversionById();
  }, [id]);

  const getConversionById = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/conversion/get-conversion/${id}`, { withCredentials: true });
      setConversion(response.data.conversion);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError('Failed to load conversion details');
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format Object ID timestamp
  const formatIdDate = (objectId) => {
    if (!objectId) return '';
    const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link
              to="/my-conversions"
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Back to Conversions</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 flex-1 truncate">
              {loading ? 'Loading...' : error ? 'Error Loading Conversion' : conversion?.originalFilename || 'Conversion Details'}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading conversion details...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-500 text-center">
              <FileText className="h-16 w-16 mx-auto text-red-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Failed to load conversion</h3>
              <p className="mt-2 text-gray-600">{error}</p>
              <button 
                onClick={getConversionById}
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : conversion ? (
          <div className="grid grid-cols-1 gap-6">
            {/* Conversion Info Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4">
                <h2 className="text-white text-lg font-semibold">Conversion Details</h2>
              </div>
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <File className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Filename</p>
                      <p className="font-medium">{conversion.originalFilename}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created At</p>
                      <p className="font-medium">{formatDate(conversion.createdAt)}</p>
                    </div>
                  </div>
                  
                  
                  
                  
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div className="flex items-center justify-center px-4 py-2 bg-gray-100 rounded-md">
                    <div className="flex items-center mr-2">
                      <div className="flex items-center mr-1">
                        <div className="bg-blue-600 h-2 w-2 rounded-full mr-1"></div>
                        <span className="text-xs text-gray-600">PDF</span>
                      </div>
                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 rounded">
                        {conversion.pdfPages} {conversion.pdfPages === 1 ? 'page' : 'pages'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-green-600 h-2 w-2 rounded-full mr-1"></div>
                      <span className="text-xs text-gray-600">XML</span>
                    </div>
                  </div>
                  
               
                </div>
              </div>
            </div>
            
            {/* PDF & XML Viewer */}
            <PDFXMLViewer 
              pdfUrl={conversion.pdfLink} 
              xmlCode={conversion.xmlContent}
              fileName={conversion.originalFilename.replace('.pdf', '')}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No conversion found</h3>
            <p className="mt-2 text-gray-600">The conversion you're looking for doesn't exist or has been deleted.</p>
            <Link 
              to="/conversions"
              className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors inline-block"
            >
              Back to Conversions
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EachConversion;