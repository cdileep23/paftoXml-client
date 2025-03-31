import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileText, X, ArrowRight, Code } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/util/url";
import PDFXMLViewer from "./PDFXMLViewer";
import { useDispatch } from "react-redux";
import { resetConversions } from "@/store/conversionSlice";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileObjectURL, setFileObjectURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conversionObj, setConversion] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (fileObjectURL) {
      URL.revokeObjectURL(fileObjectURL);
    }

    if (file.type === "application/pdf") {
      setSelectedFile(file);
      const objectURL = URL.createObjectURL(file);
      setFileObjectURL(objectURL);
    } else {
      toast.error("Please select a PDF file");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please upload a file first");
      return;
    }

    setIsLoading(true);
    setConversion(null);
    const toastId = toast.loading("Processing your file...");

    try {
      const formData = new FormData();
      formData.append("pdfFile", selectedFile);

      const response = await axios.post(
        `${BASE_URL}/conversion/create-conversion`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Conversion successful!", { id: toastId });
      dispatch(resetConversions());
      setConversion(response.data.conversion);
      clearSelectedFile();
    } catch (error) {
      console.error("Upload failed:", error);
      
      // Clear selection on error
      clearSelectedFile();
      
      if (error.response) {
        // Server responded with an error status (4xx, 5xx)
        const errorMessage = error.response.data?.message || 
                           "An error occurred during conversion";
        toast.error(errorMessage, { id: toastId });
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Network error - please check your connection and try again", { 
          id: toastId 
        });
      } else {
        // Something happened in setting up the request
        toast.error("Internal server error - please upload and try again", { 
          id: toastId 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileObjectURL) {
      URL.revokeObjectURL(fileObjectURL);
      setFileObjectURL(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container mx-auto px-4">
      <HeroSection />
      <div className="mt-8 mb-8 flex flex-col justify-center items-center space-y-5">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Try Out Now</h1>

        <div className="w-full max-w-lg mb-4">
          <div className="relative bg-white rounded-lg border p-4">
            <label className="block text-sm font-medium mb-2">
              Upload PDF Document
            </label>
            <Input
              ref={fileInputRef}
              type="file"
              className="h-auto w-full p-2 text-sm"
              accept=".pdf"
              onChange={handleFileChange}
            />

            {selectedFile && (
              <div className="mt-3 flex items-center text-sm bg-gray-50 p-2 rounded">
                <FileText className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="truncate text-left hover:underline text-blue-600">
                      {selectedFile.name}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-3xl flex flex-col max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle>
                        PDF Preview: {selectedFile.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 min-h-0">
                      <iframe
                        src={fileObjectURL}
                        className="w-full h-full"
                        title="PDF Preview"
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-6 w-6 p-0 flex-shrink-0"
                  onClick={clearSelectedFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div>
          <Button 
            onClick={handleUpload} 
            variant="outline" 
            disabled={isLoading || !selectedFile}
          >
            {isLoading ? "Processing..." : "Generate"}
          </Button>
        </div>
      </div>
      
      {conversionObj && (
        <PDFXMLViewer
          fileName={conversionObj.originalFilename}
          pdfUrl={conversionObj.pdfLink}
          xmlCode={conversionObj.xmlContent}
        />
      )}
    </div>
  );
};

export default Home;


const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-80"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Transform Your PDFs</span>
                <span className="block text-blue-600">to Structured XML</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-3xl">
                Preserve document structure and formatting while converting your
                PDF files to XML format. Our intelligent conversion tool
                maintains headers, paragraphs, tables, and styling - giving you
                structured data you can work with.
              </p>

              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600">Structure Preservation</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600">Secure Storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600">Conversion History</span>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="relative">
                  <div className="absolute -left-4 top-0 h-72 w-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                  <div className="absolute left-20 top-0 h-72 w-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                  <div className="absolute -right-4 top-0 h-72 w-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

                  <div className="relative">
                    <div className="absolute right-4 top-8 transform -rotate-12 shadow-xl">
                      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div className="mt-2 h-2 w-16 bg-gray-200 rounded"></div>
                        <div className="mt-2 h-2 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>

                    <div className="absolute right-24 top-24 transform rotate-6 shadow-xl">
                      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
                        <Code className="h-8 w-8 text-blue-500" />
                        <div className="mt-2 h-2 w-16 bg-blue-100 rounded"></div>
                        <div className="mt-2 h-2 w-20 bg-blue-100 rounded"></div>
                      </div>
                    </div>

                    <div className="relative bg-white rounded-lg shadow-xl p-6 border border-gray-200">
                      <div className="mb-4 flex justify-between items-center">
                        <div className="bg-blue-100 rounded-full p-2">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                        <div className="bg-blue-100 rounded-full p-2">
                          <Code className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="h-2 w-full bg-gray-200 rounded"></div>
                        <div className="h-2 w-5/6 bg-gray-200 rounded"></div>
                        <div className="h-2 w-4/6 bg-gray-200 rounded"></div>
                        <div className="mt-6 h-2 w-full bg-blue-100 rounded"></div>
                        <div className="h-2 w-5/6 bg-blue-100 rounded"></div>
                        <div className="h-2 w-4/6 bg-blue-100 rounded"></div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <div className="h-8 w-24 bg-blue-500 rounded-md"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
