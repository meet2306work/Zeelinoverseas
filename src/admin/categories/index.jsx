import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiPlus, FiTrash2, FiEdit2, FiSearch, FiImage, FiUpload, FiX, FiInfo } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Table from '../../commonComponents/tables/Table';
import Button from '../../commonComponents/buttons/Button';
import Modal from '../../commonComponents/modals/Modal';
import Input from '../../commonComponents/inputs/Input';
import { addCategory, updateCategory, deleteCategory, fetchCategories, fetchPaginatedCategories } from '../../redux/slices/categorySlice';
import apiClient from '../../services/apiClient';
import Pagination from '../../commonComponents/pagination/Pagination';

export default function AdminCategoriesScreen() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { categories, pagination } = useSelector((state) => state.categories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  useEffect(() => {
    dispatch(fetchPaginatedCategories(`?page=${page}&limit=${limit}&search=${search}`));
  }, [dispatch, page, search]);

  const uploadCategoryImageFile = async (file) => {
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await apiClient.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.data && response.data.data.length > 0) {
        setImageUrl(response.data.data[0].url);
        alert('Image uploaded successfully!');
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadCategoryImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingImage(true);
  };

  const handleDragLeave = () => {
    setIsDraggingImage(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingImage(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadCategoryImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setImageUrl('');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setImageUrl(cat.image || '');
    setDescription(cat.description || cat.desc || '');
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const generatedSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const defaultImage = imageUrl || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80';

    try {
      if (editingCategory) {
        await dispatch(updateCategory({
          id: editingCategory._id || editingCategory.id,
          name,
          slug: generatedSlug,
          image: defaultImage,
          description: description,
        })).unwrap();
      } else {
        await dispatch(addCategory({
          name,
          slug: generatedSlug,
          image: defaultImage,
          description: description,
        })).unwrap();
      }
      setIsModalOpen(false);
      setName('');
      setSlug('');
      setImageUrl('');
      setDescription('');
      dispatch(fetchPaginatedCategories(`?page=${page}&limit=${limit}&search=${search}`));
    } catch (error) {
      alert(error || 'Failed to save category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        dispatch(fetchPaginatedCategories(`?page=${page}&limit=${limit}&search=${search}`));
      } catch (error) {
        alert(error || 'Failed to delete category');
      }
    }
  };

  const filteredCategories = categories || [];

  const columns = [
    { 
      key: '_id', 
      label: 'Category ID',
      render: (_, row) => <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{row._id || row.id}</span>
    },
    {
      key: 'image',
      label: 'Category Image',
      render: (val) => (
        <div className="h-10 w-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-800/40 shadow-sm">
          <img src={val || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80'} alt="Category" className="h-full w-full object-cover" />
        </div>
      )
    },
    { 
      key: 'name', 
      label: 'Category Name',
      render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span>
    },
    { 
      key: 'slug', 
      label: 'Slug',
      render: (val) => <span className="text-xs font-mono text-cyan-700 bg-cyan-50 border border-cyan-200/60 dark:text-cyan-400 dark:bg-cyan-950/20 px-2 py-0.5 rounded-md">{val}</span>
    },
    { 
      key: 'count', 
      label: 'Active Products',
      render: (val) => <span className="font-semibold text-slate-700 dark:text-slate-300">{val || 0} Items</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25">
          {val || 'Active'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="p-2 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            onClick={() => handleOpenEditModal(row)}
          >
            <FiEdit2 className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="p-2 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-brand-danger hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={() => handleDelete(row._id || row.id)}
          >
            <FiTrash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-8 py-2 animate-fade-in-up">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Global Sourcing Categories
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Define and manage box packaging sourcing classifications, product counts, and landing page routing parameters.
          </p>
        </div>
        
        <Button 
          variant="primary" 
          size="sm" 
          icon={FiPlus}
          onClick={handleOpenCreateModal}
          id="btn-create-category"
        >
          Create Category
        </Button>
      </div>

      {/* Filter Options Bar */}
      <Card variant="glass" hover={false} className="p-4 flex items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            icon={FiSearch}
          />
        </div>
      </Card>

      {/* Categories Database Table */}
      <Table
        columns={columns}
        data={filteredCategories}
        emptyMessage="No product categories found matching filters."
        className="text-slate-700 dark:text-slate-350"
      />

      <Pagination
        currentPage={pagination?.page || 1}
        totalPages={pagination?.pages || 1}
        onPageChange={(p) => setPage(p)}
        className="mt-4"
      />

      {/* Creation/Editing Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Sourcing Category" : "Create Sourcing Category"}
      >
        <form onSubmit={handleSaveCategory} className="flex flex-col gap-5">
          <Input
            label="Category Name"
            placeholder="e.g. Corrugated Sizing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Custom URL Slug (Optional)"
            placeholder="e.g. corrugated-sizing"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Category Image</label>
            {imageUrl ? (
              <div className="relative h-32 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-center">
                <img src={imageUrl} alt="Category" className="h-full object-contain" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition-transform hover:scale-105"
                  title="Remove Image"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full py-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300
                  ${isDraggingImage 
                    ? 'border-secondary bg-secondary/5 dark:bg-slate-900/40 scale-[1.01]' 
                    : 'border-slate-350 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:border-secondary/50'
                  }
                `}
              >
                <label className="flex flex-col items-center justify-center cursor-pointer w-full text-slate-400 hover:text-secondary">
                  <FiImage className="h-8 w-8 mb-1.5" />
                  <span className="text-xs font-bold">Upload Category Image</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Drag & Drop file here, or click to choose from device
                  </p>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            )}
            {uploadingImage && <span className="text-xs text-cyan-500 flex items-center gap-1.5 font-bold"><FiInfo className="animate-spin" /> Uploading image to cloud...</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Description / Scope
            </label>
            <textarea
              placeholder="Detail key materials, board grades, and custom printing flexibilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white p-3 outline-none focus:border-secondary transition-colors resize-none h-24 shadow-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {editingCategory ? "Save Changes" : "Save Category"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
