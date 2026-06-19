import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiPlus, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import Input from '../inputs/Input';
import Button from '../buttons/Button';

export default function CakePricingModal({ isOpen, onClose }) {
  const [isDark, setIsDark] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (triggerRef.current) {
        setIsDark(!!triggerRef.current.closest('.dark'));
      }
    }
  }, [isOpen]);
  const [cakeOptions, setCakeOptions] = useState([
    { id: 1, description: '', price: '', pricePer: 'Per cake', servings: '' }
  ]);

  const [addOns, setAddOns] = useState([]);
  const [fees, setFees] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCakeOption = () => {
    setCakeOptions([
      ...cakeOptions,
      { id: cakeOptions.length + 1, description: '', price: '', pricePer: 'Per cake', servings: '' }
    ]);
  };

  const handleRemoveCakeOption = (id) => {
    if (cakeOptions.length > 1) {
      setCakeOptions(cakeOptions.filter(opt => opt.id !== id));
    }
  };

  const handleCakeOptionChange = (id, field, val) => {
    setCakeOptions(cakeOptions.map(opt => {
      if (opt.id === id) {
        return { ...opt, [field]: val };
      }
      return opt;
    }));
  };

  const handleAddAddOn = () => {
    setAddOns([...addOns, { id: Date.now(), name: '', price: '' }]);
  };

  const handleRemoveAddOn = (id) => {
    setAddOns(addOns.filter(item => item.id !== id));
  };

  const handleAddOnChange = (id, field, val) => {
    setAddOns(addOns.map(item => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    }));
  };

  const handleAddFee = () => {
    setFees([...fees, { id: Date.now(), name: '', price: '' }]);
  };

  const handleRemoveFee = (id) => {
    setFees(fees.filter(item => item.id !== id));
  };

  const handleFeeChange = (id, field, val) => {
    setFees(fees.map(item => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Pricing packages saved successfully!');
      onClose();
    }, 1200);
  };

  return (
    <>
      <span ref={triggerRef} className="hidden" aria-hidden="true" />
      {createPortal(
        <div className={isDark ? 'dark' : ''}>
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
                {/* Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onClose}
                  className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs"
                />

                {/* Modal Content Box */}
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.98 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  className="relative w-full max-w-xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col z-10"
                >
                  {/* Header Area with Soft Rose/Peach Gradient Backdrop */}
                  <div className="relative p-6 pt-8 pb-5 bg-gradient-to-tr from-rose-100/50 via-orange-50/30 to-rose-200/20 dark:from-rose-950/20 dark:via-orange-950/10 dark:to-rose-900/10 border-b border-slate-100 dark:border-slate-900 flex flex-col gap-4">
                    {/* Top Navigation Row */}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-colors"
                      >
                        <FiArrowLeft className="h-5 w-5" />
                      </button>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        Set up your pricing
                      </span>
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <IoClose className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h2 className="text-display-sm font-extrabold text-[#0F1729] dark:text-white leading-tight">
                        Cake & Desserts pricing
                      </h2>
                      <p className="text-body-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md leading-relaxed font-medium">
                        Add your cake and dessert packages so brides can compare your pricing.
                      </p>
                    </div>
                  </div>

                  {/* Scrollable Form Body */}
                  <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50/50 dark:bg-slate-950">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                      
                      {/* Whole Cake Pricing Box */}
                      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-850 shadow-xs flex flex-col gap-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-none">
                            Whole cake pricing
                          </h3>
                          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
                            Add one or more cake options you offer
                          </span>
                        </div>

                        {cakeOptions.map((opt, idx) => (
                          <div key={opt.id} className="border-t border-slate-100 dark:border-slate-800/80 pt-4.5 first:border-0 first:pt-0 flex flex-col gap-3.5 relative">
                            
                            {/* Section header & remove option */}
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <span className="h-5 w-5 rounded-full bg-[#0F1729] text-white dark:bg-slate-800 text-[10px] font-extrabold flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                Cake option
                              </span>
                              {cakeOptions.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCakeOption(opt.id)}
                                  className="text-xs font-bold text-red-500 hover:text-red-650 inline-flex items-center gap-1 transition-colors"
                                >
                                  <FiTrash2 className="h-3.5 w-3.5" /> Remove
                                </button>
                              )}
                            </div>

                            {/* Cake Description */}
                            <Input
                              label="Cake description"
                              placeholder="e.g. Classic 3-tier wedding cake"
                              value={opt.description}
                              onChange={(e) => handleCakeOptionChange(opt.id, 'description', e.target.value)}
                              required
                            />

                            {/* Row: Starting Price and Priced Per */}
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                label="Starting price"
                                placeholder="e.g. $500"
                                value={opt.price}
                                onChange={(e) => handleCakeOptionChange(opt.id, 'price', e.target.value)}
                                required
                              />

                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                  Priced per <span className="text-red-500">*</span>
                                </label>
                                <select
                                  value={opt.pricePer}
                                  onChange={(e) => handleCakeOptionChange(opt.id, 'pricePer', e.target.value)}
                                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-[#F0F4F9]/40 dark:bg-slate-950/40 text-sm text-slate-800 dark:text-white px-3 py-2.5 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                >
                                  <option value="Per cake">Per cake</option>
                                  <option value="Per serving">Per serving</option>
                                  <option value="Per guest">Per guest</option>
                                </select>
                              </div>
                            </div>

                            {/* Serving Amount */}
                            <Input
                              label="Serving amount"
                              placeholder="e.g. 50–100 servings"
                              value={opt.servings}
                              onChange={(e) => handleCakeOptionChange(opt.id, 'servings', e.target.value)}
                              helperText="Enter a number or range (e.g. 50 or 50–100)"
                              required
                            />

                          </div>
                        ))}

                        {/* Add option button */}
                        <button
                          type="button"
                          onClick={handleAddCakeOption}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline pt-2 border-t border-slate-100 dark:border-slate-800/80 w-max transition-colors"
                        >
                          <FiPlus className="h-4 w-4" /> Add option
                        </button>

                      </div>

                      {/* Optional Add-ons Box */}
                      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-850 shadow-xs flex flex-col gap-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-none">
                            Optional add-ons
                          </h3>
                          <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 w-max border border-slate-200/20 font-medium">
                            <FiAlertCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            Same as hair/makeup add-ons
                          </div>
                        </div>

                        {addOns.length > 0 && (
                          <div className="flex flex-col gap-3">
                            {addOns.map((item) => (
                              <div key={item.id} className="flex gap-3 items-end">
                                <div className="flex-1">
                                  <Input
                                    placeholder="Add-on description"
                                    value={item.name}
                                    onChange={(e) => handleAddOnChange(item.id, 'name', e.target.value)}
                                  />
                                </div>
                                <div className="w-28">
                                  <Input
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={(e) => handleAddOnChange(item.id, 'price', e.target.value)}
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAddOn(item.id)}
                                  className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleAddAddOn}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline w-max transition-colors"
                        >
                          <FiPlus className="h-4 w-4" /> + Add optional add-on
                        </button>
                      </div>

                      {/* Optional Fees Box */}
                      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-850 shadow-xs flex flex-col gap-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-none">
                            Optional fees
                          </h3>
                        </div>

                        {fees.length > 0 && (
                          <div className="flex flex-col gap-3">
                            {fees.map((item) => (
                              <div key={item.id} className="flex gap-3 items-end">
                                <div className="flex-1">
                                  <Input
                                    placeholder="Fee description"
                                    value={item.name}
                                    onChange={(e) => handleFeeChange(item.id, 'name', e.target.value)}
                                  />
                                </div>
                                <div className="w-28">
                                  <Input
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={(e) => handleFeeChange(item.id, 'price', e.target.value)}
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFee(item.id)}
                                  className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleAddFee}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline w-max transition-colors"
                        >
                          <FiPlus className="h-4 w-4" /> + Add optional fee
                        </button>
                      </div>

                      {/* Submit / Skip buttons */}
                      <div className="flex flex-col items-center gap-4.5 mt-2">
                        <Button
                          type="submit"
                          variant="primary"
                          className="w-full"
                          isLoading={isSubmitting}
                        >
                          Save & Continue Setup
                        </Button>

                        <button
                          type="button"
                          onClick={onClose}
                          className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
                        >
                          Skip for Now
                        </button>
                      </div>

                    </form>
                  </div>

                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </>
  );
}
