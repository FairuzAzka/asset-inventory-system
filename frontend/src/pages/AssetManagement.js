import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/layout/Layout';
import Modal from '../components/common/Modal';
import useTable from '../hooks/useTable';
import assetService from '../services/asset.service';
import categoryService from '../services/category.service';

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    status: 'AVAILABLE',
    purchaseDate: '',
    purchasePrice: ''
  });

  const {
    data: displayedAssets,
    sortConfig,
    currentPage, 
    totalPages,
    search,
    setSearch,
    requestSort,
    goToPage
  } = useTable(assets, {
    initialSort: { field: 'name', direction: 'asc' },
    rowsPerPage: 10
  });

  useEffect(() => {
    fetchAssets();
    fetchCategories();
  }, []);

  const fetchAssets = async () => {
    try {
      const data = await assetService.getAllAssets();
      setAssets(data);
    } catch (error) {
      toast.error('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAsset) {
        await assetService.updateAsset(editingAsset.id, formData);
        toast.success('Asset updated successfully');
      } else {
        await assetService.createAsset(formData);
        toast.success('Asset created successfully');
      }
      setModalOpen(false);
      setEditingAsset(null);
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        status: 'AVAILABLE',
        purchaseDate: '',
        purchasePrice: ''
      });
      fetchAssets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      description: asset.description,
      categoryId: asset.categoryId,
      status: asset.status,
      purchaseDate: asset.purchaseDate.split('T')[0],
      purchasePrice: asset.purchasePrice
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await assetService.deleteAsset(id);
        toast.success('Asset deleted successfully');
        fetchAssets();
      } catch (error) {
        toast.error('Failed to delete asset');
      }
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Asset Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your organization's assets
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => {
                setEditingAsset(null);
                setFormData({
                  name: '',
                  description: '',
                  categoryId: '',
                  status: 'AVAILABLE',
                  purchaseDate: '',
                  purchasePrice: ''
                });
                setModalOpen(true);
              }}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Add Asset
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    Name
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => requestSort('category')}
                  >
                    Category
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => requestSort('status')}
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">Loading...</td>
                  </tr>
                ) : displayedAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {asset.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {categories.find(c => c.id === asset.categoryId)?.name || 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {asset.status}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(asset)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(asset.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingAsset(null);
            setFormData({
              name: '',
              description: '',
              categoryId: '',
              status: 'AVAILABLE',
              purchaseDate: '',
              purchasePrice: ''
            });
          }}
          title={editingAsset ? 'Edit Asset' : 'Add Asset'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="AVAILABLE">Available</option>
                <option value="IN_USE">In Use</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="RETIRED">Retired</option>
              </select>
            </div>

            <div>
              <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
                Purchase Date
              </label>
              <input
                type="date"
                name="purchaseDate"
                id="purchaseDate"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">
                Purchase Price
              </label>
              <input
                type="number"
                name="purchasePrice"
                id="purchasePrice"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="mt-5 sm:mt-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
              >
                {editingAsset ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default AssetManagement;
