import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiBox, FiTrash2, FiEdit2, FiUpload, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import Table from '../../commonComponents/tables/Table';
import Button from '../../commonComponents/buttons/Button';
import Modal from '../../commonComponents/modals/Modal';
import Input from '../../commonComponents/inputs/Input';
import Dropdown from '../../commonComponents/dropdowns/Dropdown';
import { fetchProducts, adminCreateProduct, adminDeleteProduct, adminUpdateProduct } from '../../redux/slices/productSlice';
import { fetchCategories } from '../../redux/slices/categorySlice';
import apiClient from '../../services/apiClient';

export default function AdminProductsScreen() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [moq, setMoq] = useState('');
  const [ply, setPly] = useState('');
  const [dimension, setDimension] = useState('');
  const [sizeUnit, setSizeUnit] = useState('mm');
  const [gsm, setGsm] = useState('');
  const [color, setColor] = useState('');
  const [bundle, setBundle] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [gstRate, setGstRate] = useState('18');
  const [availabilityStatus, setAvailabilityStatus] = useState('In Stock');
  const [thickness, setThickness] = useState('');
  const [recyclable, setRecyclable] = useState(true);
  const [printingOption, setPrintingOption] = useState('Plain');
  const [burstingFactor, setBurstingFactor] = useState('');
  
  // Media uploads state
  const [images, setImages] = useState([]);
  const [threeDModel, setThreeDModel] = useState({ url: '', public_id: '' });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingModel, setUploadingModel] = useState(false);

  const { products } = useSelector((state) => state.products);
  const { categoriesList } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchProducts('?limit=50'));
    dispatch(fetchCategories());
  }, [dispatch]);

  const fallbackProducts = [
    { id: 'prod-001', name: 'Premium Kraft Paper Bag', category: 'bags', price: '$0.45', moq: '500 Units', status: 'Active' },
    { id: 'prod-002', name: 'Corrugated Pizza Packing Box', category: 'boxes', price: '$0.28', moq: '1000 Units', status: 'Active' },
  ];

  const mappedProducts = products.map((p) => ({
    id: p._id,
    name: p.title,
    category: p.category?.name || p.category?.slug || p.category || 'Boxes',
    price: `$${p.price?.toFixed(2)}`,
    moq: `${p.specifications?.find(s => s.key === 'moq')?.value || 100} ${p.unit || 'pcs'}`,
    status: p.availabilityStatus || 'Active',
  }));

  const activeProducts = [...mappedProducts, ...fallbackProducts];

  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setMoq('');
    setPly('');
    setDimension('');
    setSizeUnit('mm');
    setGsm('');
    setColor('');
    setBundle('');
    setUnit('pcs');
    setGstRate('18');
    setAvailabilityStatus('In Stock');
    setThickness('');
    setRecyclable(true);
    setPrintingOption('Plain');
    setBurstingFactor('');
    setImages([]);
    setThreeDModel({ url: '', public_id: '' });
    setEditingProduct(null);
  };

  const handleOpenEditModal = (productId) => {
    const prod = products.find(p => p._id === productId);
    if (!prod) {
      alert('Mock products cannot be edited. Please select a database product.');
      return;
    }

    setEditingProduct(prod);
    setName(prod.title || '');
    setCategory(prod.category?._id || prod.category || '');
    setPrice(prod.price?.toString() || '');
    const moqVal = prod.specifications?.find(s => s.key === 'moq')?.value || '100';
    setMoq(moqVal);
    setPly(prod.ply || '');
    setDimension(prod.dimension || '');
    setSizeUnit(prod.sizeUnit || 'mm');
    setGsm(prod.gsm || '');
    setColor(prod.color || '');
    setBundle(prod.bundle || '');
    setUnit(prod.unit || 'pcs');
    setGstRate(prod.gstRate?.toString() || '18');
    setAvailabilityStatus(prod.availabilityStatus || 'In Stock');
    setThickness(prod.thickness || '');
    setRecyclable(prod.recyclable !== undefined ? prod.recyclable : true);
    setPrintingOption(prod.printingOption || 'Plain');
    setBurstingFactor(prod.burstingFactor || '');
    setImages(prod.images || []);
    setThreeDModel(prod.threeDModel || { url: '', public_id: '' });

    setIsEditModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      const response = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImages(prev => [...prev, ...response.data.data]);
      alert('Images uploaded successfully!');
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Image upload failed');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleModelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingModel(true);
    const formData = new FormData();
    formData.append('model', file);

    try {
      const response = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.data && response.data.data.length > 0) {
        setThreeDModel(response.data.data[0]);
        alert('3D Model uploaded successfully!');
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || '3D Model upload failed');
    } finally {
      setUploadingModel(false);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const priceVal = parseFloat(price) || 0;
    const selectedCategory = (categoriesList || []).find(c => c._id === category || c.slug === category);

    if (!selectedCategory) {
      setIsLoading(false);
      return alert('Please configure or select a category first');
    }

    const payload = {
      title: name,
      price: priceVal,
      category: selectedCategory._id,
      description: `Premium box packaging product: ${name}. Built to specifications.`,
      specifications: [
        { key: 'moq', value: moq }
      ],
      ply,
      dimension,
      sizeUnit,
      gsm,
      color,
      bundle,
      unit,
      gstRate: parseInt(gstRate) || 18,
      availabilityStatus,
      thickness,
      recyclable,
      printingOption,
      burstingFactor,
      images,
      threeDModel
    };

    dispatch(adminCreateProduct(payload))
      .unwrap()
      .then(() => {
        setIsLoading(false);
        setIsModalOpen(false);
        resetForm();
        alert('Product published successfully!');
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err || 'Failed to create product');
      });
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const priceVal = parseFloat(price) || 0;
    const selectedCategory = (categoriesList || []).find(c => c._id === category || c.slug === category);

    if (!selectedCategory) {
      setIsLoading(false);
      return alert('Please select a valid category');
    }

    const payload = {
      id: editingProduct._id,
      title: name,
      price: priceVal,
      category: selectedCategory._id,
      specifications: [
        { key: 'moq', value: moq }
      ],
      ply,
      dimension,
      sizeUnit,
      gsm,
      color,
      bundle,
      unit,
      gstRate: parseInt(gstRate) || 18,
      availabilityStatus,
      thickness,
      recyclable,
      printingOption,
      burstingFactor,
      images,
      threeDModel
    };

    dispatch(adminUpdateProduct(payload))
      .unwrap()
      .then(() => {
        setIsLoading(false);
        setIsEditModalOpen(false);
        resetForm();
        alert('Product updated successfully!');
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err || 'Failed to update product');
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      if (id && !id.startsWith('prod-')) {
        dispatch(adminDeleteProduct(id))
          .unwrap()
          .then(() => alert('Product deleted successfully!'))
          .catch((err) => alert(err || 'Failed to delete product'));
      } else {
        alert('Mock product deleted successfully (simulated)!');
      }
    }
  };

  const categoryOptions = (categoriesList || []).map(c => ({
    label: c.name,
    value: c._id
  }));

  const removeUploadedImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeThreeDModel = () => {
    setThreeDModel({ url: '', public_id: '' });
  };

  const columns = [
    { 
      key: 'id', 
      label: 'SKU / ID',
      render: (val) => <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{val}</span>
    },
    { 
      key: 'name', 
      label: 'Product Title',
      render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span>
    },
    {
      key: 'category',
      label: 'Category',
      render: (val) => (
        <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200/60 px-2.5 py-0.5 rounded-md dark:text-cyan-400 dark:bg-cyan-950/20 dark:border-cyan-500/10">
          {val}
        </span>
      )
    },
    { 
      key: 'price', 
      label: 'Base Price',
      render: (val) => <span className="font-extrabold text-cyan-600 dark:text-cyan-400">{val}</span>
    },
    { 
      key: 'moq', 
      label: 'MOQ Limit',
      render: (val) => <span className="font-semibold text-slate-700 dark:text-slate-300">{val}</span>
    },
    {
      key: 'status',
      label: 'Availability',
      render: (val) => (
        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
          val === 'In Stock' || val === 'Active'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25'
            : 'bg-red-50 text-red-700 border-red-250 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/25'
        }`}>
          {val}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="p-2 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white" onClick={() => handleOpenEditModal(row.id)}>
            <FiEdit2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="p-2 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-brand-danger hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => handleDelete(row.id)}>
            <FiTrash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    }
  ];

  const productFormFields = (
    <div className="flex flex-col gap-4 text-slate-700 dark:text-slate-300">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Product Title"
          placeholder="e.g. 3-Ply Corrugated Box"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Dropdown
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoryOptions}
          required
          searchable={false}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Base Price Rate ($)"
          placeholder="e.g. 0.45"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <Input
          label="MOQ Limit"
          placeholder="e.g. 500"
          type="number"
          value={moq}
          onChange={(e) => setMoq(e.target.value)}
          required
        />
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Packaging Specifications</h4>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="PLY Rating"
          placeholder="e.g. 3 PLY, 5 PLY"
          value={ply}
          onChange={(e) => setPly(e.target.value)}
        />

        <Input
          label="GSM Paper weight"
          placeholder="e.g. 150"
          value={gsm}
          onChange={(e) => setGsm(e.target.value)}
        />

        <Input
          label="Thickness"
          placeholder="e.g. 3.2 mm"
          value={thickness}
          onChange={(e) => setThickness(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Dimension"
          placeholder="e.g. 300x200x150"
          value={dimension}
          onChange={(e) => setDimension(e.target.value)}
        />

        <Dropdown
          label="Dimension Unit"
          value={sizeUnit}
          onChange={(e) => setSizeUnit(e.target.value)}
          options={[
            { label: 'mm', value: 'mm' },
            { label: 'cm', value: 'cm' },
            { label: 'inch', value: 'inch' }
          ]}
          searchable={false}
        />

        <Input
          label="Bursting Factor (BF)"
          placeholder="e.g. 16 BF"
          value={burstingFactor}
          onChange={(e) => setBurstingFactor(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Bundle Quantity"
          placeholder="e.g. 50"
          type="number"
          value={bundle}
          onChange={(e) => setBundle(e.target.value)}
        />

        <Dropdown
          label="Sales Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          options={[
            { label: 'Per Piece (pcs)', value: 'pcs' },
            { label: 'Per Bundle', value: 'bundle' }
          ]}
          searchable={false}
        />

        <Input
          label="GST Rate (%)"
          placeholder="e.g. 18"
          type="number"
          value={gstRate}
          onChange={(e) => setGstRate(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Color"
          placeholder="e.g. Kraft Brown"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <Dropdown
          label="Availability Status"
          value={availabilityStatus}
          onChange={(e) => setAvailabilityStatus(e.target.value)}
          options={[
            { label: 'In Stock', value: 'In Stock' },
            { label: 'Out Of Stock', value: 'Out Of Stock' },
            { label: 'Pre-Order', value: 'Pre-Order' },
            { label: 'Archived', value: 'Archived' }
          ]}
          searchable={false}
        />

        <Dropdown
          label="Printing"
          value={printingOption}
          onChange={(e) => setPrintingOption(e.target.value)}
          options={[
            { label: 'Plain (Unprinted)', value: 'Plain' },
            { label: 'Printed', value: 'Printed' }
          ]}
          searchable={false}
        />
      </div>

      <div className="flex items-center gap-2 mt-1">
        <input
          type="checkbox"
          id="recyclable"
          checked={recyclable}
          onChange={(e) => setRecyclable(e.target.checked)}
          className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
        />
        <label htmlFor="recyclable" className="text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer select-none">
          This product is 100% Recyclable
        </label>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Media Assets</h4>

      {/* Product Images Uploader */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Product Images</label>
        <div className="flex flex-wrap gap-2.5">
          {images.map((img, idx) => (
            <div key={idx} className="relative h-16 w-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100">
              <img src={img.url} alt="Product" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeUploadedImage(idx)}
                className="absolute top-1 right-1 p-0.5 rounded-full bg-red-600 text-white hover:bg-red-700"
              >
                <FiX className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="h-16 w-20 rounded-lg border border-dashed border-slate-300 hover:border-cyan-500 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-cyan-500 transition-colors">
            <FiUpload className="h-4.5 w-4.5 mb-1" />
            <span className="text-[9px] font-bold">Upload</span>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        {uploadingImages && <span className="text-xs text-cyan-500 flex items-center gap-1.5 font-bold"><FiInfo className="animate-spin" /> Uploading images to gallery...</span>}
      </div>

      {/* 3D Model Uploader */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">3D Asset Link (.GLB / .GLTF)</label>
        {threeDModel.url ? (
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 truncate max-w-[280px]">
              {threeDModel.public_id || '3d_model_file.glb'}
            </span>
            <button
              type="button"
              onClick={removeThreeDModel}
              className="p-1 rounded bg-slate-200 dark:bg-slate-850 hover:bg-red-100 hover:text-red-600 text-slate-500"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <label className="w-full py-4 border border-dashed border-slate-300 hover:border-cyan-500 rounded-xl flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-cyan-500 transition-colors">
            <FiBox className="h-6 w-6 mb-1" />
            <span className="text-xs font-bold">Choose a 3D Model File (.glb, .gltf)</span>
            <input type="file" accept=".glb,.gltf" onChange={handleModelUpload} className="hidden" />
          </label>
        )}
        {uploadingModel && <span className="text-xs text-cyan-500 flex items-center gap-1.5 font-bold"><FiInfo className="animate-spin" /> Processing 3D asset model...</span>}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 py-2 animate-fade-in-up">
      {/* Header toolbar */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Products Catalog Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Publish products to the public e-commerce grid, configure volume rates, and link GLB 3D assets.
          </p>
        </div>
        
        <div className="flex gap-2.5">
          <Button 
            variant="primary" 
            size="sm" 
            icon={FiPlus} 
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            Add New Product
          </Button>
        </div>
      </div>

      {/* Catalog Datatable */}
      <Table
        columns={columns}
        data={activeProducts}
        emptyMessage="No product items currently inside the database."
        className="text-slate-700 dark:text-slate-350"
      />

      {/* Add Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Catalog Product"
        size="md"
      >
        <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
          {productFormFields}
          <Button
            type="submit"
            variant="primary"
            className="w-full mt-4"
            isLoading={isLoading}
          >
            Create Product Record
          </Button>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Catalog Product"
        size="md"
      >
        <form onSubmit={handleUpdateProduct} className="flex flex-col gap-4">
          {productFormFields}
          <Button
            type="submit"
            variant="primary"
            className="w-full mt-4"
            isLoading={isLoading}
          >
            Save Product Changes
          </Button>
        </form>
      </Modal>
    </div>
  );
}
