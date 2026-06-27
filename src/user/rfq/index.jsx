import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiAnchor, FiCompass, FiSend, FiPhone, FiMail, FiLayers, FiDollarSign,
  FiCheckCircle, FiPackage, FiGlobe, FiClock
} from 'react-icons/fi';
import Input from '../../commonComponents/inputs/Input';
import Dropdown from '../../commonComponents/dropdowns/Dropdown';
import Textarea from '../../commonComponents/textareas/Textarea';
import Button from '../../commonComponents/buttons/Button';
import FileUpload from '../../commonComponents/fileUploads/FileUpload';
import PageContainer from '../../commonComponents/layouts/PageContainer';
import { submitRfq } from '../../redux/slices/rfqSlice';

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const TRUST_BADGES = [
  { icon: FiClock, label: '24h Response' },
// OLD (commented out - do not delete)
// { icon: FiGlobe, label: 'Global Ports' },
// NEW
{ icon: FiGlobe, label: 'Shipping Regions' },
  { icon: FiPackage, label: 'Custom Lots' },
];

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
    const parsedQty = parseInt(qty.replace(/\D/g, '')) || 100;
    const parsedPrice = parseInt(targetPrice.replace(/\D/g, '')) || 5000;

    const rfqPayload = {
      contactName: user ? user.fullName : (email.split('@')[0] || 'Corporate Client'),
      email,
      phone,
      companyName: user?.companyName || 'Zeelin Procurement Desk',
      productDetails: selectedCategory?.name || category || 'Custom Sourcing',
      quantity: parsedQty,
      targetPrice: parsedPrice,
      shippingDestination: port,
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

  const categoryOptions = (categoriesList || []).map((c) => ({ label: c.name, value: c.slug }));

  /* ── Success state ── */
  if (success) {
    return (
      <PageContainer maxWidth="max-w-2xl" className="py-brand-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-border-default/60 bg-background-surface shadow-premium text-center p-12 flex flex-col items-center gap-6"
        >
          <div className="h-20 w-20 rounded-full bg-accent-gold/15 flex items-center justify-center">
            <FiCheckCircle className="h-10 w-10 text-accent-gold" />
          </div>
          {/* OLD (commented out - do not delete)
          <div>
            <h2 className="text-2xl font-display font-extrabold text-text-primary tracking-tight">
              RFQ Submitted Successfully!
            </h2>
            <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto leading-relaxed">
              Our trade desk will review your specifications, verify container routes, and dispatch a proposal quote sheet within <strong className="text-text-primary">24 business hours</strong>.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Link to="/user/orders">
              <Button variant="primary" size="lg">View My RFQs</Button>
            </Link>
          */}
          {/* NEW */}
          <div>
            <h2 className="text-2xl font-display font-extrabold text-text-primary tracking-tight">
              Custom Quote Request Submitted!
            </h2>
            <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto leading-relaxed">
              Our team will review your specifications, check factory schedules, and dispatch a customized print or volume quote within <strong className="text-text-primary">24 business hours</strong>.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Link to="/user/orders">
              <Button variant="primary" size="lg">View My Quotes</Button>
            </Link>
            <Link to={isPortal ? '/user/products' : '/products'}>
              <Button variant="outline" size="lg">Browse Catalog</Button>
            </Link>
          </div>
        </motion.div>
      </PageContainer>
    );
  }

  /* ── Main form ── */
  return (
    <PageContainer maxWidth="max-w-3xl" className="py-brand-md">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-brand-lg"
      >
        {/* ── Page Header ── */}
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          {/* Trust badges */}
          <div className="flex flex-wrap gap-3">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-gold border border-accent-gold/30 bg-accent-gold/8 rounded-full px-3 py-1"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </div>

          {/* OLD (commented out - do not delete)
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary tracking-tight">
              B2B Request For Quote
            </h1>
            <p className="text-sm text-text-secondary mt-1.5 leading-relaxed max-w-xl">
              Define custom quantities, specifications, target pricing, and destination ports — our sales desk will match you with verified contract bids.
            </p>
          </div>
          */}
          {/* NEW */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary tracking-tight">
              Request Custom or Bulk Quote
            </h1>
            <p className="text-sm text-text-secondary mt-1.5 leading-relaxed max-w-xl">
              Specify custom sizes, branding options, volume quantities, target budget, and shipping destination — our sales team will draft your quote.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border-default/60" />
        </motion.div>

        {/* ── Form Card ── */}
        <motion.form variants={fadeUp} onSubmit={handleRfqSubmit}>
          <div className="rounded-3xl border border-border-default/70 bg-background-surface shadow-premium overflow-hidden">
            {/* Card header bar */}
            {/* OLD (commented out - do not delete)
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border-default/50 bg-background-primary/60">
              <div className="h-8 w-8 rounded-xl bg-accent-gold/15 flex items-center justify-center">
                <FiAnchor className="h-4 w-4 text-accent-gold" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">Procurement Details</p>
                <p className="text-xs text-text-secondary">All fields marked * are required</p>
              </div>
            </div>
            */}
            {/* NEW */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border-default/50 bg-background-primary/60">
              <div className="h-8 w-8 rounded-xl bg-accent-gold/15 flex items-center justify-center">
                <FiAnchor className="h-4 w-4 text-accent-gold" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">Order Requirements</p>
                <p className="text-xs text-text-secondary">All fields marked * are required</p>
              </div>
            </div>

            {/* Form body */}
            <div className="p-6 sm:p-8 flex flex-col gap-6">
              {/* Row 1 — Category + Port */}
              <div>
                {/* OLD (commented out - do not delete)
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
                  Sourcing Requirements
                </p>
                */}
                {/* NEW */}
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
                  Product &amp; Delivery Location
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Dropdown
                    label="Product Category *"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={categoryOptions}
                    required
                  />
                  <Input
                    label="Shipping Destination (City, Country) *"
                    placeholder="e.g. New York, United States"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    icon={FiGlobe}
                    required
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border-default/40" />

              {/* Row 2 — Contact */}
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
                  Contact Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number *"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={FiPhone}
                    required
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="e.g. contact@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={FiMail}
                    required
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border-default/40" />

              {/* Row 3 — Quantity + Price */}
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
                  Volume &amp; Pricing
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* OLD (commented out - do not delete)
                  <Input
                    label="Target Quantity *"
                    placeholder="e.g. 50 Tons, 10 Containers"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    icon={FiLayers}
                    required
                  />
                  <Input
                    label="Target Price ($ USD) *"
                    placeholder="e.g. $40,000 max"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    icon={FiDollarSign}
                    required
                  />
                  */}
                  {/* NEW */}
                  <Input
                    label="Target Quantity *"
                    placeholder="e.g. 500 boxes, 5,000 units"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    icon={FiLayers}
                    required
                  />
                  <Input
                    label="Target Budget ($ USD) *"
                    placeholder="e.g. $2,000 max"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    icon={FiDollarSign}
                    required
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border-default/40" />

              {/* Row 4 — Specs */}
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
                  Specifications &amp; Documents
                </p>
                <div className="flex flex-col gap-4">
                  {/* OLD (commented out - do not delete)
                  <Textarea
                    label="Detailed Specifications / Packaging Rules *"
                    placeholder="Provide exact standards (e.g., grain humidity < 12%, steel reinforcement tags, customized container packaging logs, cargo markings)."
                    value={specs}
                    onChange={(e) => setSpecs(e.target.value)}
                    required
                  />
                  <FileUpload
                    label="Attach CAD Drawings / Spec Documents (Optional)"
                    selectedFile={attachment}
                    onFileSelect={setAttachment}
                    onClear={() => setAttachment(null)}
                    accept=".pdf,.doc,.docx,.dwg,.xlsx"
                  />
                  */}
                  {/* NEW */}
                  <Textarea
                    label="Detailed Specifications / Branding &amp; Size Rules *"
                    placeholder="Provide dimensions, material thickness, printing details, logo placement, or color choices."
                    value={specs}
                    onChange={(e) => setSpecs(e.target.value)}
                    required
                  />
                  <FileUpload
                    label="Attach Logo, CAD Drawings, or Design Templates (Optional)"
                    selectedFile={attachment}
                    onFileSelect={setAttachment}
                    onClear={() => setAttachment(null)}
                    accept=".pdf,.doc,.docx,.dwg,.xlsx,.png,.jpg,.jpeg"
                  />
                </div>
              </div>
            </div>

            {/* Card footer — CTA */}
            <div className="px-6 sm:px-8 pb-8 pt-0">
              {/* OLD (commented out - do not delete)
              <Button
                type="submit"
                variant="brandGradient"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                icon={FiSend}
                iconPosition="right"
              >
                Submit RFQ to Sales Desk
              </Button>
              <p className="text-center text-xs text-text-secondary mt-3">
                Expect a personalised proposal within{' '}
                <span className="font-semibold text-text-primary">24 business hours</span>.
              </p>
              */}
              {/* NEW */}
              <Button
                type="submit"
                variant="brandGradient"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                icon={FiSend}
                iconPosition="right"
              >
                Submit Quote Request
              </Button>
              <p className="text-center text-xs text-text-secondary mt-3">
                Expect a customized quote proposal within{' '}
                <span className="font-semibold text-text-primary">24 business hours</span>.
              </p>
            </div>
          </div>
        </motion.form>
      </motion.div>
    </PageContainer>
  );
}
