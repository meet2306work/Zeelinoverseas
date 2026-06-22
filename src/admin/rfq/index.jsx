import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSend, FiAnchor, FiBriefcase } from 'react-icons/fi';
import Table from '../../commonComponents/tables/Table';
import Button from '../../commonComponents/buttons/Button';
import Drawer from '../../commonComponents/drawers/Drawer';
import Input from '../../commonComponents/inputs/Input';
import { selectAllRfqs, updateRfqQuote, fetchAllRfqs } from '../../redux/slices/rfqSlice';

export default function AdminRfqScreen() {
  const dispatch = useDispatch();
  const rfqs = useSelector(selectAllRfqs);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [bidPrice, setBidPrice] = useState('');
  const [agentNote, setAgentNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllRfqs());
  }, [dispatch]);

  const handleOpenBid = (rfq) => {
    setSelectedRfq(rfq);
    setBidPrice((rfq.approvedQuote || rfq.targetBudget || '').replace(/\D/g, ''));
    setAgentNote(rfq.leadTime || '');
    setIsDrawerOpen(true);
  };

  const handleSendBid = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(updateRfqQuote({
        id: selectedRfq._id || selectedRfq.id,
        status: 'Approved',
        bidPrice: bidPrice,
      })).unwrap();
      setIsDrawerOpen(false);
      alert(`RFQ approved successfully.`);
    } catch (error) {
      alert(error || 'Failed to update RFQ status');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      key: 'id', 
      label: 'RFQ ID',
      render: (val) => <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{val}</span>
    },
    // OLD (commented out - do not delete)
    // { 
    //   key: 'company', 
    //   label: 'B2B Client',
    //   render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span>
    // },
    // { 
    //   key: 'port', 
    //   label: 'Delivery Port',
    //   render: (val) => <span className="font-semibold text-slate-700 dark:text-slate-300">{val}</span>
    // },
    // NEW
    { 
      key: 'company', 
      label: 'Client / Customer',
      render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span>
    },
    { 
      key: 'port', 
      label: 'Shipping Destination / Depot',
      render: (val) => <span className="font-semibold text-slate-700 dark:text-slate-300">{val}</span>
    },
    { 
      key: 'qty', 
      label: 'Requested Qty',
      render: (val) => <span className="font-semibold text-slate-600 dark:text-slate-350">{val}</span>
    },
    { 
      key: 'price', 
      label: 'Target Budget',
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-cyan-600 dark:text-cyan-400">{row.targetBudget}</span>
          {row.approvedQuote && (
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Approved {row.approvedQuote}</span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const colors = {
          'Pending Quote': 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25',
          'Pending Review': 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25',
          'Negotiating': 'bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/25',
          'Quote Submitted': 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25',
          'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25',
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${colors[val] || 'bg-slate-100 text-slate-550 border-slate-200'}`}>
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
          variant="outline" 
          size="sm" 
          onClick={() => handleOpenBid(row)}
          className="border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
        >
          {row.status === 'Approved' ? 'Update Tracking' : 'Approve Quote'}
        </Button>
      ),
    }
  ];

  return (
    <div className="flex flex-col gap-8 py-2 animate-fade-in-up">
      {/* Header toolbar */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            RFQ Control Panel
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Submit pricing proposals, negotiate custom parameters, and generate proforma invoices.
          </p>
        </div>
      </div>

      {/* RFQ Database Table */}
      <Table
        columns={columns}
        data={rfqs}
        emptyMessage="No pending RFQs logs found."
        className="text-slate-700 dark:text-slate-355"
      />

      {/* Slide Drawer for Bidding */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Configure Quote for ${selectedRfq?.id}`}
        size="md"
      >
        {selectedRfq && (
          <form onSubmit={handleSendBid} className="flex flex-col gap-6 text-slate-750 dark:text-slate-300">
            <div className="flex flex-col gap-3.5 bg-slate-50 dark:bg-slate-950 p-4.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider">RFQ Target Specifications</span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{selectedRfq.company}</p>
              <div className="grid grid-cols-2 gap-4 text-xs mt-2 text-slate-600 dark:text-slate-400">
                {/* OLD (commented out - do not delete)
                <div>Port: <span className="font-medium text-slate-900 dark:text-slate-200">{selectedRfq.port}</span></div>
                */}
                {/* NEW */}
                <div>Shipping Depot: <span className="font-medium text-slate-900 dark:text-slate-200">{selectedRfq.port}</span></div>
                <div>Quantity: <span className="font-medium text-slate-900 dark:text-slate-200">{selectedRfq.qty}</span></div>
                <div>Target Budget: <span className="font-medium text-amber-600 dark:text-amber-400">{selectedRfq.targetBudget}</span></div>
                <div>Status: <span className="font-medium text-slate-900 dark:text-slate-200">{selectedRfq.status}</span></div>
              </div>
            </div>

            <Input
              label="Propose Unit Bid Price ($ USD)"
              placeholder="e.g. 3900"
              icon={FiBriefcase}
              value={bidPrice}
              onChange={(e) => setBidPrice(e.target.value)}
              required
            />

            <Input
              label="Estimated Shipment Lead Time / Tracking Note"
              placeholder="e.g. 14 Days after milestone deposit"
              icon={FiAnchor}
              value={agentNote}
              onChange={(e) => setAgentNote(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4"
              isLoading={isLoading}
              icon={FiSend}
              iconPosition="right"
            >
              Approve RFQ & Enable Tracking
            </Button>
          </form>
        )}
      </Drawer>
    </div>
  );
}
