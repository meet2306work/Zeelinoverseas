import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiArchive, FiSearch, FiSliders, FiPlus, FiMinus, FiAlertCircle } from 'react-icons/fi';
import { fetchProducts, adminUpdateProduct } from '../../redux/slices/productSlice';
import Card from '../../commonComponents/cards/Card';
import Table from '../../commonComponents/tables/Table';
import Button from '../../commonComponents/buttons/Button';
import Input from '../../commonComponents/inputs/Input';

export default function AdminInventoryScreen() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  
  const { products, loading } = useSelector((state) => state.products);

  // Fallback items state (if no database products exist yet or for mock demonstration)
  const [mockStockLevels, setMockStockLevels] = useState([
    { id: 'mock-1', sku: 'SKU-EQP-001', name: 'Custom Kraft Mailer Boxes', category: 'Mailer Boxes', stock: 12, safety: 3, status: 'In Stock', isReal: false },
    { id: 'mock-2', sku: 'SKU-RAW-002', name: 'Eco-Friendly Bubble Wrap Rolls', category: 'Wrapping & Protection', stock: 140, safety: 20, status: 'In Stock', isReal: false },
    { id: 'mock-3', sku: 'SKU-TEX-003', name: 'Premium Corrugated Box Bundles', category: 'Corrugated Boxes', stock: 8, safety: 10, status: 'Low Stock', isReal: false },
    { id: 'mock-4', sku: 'SKU-EQP-004', name: 'Self-Sealing Poly Mailers', category: 'Poly Mailers', stock: 245, safety: 15, status: 'In Stock', isReal: false },
  ]);

  useEffect(() => {
    dispatch(fetchProducts('?limit=100'));
  }, [dispatch]);

  const mappedProducts = (products || []).map((p) => {
    const moqVal = parseInt(p.specifications?.find(s => s.key === 'moq')?.value || '100') || 100;
    const safetyVal = Math.round(moqVal * 0.1) || 10;
    const stockVal = p.stock !== undefined ? p.stock : 50;
    let status = 'In Stock';
    if (stockVal === 0) status = 'Out of Stock';
    else if (stockVal <= safetyVal) status = 'Low Stock';

    return {
      id: p._id,
      sku: p.sku || `SKU-${p._id.slice(-6).toUpperCase()}`,
      name: p.title,
      category: p.category?.name || p.category?.slug || p.category || 'Mailer Boxes',
      stock: stockVal,
      safety: safetyVal,
      status: status,
      isReal: true,
    };
  });

  const activeStock = [...mappedProducts, ...mockStockLevels];

  const handleAdjustStock = (row, delta) => {
    if (row.isReal) {
      const nextStock = Math.max(0, row.stock + delta);
      dispatch(adminUpdateProduct({
        id: row.id,
        stock: nextStock
      }))
        .unwrap()
        .then(() => {
          alert('Database product stock adjusted successfully!');
        })
        .catch(err => {
          alert(err || 'Failed to update stock');
        });
    } else {
      setMockStockLevels(prev => prev.map(item => {
        if (item.sku === row.sku) {
          const nextStock = Math.max(0, item.stock + delta);
          let status = 'In Stock';
          if (nextStock === 0) status = 'Out of Stock';
          else if (nextStock <= item.safety) status = 'Low Stock';
          return { ...item, stock: nextStock, status };
        }
        return item;
      }));
    }
  };

  const filteredStock = activeStock.filter(item =>
    item.sku.toLowerCase().includes(search.toLowerCase()) ||
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { 
      key: 'sku', 
      label: 'SKU Code',
      render: (val) => <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{val}</span>
    },
    { 
      key: 'name', 
      label: 'Product Description',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-white">{val}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-455">{row.category}</span>
        </div>
      )
    },
    { 
      key: 'stock', 
      label: 'Available Stock',
      render: (val) => <span className="font-extrabold text-slate-900 dark:text-white text-base">{val} Units</span>
    },
    { 
      key: 'safety', 
      label: 'Safety Threshold',
      render: (val) => <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{val} Units</span>
    },
    {
      key: 'status',
      label: 'Stock Alert',
      render: (val) => {
        const colors = {
          'In Stock': 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25',
          'Low Stock': 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25',
          'Out of Stock': 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/25',
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${colors[val] || 'bg-slate-100'}`}>
            {val}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Stock Adjustments',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="p-2 border-slate-200 dark:border-slate-800 text-slate-550 hover:text-slate-850 dark:hover:text-white"
            onClick={() => handleAdjustStock(row, 1)}
          >
            <FiPlus className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="p-2 border-slate-200 dark:border-slate-800 text-slate-550 hover:text-slate-850 dark:hover:text-white"
            onClick={() => handleAdjustStock(row, -1)}
            disabled={row.stock === 0}
          >
            <FiMinus className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-8 py-2 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Inventory Stock Status
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit warehoused items, check safety threshold limits, and adjust stock logs in real time.
          </p>
        </div>
      </div>

      {/* Low Stock Banner Warning */}
      {activeStock.some(i => i.status === 'Low Stock' || i.status === 'Out of Stock') && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200/60 dark:bg-red-500/10 dark:border-red-500/25 rounded-2xl p-4 text-xs text-rose-700 dark:text-red-400">
          <FiAlertCircle className="h-5.5 w-5.5 shrink-0" />
          <div>
            <span className="font-bold">Attention Needed:</span> One or more products have fallen below their safety threshold limits. Please coordinate with manufacturing factories.
          </div>
        </div>
      )}

      {/* Filter and search bar */}
      <Card variant="glass" hover={false} className="p-4 flex items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search stock code/name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={FiSearch}
          />
        </div>
      </Card>

      {/* Stock Table */}
      <Table
        columns={columns}
        data={filteredStock}
        isLoading={loading && products.length === 0}
        emptyMessage="No inventory items log found."
        className="text-slate-700 dark:text-slate-350"
      />
    </div>
  );
}
