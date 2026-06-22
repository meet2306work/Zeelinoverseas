import { useState } from 'react';
import { FiMessageSquare, FiSend, FiMail, FiCalendar, FiSearch, FiSliders } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Table from '../../commonComponents/tables/Table';
import Button from '../../commonComponents/buttons/Button';
import Drawer from '../../commonComponents/drawers/Drawer';
import Input from '../../commonComponents/inputs/Input';

export default function AdminInquiriesScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // OLD (commented out - do not delete)
  // const [inquiries, setInquiries] = useState([
  //   { id: 'INQ-4921', client: 'Jürgen Klopp', company: 'Westside Logistics', product: 'Standard Shipping ISO Cargo Container', qty: '4 Units', date: 'June 10, 2026', status: 'Pending Response', email: 'jklopp@westside.de' },
  //   { id: 'INQ-4920', client: 'Ramesh Patel', company: 'Gujarat Cotton Mills', product: 'Raw Combed Egyptian Cotton Fiber Bales', qty: '1,200 kg', date: 'June 09, 2026', status: 'Replied', email: 'ramesh@gujaratcotton.in' },
  //   { id: 'INQ-4919', client: 'Jane Smith', company: 'Apex Structural Steel', product: 'Cold-Rolled Structural Steel Rebar TMT', qty: '15 Tons', date: 'June 08, 2026', status: 'Replied', email: 'j.smith@apexsteel.com' },
  // ]);
  // NEW
  const [inquiries, setInquiries] = useState([
    { id: 'INQ-4921', client: 'Jürgen Klopp', company: 'Westside Clothing', product: 'Custom Kraft Mailer Boxes', qty: '400 Units', date: 'June 10, 2026', status: 'Pending Response', email: 'jklopp@westside.de' },
    { id: 'INQ-4920', client: 'Ramesh Patel', company: 'Gujarat Apparel Co', product: 'Premium Corrugated Box Bundles', qty: '120 Packs', date: 'June 09, 2026', status: 'Replied', email: 'ramesh@gujaratcotton.in' },
    { id: 'INQ-4919', client: 'Jane Smith', company: 'Apex Tech Gear', product: 'Eco-Friendly Bubble Wrap Rolls', qty: '50 Rolls', date: 'June 08, 2026', status: 'Replied', email: 'j.smith@apexsteel.com' },
  ]);

  const handleOpenReply = (inq) => {
    setSelectedInquiry(inq);
    setReplyMessage('');
    setIsDrawerOpen(true);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsDrawerOpen(false);
      setInquiries(inquiries.map(inq => 
        inq.id === selectedInquiry.id ? { ...inq, status: 'Replied' } : inq
      ));
      alert(`Response email sent successfully to ${selectedInquiry.client} (${selectedInquiry.email})!`);
    }, 1200);
  };

  const filteredInquiries = inquiries.filter(inq =>
    inq.client.toLowerCase().includes(search.toLowerCase()) ||
    inq.company.toLowerCase().includes(search.toLowerCase()) ||
    inq.product.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { 
      key: 'id', 
      label: 'Inquiry ID',
      render: (val) => <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{val}</span>
    },
    { 
      key: 'client', 
      label: 'Client Details',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-white">{val}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{row.company}</span>
        </div>
      )
    },
    { 
      key: 'product', 
      label: 'Product',
      render: (val) => <span className="font-medium text-slate-700 dark:text-slate-300">{val}</span>
    },
    { 
      key: 'qty', 
      label: 'Qty',
      render: (val) => <span className="font-semibold text-slate-700 dark:text-slate-300">{val}</span>
    },
    { 
      key: 'date', 
      label: 'Received',
      render: (val) => <span className="text-xs text-slate-555 dark:text-slate-400 flex items-center gap-1.5"><FiCalendar className="h-3.5 w-3.5" />{val}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const colors = {
          'Pending Response': 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25',
          'Replied': 'bg-teal-50 text-teal-700 border-teal-200/60 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/25',
          'Closed': 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${colors[val] || 'bg-slate-100'}`}>
            {val}
          </span>
        );
      }
    },
    {
      key: 'action',
      label: 'Action',
      render: (_, row) => (
        <Button 
          variant={row.status === 'Pending Response' ? 'primary' : 'outline'} 
          size="sm" 
          onClick={() => handleOpenReply(row)}
        >
          {row.status === 'Pending Response' ? 'Compose Reply' : 'View History'}
        </Button>
      ),
    }
  ];

  return (
    <div className="flex flex-col gap-8 py-2 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Client Product Inquiries
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit standard inquiries submitted from product catalog detailed pages. Connect directly to clients with custom replies.
          </p>
        </div>
      </div>

      {/* Filter and search bar */}
      <Card variant="glass" hover={false} className="p-4 flex items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search inquiries client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={FiSearch}
          />
        </div>
      </Card>

      {/* Database table */}
      <Table
        columns={columns}
        data={filteredInquiries}
        emptyMessage="No product inquiries logs match filter criteria."
        className="text-slate-700 dark:text-slate-350"
      />

      {/* Communicator Slider Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Respond to Inquiry ${selectedInquiry?.id}`}
        size="md"
      >
        {selectedInquiry && (
          <form onSubmit={handleSendReply} className="flex flex-col gap-6 text-slate-750 dark:text-slate-300">
            <div className="flex flex-col gap-3.5 bg-slate-50 dark:bg-slate-800/40 p-4.5 rounded-xl border border-slate-200 dark:border-slate-700/30">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><FiMail className="h-3.5 w-3.5" /> Client Specifications</span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedInquiry.client} ({selectedInquiry.company})</p>
              <div className="grid grid-cols-2 gap-4 text-xs mt-1 text-slate-600 dark:text-slate-400">
                <div>Product: <span className="font-medium text-slate-900 dark:text-slate-200">{selectedInquiry.product}</span></div>
                <div>Quantity: <span className="font-medium text-slate-900 dark:text-slate-200">{selectedInquiry.qty}</span></div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Compose Email Reply
              </label>
              <textarea
                // OLD (commented out - do not delete)
                // placeholder="Dear B2B customer, we can fulfill this order under standard ocean transport timelines..."
                // NEW
                placeholder="Dear customer, we can fulfill this order under standard express delivery timelines..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white p-3 outline-none focus:border-secondary transition-colors resize-none h-48 shadow-sm"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4"
              isLoading={isLoading}
              icon={FiSend}
              iconPosition="right"
            >
              Dispatch Email Response
            </Button>
          </form>
        )}
      </Drawer>
    </div>
  );
}
