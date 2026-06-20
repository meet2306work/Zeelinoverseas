import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FiAnchor, FiBriefcase, FiCompass, FiSend, FiFileText } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Input from '../../commonComponents/inputs/Input';
import Dropdown from '../../commonComponents/dropdowns/Dropdown';
import Textarea from '../../commonComponents/textareas/Textarea';
import Button from '../../commonComponents/buttons/Button';
import FileUpload from '../../commonComponents/fileUploads/FileUpload';
import PageContainer from '../../commonComponents/layouts/PageContainer';
import { submitRfq } from '../../redux/slices/rfqSlice';

export default function RfqScreen() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isPortal = location.pathname.startsWith('/user');
  const { categoriesList } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);

  const [category, setCategory] = useState('');
  const [port, setPort] = useState('');
  const [qty, setQty] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [specs, setSpecs] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  // Prefill contact details from user profile
  useEffect(() => {
    if (user) {
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const handleRfqSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedCategory = (categoriesList || []).find((cat) => cat.slug === category);
    const selectedPort = portOptions.find((option) => option.value === port);

    // Sanitize numeric fields for backend validation
    const parsedQty = parseInt(qty.replace(/\D/g, '')) || 100;
    const parsedPrice = parseInt(targetPrice.replace(/\D/g, '')) || 5000;

    const rfqPayload = {
      contactName: user ? user.fullName : (email.split('@')[0] || 'Corporate Client'),
      email: email,
      phone: phone,
      companyName: user?.companyName || 'Zeelin Procurement Desk',
      productDetails: selectedCategory?.name || category || 'Custom Sourcing',
      quantity: parsedQty,
      targetPrice: parsedPrice,
      shippingDestination: selectedPort?.label || port,
      requirements: specs,
    };

    dispatch(submitRfq(rfqPayload))
      .unwrap()
      .then(() => {
        setIsLoading(false);
        setSuccess(true);
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err || 'Failed to submit RFQ');
      });
  };

  const categoryOptions = (categoriesList || []).map(c => ({ label: c.name, value: c.slug }));

  const portOptions = [
    { label: 'Port of Rotterdam (Netherlands)', value: 'NLRTM' },
    { label: 'Port of Singapore (Singapore)', value: 'SGSGP' },
    { label: 'Port of Houston (United States)', value: 'USHOU' },
    { label: 'Port of Shanghai (China)', value: 'CNSHA' },
    { label: 'Port of Mumbai / JNPT (India)', value: 'INBOM' },
  ];

  return (
    <PageContainer maxWidth="max-w-3xl" className="flex flex-col gap-brand-lg py-brand-md animate-fade-in-up">
      <div className="text-center md:text-left border-b border-brand-border/40 dark:border-slate-800/40 pb-md">
        <h1 className="text-2xl font-extrabold text-brand-text-primary dark:text-white tracking-tight mb-1">
          B2B Request For Quote (RFQ)
        </h1>
        <p className="text-xs text-brand-text-secondary dark:text-slate-400">
          Define custom quantities, specifications, target pricing, and destination shipping ports to get matching contract bids.
        </p>
      </div>

      {!success ? (
        <form onSubmit={handleRfqSubmit}>
          <Card variant="glass" hover={false} className="p-brand-md sm:p-brand-lg flex flex-col gap-brand-md border-brand-border/40 dark:border-slate-800/40">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-brand-md">
              <Dropdown
                label="Product Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={categoryOptions}
                required
              />

              <Dropdown
                label="Destination Port"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                options={portOptions}
                required
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-brand-md">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={FiAnchor}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="e.g. contact@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={FiBriefcase}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-brand-md">
              <Input
                label="Target Quantity"
                placeholder="e.g. 50 Tons, 10 Containers"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                icon={FiAnchor}
                required
              />

              <Input
                label="Target Price ($ USD)"
                placeholder="e.g. $40,000 max"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                icon={FiBriefcase}
                required
              />
            </div>

            <Textarea
              label="Detailed Specifications / Packaging Rules"
              placeholder="Provide exact standards (e.g., grain humidity < 12%, steel reinforcement tags, customized container packaging logs, cargo markings)."
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              required
            />

            <FileUpload
              label="Attach CAD drawings / Spec Documents (Optional)"
              selectedFile={attachment}
              onFileSelect={setAttachment}
              onClear={() => setAttachment(null)}
              accept=".pdf,.doc,.docx,.dwg,.xlsx"
            />

            <Button
              type="submit"
              variant="brandGradient"
              size="lg"
              className="w-full mt-brand-sm"
              isLoading={isLoading}
              icon={FiSend}
              iconPosition="right"
            >
              Submit RFQ to Sales Desk
            </Button>
          </Card>
        </form>
      ) : (
        <Card variant="glass" hover={false} className="p-brand-lg text-center py-brand-xl border-brand-border/20">
          <div className="h-16 w-16 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mx-auto mb-brand-md">
            <FiCompass className="h-8 w-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text-primary dark:text-white tracking-tight mb-1">
            RFQ Submitted Successfully
          </h2>
          <p className="text-sm text-brand-text-secondary dark:text-slate-400 mb-brand-lg max-w-md mx-auto leading-relaxed">
            Our trade leads desk will review your specifications, verify container routes, and dispatch a proposal quote sheet within 24 business hours.
          </p>
          <div className="flex flex-wrap gap-brand-md justify-center">
            <Link to="/user/orders">
              <Button variant="primary">View My RFQs</Button>
            </Link>
            <Link to={isPortal ? "/user/products" : "/products"}>
              <Button variant="outline">Browse Catalog</Button>
            </Link>
          </div>
        </Card>
      )}
    </PageContainer>
  );
}
