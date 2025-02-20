import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PhotographIcon, DocumentIcon, PlusIcon } from '@heroicons/react/outline';
import assetService from '../../services/asset.service';
import AssetHistoryList from './AssetHistoryList';

const AssetDetails = () => {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileUpload, setFileUpload] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAssetDetails();
  }, [id]);

  const fetchAssetDetails = async () => {
    try {
      const assetData = await assetService.getAssetById(id);
      setAsset(assetData);
      
      const attachmentsData = await assetService.getAssetAttachments(id);
      setAttachments(attachmentsData);
    } catch (error) {
      console.error('Error fetching asset details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFileUpload(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!fileUpload) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', fileUpload);
      
      await assetService.uploadAttachment(id, formData, {
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentage);
        }
      });
      
      // Reset and refetch attachments
      setFileUpload(null);
      setUploadProgress(0);
      fetchAssetDetails();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const isImage = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension);
  };

  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{asset.asset_name}</h1>
            <p className="text-sm text-gray-500">Asset Number: {asset.asset_number}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold
            ${asset.status === 'available' ? 'bg-green-100 text-green-800' : 
              asset.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
              asset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'}`}>
            {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Details</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900">{asset.Category?.name || 'Uncategorized'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Assigned to</dt>
                    <dd className="mt-1 text-sm text-gray-900">{asset.Employee?.name || 'Unassigned'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Purchase Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString() : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Purchase Cost</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {asset.purchase_cost ? `$${asset.purchase_cost.toLocaleString()}` : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="mt-1 text-sm text-gray-900">{asset.location || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{asset.description || 'No description available.'}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Images & Attachments</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              {attachments.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {attachments.map(attachment => (
                    <div key={attachment.id} className="relative group">
                      {isImage(attachment.file_name) ? (
                        <a 
                          href={attachment.file_path} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-md">
                            <img 
                              src={attachment.file_path} 
                              alt={attachment.file_name} 
                              className="object-cover h-full w-full group-hover:opacity-90 transition-opacity" 
                            />
                          </div>
                          <span className="text-xs text-gray-500 truncate block mt-1">
                            {attachment.file_name}
                          </span>
                        </a>
                      ) : (
                        <a 
                          href={attachment.file_path} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block p-2 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <DocumentIcon className="h-5 w-5 text-gray-500" />
                            <span className="text-xs text-gray-700 truncate">
                              {attachment.file_name}
                            </span>
                          </div>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <PhotographIcon className="h-10 w-10 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">No attachments available</p>
                </div>
              )}

              <div className="mt-4 border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Upload New File</h3>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0 file:text-sm file:font-semibold
                              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  
                  <button
                    onClick={handleUpload}
                    disabled={!fileUpload || uploading}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm 
                              leading-4 font-medium rounded-md ${
                                fileUpload && !uploading
                                  ? 'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                  : 'text-gray-700 bg-gray-100 cursor-not-allowed'
                              }`}
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {uploadProgress}%
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Upload
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Asset History</h2>
          <AssetHistoryList assetId={id} />
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;