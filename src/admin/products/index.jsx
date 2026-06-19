import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiBox, FiTrash2, FiEdit2 } from 'react-icons/fi';
import Table from '../../commonComponents/tables/Table';
import Button from '../../commonComponents/buttons/Button';
import Modal from '../../commonComponents/modals/Modal';
import Input from '../../commonComponents/inputs/Input';
import Dropdown from '../../commonComponents/dropdowns/Dropdown';
import { fetchProducts, adminCreateProduct, adminDeleteProduct } from '../../redux/slices/productSlice';
import { fetchCategories } from '../../redux/slices/categorySlice';

export default function AdminProductsScreen() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [moq, setMoq] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { products } = useSelector((state) => state.products);
  const { categoriesList } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchProducts('?limit=50'));
    dispatch(fetchCategories());
  }, [dispatch]);

  const fallbackProducts = [
    { id: 'prod-001', name: 'Standard Shipping ISO Cargo Container', category: 'machinery', price: '$4,200', moq: '2 Units', status: 'Active' },
    { id: 'prod-002', name: 'Cold-Rolled Structural Steel Rebar TMT', category: 'steel', price: '$720 / Ton', moq: '10 Tons', status: 'Active' },
    { id: 'prod-003', name: 'Raw Combed Egyptian Cotton Fiber Bales', category: 'fiber', price: '$2.40 / kg', moq: '500 kg', status: 'Active' },
  ];

  const mappedProducts = products.map((p) => ({
    id: p._id,
    name: p.title,
    category: p.category?.slug || p.category?._id || p.category || 'machinery',
    price: `$${p.price?.toLocaleString()}`,
    moq: `${p.specifications?.find(s => s.key === 'moq')?.value || 100} Units`,
    status: p.status === 'published' ? 'Active' : p.status || 'Active',
  }));

  const activeProducts = [...mappedProducts, ...fallbackProducts];

  const handleAddProduct = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const priceVal = parseInt(price.replace(/\D/g, '')) || 100;
    const selectedCategory = categoriesList.find(c => c.slug === category || c._id === category) || categoriesList[0];

    if (!selectedCategory) {
      setIsLoading(false);
      return alert('Please configure at least one category first');
    }

    const payload = {
      title: name,
      price: priceVal,
      category: selectedCategory._id,
      description: `Premium grade B2B procurement catalog item: ${name}. Standard specifications apply.`,
      specifications: [
        { key: 'moq', value: moq }
      ]
    };

    dispatch(adminCreateProduct(payload))
      .unwrap()
      .then(() => {
        setIsLoading(false);
        setIsModalOpen(false);
        setName('');
        setCategory('');
        setPrice('');
        setMoq('');
        alert('Product published successfully!');
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err || 'Failed to create product');
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
        alert('Simulated deletion of mock product!');
      }
    }
  };

  const categoryOptions = categoriesList.map(c => ({
    label: c.name,
    value: c._id
  }));

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
      render: (val) => {
        const labels = {
          'fiber': 'Agricultural Raw',
          'steel': 'Metal Material',
          'machinery': 'Heavy Equipment',
        };
        return (
          <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200/60 px-2.5 py-0.5 rounded-md dark:text-cyan-400 dark:bg-cyan-950/20 dark:border-cyan-500/10">
            {labels[val] || val}
          </span>
        );
      }
    },
    { 
      key: 'price', 
      label: 'Base Rate',
      render: (val) => <span className="font-extrabold text-cyan-600 dark:text-cyan-400">{val}</span>
    },
    { 
      key: 'moq', 
      label: 'MOQ Limit',
      render: (val) => <span className="font-semibold text-slate-700 dark:text-slate-300">{val}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25 uppercase tracking-wider">
          {val}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="p-2 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white" onClick={() => alert('Edit feature is mocked!')}>
            <FiEdit2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="p-2 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-brand-danger hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => handleDelete(row.id)}>
            <FiTrash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    }
  ];

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
            onClick={() => setIsModalOpen(true)}
          >
            Add New Product
          </Button>
        </div>
      </div>

      {/* Catalog Datatable */}
      <Table
        columns={columns}
        data={products}
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
        <form onSubmit={handleAddProduct} className="flex flex-col gap-5 text-slate-700 dark:text-slate-300">
          <Input
            label="Product Title"
            placeholder="e.g. 20ft Cargo Container"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Dropdown
            label="Category Mapping"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categoryOptions}
            required
            searchable={false}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Base Price Rate ($)"
              placeholder="e.g. 4200"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <Input
              label="MOQ Constraint"
              placeholder="e.g. 2 Units"
              value={moq}
              onChange={(e) => setMoq(e.target.value)}
              required
            />
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4.5 bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-3">
            <FiBox className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>GLB/GLTF model linking: Once the product record is created, go to Media Library to upload your 3D CAD modeling file.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Create Product Record
          </Button>
        </form>
      </Modal>
    </div>
  );
}
