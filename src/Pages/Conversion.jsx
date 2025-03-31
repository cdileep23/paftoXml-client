import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '@/util/url';
import { setAllConversions } from '@/store/conversionSlice';
import { Search, Filter, SortAsc, SortDesc, Clock, FileText, Calendar, Download, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';


const Conversion = () => {
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const conversions = useSelector((state) => state.conversions);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only fetch if conversions is null (not if it's an empty array)
    if (conversions ) {
      setIsLoading(false)
      return
      
    } getConversions();
  }, []);

  const getConversions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/conversion/all-conversions`, { withCredentials: true });
      dispatch(setAllConversions(response.data.conversions));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

const DeleteConversion=async({id})=>{
  try {
    const response=await axios.delete(`${BASE_URL}/conversion/delete-conversion/${id}`,{withCredentials:true})
    if(response.data.success){
      const filterConversion=conversions.filter((e)=>(e._id!==id))
      if(filterConversion.length===0){
        dispatch(setAllConversions(null))
      }else{
        dispatch(setAllConversions(filterConversion))
      }
     
      toast.success("Conversion deleted successfully")
    }
  } catch (error) {
    console.log(error)
    toast.error(error.response?.data?.message || "Error deleting conversion")
  }
}

  const getFilteredAndSortedConversions = () => {
    if (!conversions) return [];
    
    let filtered = [...conversions];
    

    if (searchTerm) {
      filtered = filtered.filter(conversion => 
        conversion.originalFilename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    
    return filtered.sort((a, b) => {
      const dateA = new Date(a._id.substring(0, 8));
      const dateB = new Date(b._id.substring(0, 8));
      
      if (sortBy === 'newest') {
        return dateB - dateA;
      } else if (sortBy === 'oldest') {
        return dateA - dateB;
      } else if (sortBy === 'name') {
        return a.originalFilename.localeCompare(b.originalFilename);
      }
      return 0;
    });
  };

  const formatDate = (id) => {
  
    const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

 
  const getFileSize = (xmlContent) => {
    const bytes = xmlContent ? xmlContent.length : 0;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };


  const handleDeleteClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation(); 
    DeleteConversion({ id });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-80"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 md:py-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                <span className="block">Your PDF to XML</span>
                <span className="block text-blue-600">Conversion History</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                View, manage, and download your previous conversions. All your documents are securely stored and easily accessible.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                  placeholder="Search by filename..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Sort */}
            <div className="w-full md:w-auto">
              <div className="flex items-center gap-2">
                {sortBy === 'newest' ? (
                  <SortDesc className="h-5 w-5 text-gray-400" />
                ) : (
                  <SortAsc className="h-5 w-5 text-gray-400" />
                )}
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">File Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Conversions List */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your conversions...</p>
          </div>
        ) : conversions && conversions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredAndSortedConversions().map((conversion) => (
              <div key={conversion._id} className="relative group">
                <Link to={`/conversion/${conversion._id}`} className="block">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-blue-50 p-4 border-b border-blue-100">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="truncate max-w-xs">
                            <h3 className="font-medium text-gray-900 truncate">{conversion.originalFilename}</h3>
                            <p className="text-sm text-gray-500">{getFileSize(conversion.xmlContent)}</p>
                          </div>
                        </div>
                        {/* Delete icon */}
                        <button 
                          onClick={(e) => handleDeleteClick(e, conversion._id)}
                          className="ml-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-1.5 transition-colors duration-200"
                          title="Delete conversion"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatDate(conversion._id)}</span>
                      </div>
                      
                      <div className="flex mb-4">
                        <div className="flex-1 h-16 overflow-hidden bg-gray-50 rounded border border-gray-200 p-2">
                          <p className="text-xs text-gray-400 whitespace-nowrap overflow-ellipsis overflow-hidden">
                            {conversion.xmlContent.substring(0, 100)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No conversions found</h3>
            <p className="mt-2 text-gray-600">Upload your first PDF to convert it to XML format.</p>
            <button onClick={()=>navigate('/')} className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
              Start Converting
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversion;