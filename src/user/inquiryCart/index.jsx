import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiAnchor, FiBriefcase, FiTrash2, FiSend, FiPlus, FiArrowRight, FiFileText } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Button from '../../commonComponents/buttons/Button';
import Input from '../../commonComponents/inputs/Input';
import Dropdown from '../../commonComponents/dropdowns/Dropdown';
import Textarea from '../../commonComponents/textareas/Textarea';
import FileUpload from '../../commonComponents/fileUploads/FileUpload';

export default function InquiryCartScreen() {
  const location = useLocation();
  const isPortal = location.pathname.startsWith('/user');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom B2B items in Inquiry Cart
  const [inquiryItems, setInquiryItems] = useState([
    {
      id: 'inq-item-1',
      name: 'Cold-Rolled Structural Steel Rebar TMT',
      category: 'steel',
      qty: '100 Tons',
      targetPrice: '62000',
      port: 'USHOU',
      specs: 'Standard BS 4449 Grade 500B rebar. Tagged and bundled for marine shipping carriage.',
      attachment: null
    },
    {
      id: 'inq-item-2',
      name: 'Raw Combed Egyptian Cotton Fiber Bales',
      category: 'fiber',
      qty: '10 Tons',
      targetPrice: '22000',
      port: 'NLRTM',
      specs: 'High grade combed cotton fiber. Staple length 32mm. Packaged in custom density bales.',
      attachment: null
    }
  ]);

  const portOptions = [
    { label: 'Port of Rotterdam (Netherlands)', value: 'NLRTM' },
    { label: 'Port of Singapore (Singapore)', value: 'SGSGP' },
    { label: 'Port of Houston (United States)', value: 'USHOU' },
    { label: 'Port of Shanghai (China)', value: 'CNSHA' },
    { label: 'Port of Mumbai / JNPT (India)', value: 'INBOM' },
  ];

  const handleUpdateItem = (id, key, value) => {
    setInquiryItems(prev => prev.map(item => item.id === id ? { ...item, [key]: value } : item));
  };

  const handleRemove = (id) => {
    setInquiryItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1800);
  };

  return (
    <div className="flex flex-col gap-8 py-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-border/40 dark:border-slate-800/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
            B2B Bulk Inquiry Cart
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Submit specifications for multiple custom commodities to receive a consolidated invoice quote.
          </p>
        </div>
      </div>

      {success ? (
        <Card variant="glass" hover={false} className="p-8 text-center py-12 border-brand-border/20">
          <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center mx-auto mb-4">
            <FiFileText className="h-8 w-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
            Master Inquiry Submitted
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
            Your bulk trade requests have been compiled into active leads. A designated sales broker will log specifications and draft quotes shortly.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/user/orders">
              <Button variant="primary">View My RFQs</Button>
            </Link>
            <Link to={isPortal ? "/user/products" : "/products"}>
              <Button variant="outline">Browse Catalog</Button>
            </Link>
          </div>
        </Card>
      ) : inquiryItems.length === 0 ? (
        <Card variant="glass" className="p-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
              <FiFileText className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Inquiry Cart is Empty
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
              Search for bulk products and add them to your inquiry cart to coordinate specifications.
            </p>
            <Link to={isPortal ? "/user/products" : "/products"}>
              <Button variant="primary" icon={FiArrowRight} iconPosition="right">
                View Trade Catalog
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            {inquiryItems.map((item, idx) => (
              <Card key={item.id} variant="default" className="p-6 relative border-slate-200 dark:border-slate-800 flex flex-col gap-5">
                {/* Header bar of Item */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs flex items-center justify-center font-bold">
                      0{idx + 1}
                    </span>
                    {item.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="text-xs text-red-500 hover:text-red-650 font-bold transition-colors flex items-center gap-1"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" /> Remove Item
                  </button>
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="Target Quantity"
                    placeholder="e.g. 50 Tons"
                    value={item.qty}
                    onChange={(e) => handleUpdateItem(item.id, 'qty', e.target.value)}
                    icon={FiAnchor}
                    required
                  />

                  <Input
                    label="Target Price ($ USD)"
                    placeholder="e.g. 40000"
                    value={item.targetPrice}
                    onChange={(e) => handleUpdateItem(item.id, 'targetPrice', e.target.value)}
                    icon={FiBriefcase}
                    required
                  />

                  <Dropdown
                    label="Destination Port"
                    value={item.port}
                    onChange={(e) => handleUpdateItem(item.id, 'port', e.target.value)}
                    options={portOptions}
                    required
                  />
                </div>

                {/* Specs and Technical Drawing Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Textarea
                    label="Specifications & Custom Markings"
                    placeholder="Provide details about compliance standards, packaging cargo marks, certification requirements."
                    value={item.specs}
                    onChange={(e) => handleUpdateItem(item.id, 'specs', e.target.value)}
                    required
                  />
                  <div className="flex flex-col justify-end">
                    <FileUpload
                      label="Attach CAD or Technical drawings (.dwg, .pdf)"
                      selectedFile={item.attachment}
                      onFileSelect={(file) => handleUpdateItem(item.id, 'attachment', file)}
                      onClear={() => handleUpdateItem(item.id, 'attachment', null)}
                      accept=".pdf,.dwg"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Consolidating {inquiryItems.length} requests into 1 sales lead portfolio.
            </span>
            <div className="flex gap-3">
              <Link to={isPortal ? "/user/products" : "/products"}>
                <Button variant="outline" type="button" icon={FiPlus}>Add Another Product</Button>
              </Link>
              <Button
                variant="gold"
                type="submit"
                isLoading={isLoading}
                icon={FiSend}
                iconPosition="right"
              >
                Submit Master Inquiry
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
