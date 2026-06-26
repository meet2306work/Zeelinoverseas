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
import Pagination from '../../commonComponents/pagination/Pagination';

export default function AdminProductsScreen() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [sku, setSku] = useState('');
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
  const [stock, setStock] = useState('100');
  
  // Media uploads state
  const [images, setImages] = useState([]);
  const [threeDModel, setThreeDModel] = useState({ url: '', public_id: '' });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingModel, setUploadingModel] = useState(false);
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [isDraggingModel, setIsDraggingModel] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;

  const { products, pagination } = useSelector((state) => state.products);
  const { categoriesList } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchProducts(`?page=${page}&limit=${limit}`));
  }, [dispatch, page]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const mappedProducts = products.map((p) => ({
    id: p._id,
    sku: p.sku || p._id,
    name: p.title,
    category: p.category?.name || p.category?.slug || p.category || 'Boxes',
    price: `$${p.price?.toFixed(2)}`,
    moq: `${p.specifications?.find(s => s.key === 'moq')?.value || 100} ${p.unit || 'pcs'}`,
    status: p.availabilityStatus || 'Active',
  }));

  const activeProducts = mappedProducts;

  const resetForm = () => {
    setSku('');
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
    setStock('100');
    setEditingProduct(null);
  };

  const handleOpenEditModal = (productId) => {
    const prod = products.find(p => p._id === productId);
    if (!prod) {
      alert('Mock products cannot be edited. Please select a database product.');
      return;
    }

    setEditingProduct(prod);
    setSku(prod.sku || '');
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
    setStock(prod.stock !== undefined ? prod.stock.toString() : '0');

    setIsEditModalOpen(true);
  };

  const uploadImagesFiles = async (filesList) => {
    if (!filesList || filesList.length === 0) return;

    setUploadingImages(true);
    const formData = new FormData();
    Array.from(filesList).forEach(file => formData.append('images', file));

    try {
      const response = await apiClient.post('/uploads', formData, {
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

  const uploadModelFile = async (file) => {
    if (!file) return;

    setUploadingModel(true);
    const formData = new FormData();
    formData.append('model', file);

    try {
      const response = await apiClient.post('/uploads', formData, {
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

  const handleImageUpload = (e) => {
    uploadImagesFiles(e.target.files);
  };

  const handleModelUpload = (e) => {
    uploadModelFile(e.target.files[0]);
  };

  const handleDragOverImages = (e) => {
    e.preventDefault();
    setIsDraggingImages(true);
  };
  const handleDragLeaveImages = () => {
    setIsDraggingImages(false);
  };
  const handleDropImages = (e) => {
    e.preventDefault();
    setIsDraggingImages(false);
    uploadImagesFiles(e.dataTransfer.files);
  };

  const handleDragOverModel = (e) => {
    e.preventDefault();
    setIsDraggingModel(true);
  };
  const handleDragLeaveModel = () => {
    setIsDraggingModel(false);
  };
  const handleDropModel = (e) => {
    e.preventDefault();
    setIsDraggingModel(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadModelFile(e.dataTransfer.files[0]);
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
      sku: sku.trim().toUpperCase(),
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
      threeDModel,
      stock: parseInt(stock, 10) || 0
    };

    dispatch(adminCreateProduct(payload))
      .unwrap()
      .then(() => {
        setIsLoading(false);
        setIsModalOpen(false);
        resetForm();
        alert('Product published successfully!');
        dispatch(fetchProducts(`?page=${page}&limit=${limit}`));
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
      sku: sku.trim().toUpperCase(),
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
      threeDModel,
      stock: parseInt(stock, 10) || 0
    };

    dispatch(adminUpdateProduct(payload))
      .unwrap()
      .then(() => {
        setIsLoading(false);
        setIsEditModalOpen(false);
        resetForm();
        alert('Product updated successfully!');
        dispatch(fetchProducts(`?page=${page}&limit=${limit}`));
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
          .then(() => {
            alert('Product deleted successfully!');
            dispatch(fetchProducts(`?page=${page}&limit=${limit}`));
          })
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
      key: 'sku',
      label: 'SKU ID',
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
      label: '25-Unit Price',
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
    <div className="flex flex-col gap-5 text-text-primary">
      <div className="flex items-start gap-3 rounded-xl border border-accent-gold/25 bg-accent-gold/8 px-4 py-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-gold text-text-on-accent">
          <FiInfo className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-text-primary">Catalog information</p>
          <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
            Required fields publish the product to the catalog. Specifications and media help buyers evaluate it faster.
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-border-default/55 bg-background-surface/75 p-4 sm:p-5">
        <div className="mb-5 flex items-center gap-3 border-b border-border-default/45 pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black-accent text-xs font-bold text-text-on-dark">1</span>
          <div>
            <h4 className="text-sm font-bold text-text-primary">Product &amp; Pricing</h4>
            <p className="text-xs text-text-secondary">Core catalog identity and commercial terms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Input
          label="SKU ID"
          placeholder="e.g. BOX-SL-001"
          value={sku}
          onChange={(e) => setSku(e.target.value.toUpperCase())}
          helperText="Unique letters, numbers, hyphens or underscores"
          maxLength={64}
          pattern="[A-Za-z0-9][A-Za-z0-9_-]*"
          required
        />

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

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Input
          label="Price for 25 Units ($)"
          placeholder="e.g. 4.00"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          helperText="The storefront scales this amount for larger quantities"
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

        <Input
          label="Stock Quantity"
          placeholder="e.g. 100"
          type="number"
          value={stock}
          onChange={(e) => {
            const val = e.target.value;
            setStock(val);
            const num = parseInt(val, 10);
            if (num === 0) {
              setAvailabilityStatus('Out Of Stock');
            } else if (num > 0 && availabilityStatus === 'Out Of Stock') {
              setAvailabilityStatus('In Stock');
            }
          }}
          required
        />
        </div>
      </section>

      <section className="rounded-2xl border border-border-default/55 bg-background-surface/75 p-4 sm:p-5">
        <div className="mb-5 flex items-center gap-3 border-b border-border-default/45 pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black-accent text-xs font-bold text-text-on-dark">2</span>
          <div>
            <h4 className="text-sm font-bold text-text-primary">Packaging Specifications</h4>
            <p className="text-xs text-text-secondary">Material strength, dimensions, tax and availability</p>
          </div>
        </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Input
          label="Color"
          placeholder="e.g. Kraft Brown"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <Dropdown
          label="Availability Status"
          value={availabilityStatus}
          onChange={(e) => {
            const val = e.target.value;
            setAvailabilityStatus(val);
            if (val === 'Out Of Stock') {
              setStock('0');
            } else if (val === 'In Stock' && (parseInt(stock, 10) === 0 || !stock)) {
              setStock('100');
            }
          }}
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

      <button
        type="button"
        role="switch"
        aria-checked={recyclable}
        onClick={() => setRecyclable((current) => !current)}
        className="mt-5 flex w-full items-center justify-between gap-4 rounded-xl border border-border-default/55 bg-background-primary/45 p-3.5 text-left transition-colors hover:border-accent-gold/50 focus-visible:border-accent-gold"
      >
        <span className="flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${recyclable ? 'border-accent-gold bg-accent-gold text-text-on-accent' : 'border-border-default bg-background-surface text-transparent'}`}>
            <FiCheck className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-bold text-text-primary">100% recyclable product</span>
            <span className="block text-xs text-text-secondary">Display the recyclable attribute on the product page</span>
          </span>
        </span>
        <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${recyclable ? 'bg-accent-gold' : 'bg-border-default'}`}>
          <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${recyclable ? 'translate-x-6' : 'translate-x-1'}`} />
        </span>
      </button>
      </section>

      <section className="rounded-2xl border border-border-default/55 bg-background-surface/75 p-4 sm:p-5">
        <div className="mb-5 flex items-center gap-3 border-b border-border-default/45 pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black-accent text-xs font-bold text-text-on-dark">3</span>
          <div>
            <h4 className="text-sm font-bold text-text-primary">Media Assets</h4>
            <p className="text-xs text-text-secondary">Product gallery images and an optional interactive 3D model</p>
          </div>
        </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

      {/* Product Images Uploader */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Product Images</label>
        <div
          onDragOver={handleDragOverImages}
          onDragLeave={handleDragLeaveImages}
          onDrop={handleDropImages}
          className={`min-h-40 border-2 border-dashed rounded-xl p-4 transition-all duration-300 flex flex-col items-center justify-center gap-3
            ${isDraggingImages
              ? 'border-accent-gold bg-accent-gold/10 scale-[1.01]'
              : 'border-border-default bg-background-primary/35 hover:border-accent-gold/60'
            }
          `}
        >
          <div className="flex flex-wrap gap-2.5 justify-center w-full">
            {images.map((img, idx) => (
              <div key={idx} className="relative h-16 w-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 shadow-sm">
                <img src={img.url} alt="Product" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeUploadedImage(idx)}
                  className="absolute top-1 right-1 p-0.5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition-transform hover:scale-105"
                >
                  <FiX className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            <label className="h-16 w-20 rounded-lg border border-dashed border-border-default hover:border-accent-gold flex flex-col items-center justify-center cursor-pointer text-text-secondary hover:text-accent-gold transition-colors bg-background-surface">
              <FiUpload className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-bold">Choose</span>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          
          <p className="text-center text-[11px] font-medium text-text-secondary">
            Drag and drop images here, or click <span className="font-bold text-accent-gold">Choose</span> to browse
          </p>
        </div>
        {uploadingImages && <span className="text-xs text-cyan-500 flex items-center gap-1.5 font-bold"><FiInfo className="animate-spin" /> Uploading images to gallery...</span>}
      </div>

      {/* 3D Model Uploader */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">3D Asset Model (.GLB / .GLTF)</label>
        {threeDModel.url ? (
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2.5 min-w-0">
              <FiBox className="h-5 w-5 text-secondary shrink-0" />
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-350 truncate max-w-[280px]">
                {threeDModel.public_id || '3d_model_file.glb'}
              </span>
            </div>
            <button
              type="button"
              onClick={removeThreeDModel}
              className="p-1.5 rounded bg-slate-200 dark:bg-slate-850 hover:bg-red-50 hover:text-red-600 text-slate-500 transition-colors"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={handleDragOverModel}
            onDragLeave={handleDragLeaveModel}
            onDrop={handleDropModel}
            className={`min-h-40 w-full py-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300
              ${isDraggingModel
                ? 'border-accent-gold bg-accent-gold/10 scale-[1.01]'
                : 'border-border-default bg-background-primary/35 hover:border-accent-gold/60'
              }
            `}
          >
            <label className="flex flex-col items-center justify-center cursor-pointer w-full text-text-secondary hover:text-accent-gold">
              <FiBox className="h-7 w-7 mb-1.5" />
              <span className="text-xs font-bold">Choose a 3D Model File (.glb, .gltf)</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Drag & Drop file here, or click to choose from device
              </p>
              <input type="file" accept=".glb,.gltf" onChange={handleModelUpload} className="hidden" />
            </label>
          </div>
        )}
        {uploadingModel && <span className="text-xs text-cyan-500 flex items-center gap-1.5 font-bold"><FiInfo className="animate-spin" /> Processing 3D asset model...</span>}
      </div>
      </div>
      </section>
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

      <Pagination
        currentPage={pagination?.page || 1}
        totalPages={pagination?.pages || 1}
        onPageChange={(p) => setPage(p)}
        className="mt-4"
      />

      {/* Add Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Catalog Product"
        size="xl"
        className="max-h-[92vh]"
      >
        <form onSubmit={handleAddProduct} className="flex flex-col gap-5">
          {productFormFields}
          <div className="flex flex-col-reverse items-stretch justify-between gap-3 rounded-xl border border-border-default/60 bg-background-primary/45 p-4 sm:flex-row sm:items-center">
            <p className="hidden text-xs text-text-secondary sm:block">
              Fields marked with <span className="font-bold text-red-500">*</span> are required
            </p>
            <div className="flex gap-3 sm:ml-auto">
              <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon={FiCheck} className="flex-1 sm:flex-none" isLoading={isLoading}>
                Create Product
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Catalog Product"
        size="xl"
        className="max-h-[92vh]"
      >
        <form onSubmit={handleUpdateProduct} className="flex flex-col gap-5">
          {productFormFields}
          <div className="flex flex-col-reverse items-stretch justify-between gap-3 rounded-xl border border-border-default/60 bg-background-primary/45 p-4 sm:flex-row sm:items-center">
            <p className="hidden text-xs text-text-secondary sm:block">
              Review product details before saving changes
            </p>
            <div className="flex gap-3 sm:ml-auto">
              <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon={FiCheck} className="flex-1 sm:flex-none" isLoading={isLoading}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
