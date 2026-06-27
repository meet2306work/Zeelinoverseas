import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiSend, FiPlus, FiChevronDown } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Table from '../../commonComponents/tables/Table';
import Button from '../../commonComponents/buttons/Button';
import Textarea from '../../commonComponents/textareas/Textarea';
import { fetchMyTickets, createTicket, selectAllTickets } from '../../redux/slices/ticketSlice';

export default function SupportTicketsScreen() {
  const dispatch = useDispatch();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [otherText, setOtherText] = useState('');
  const [desc, setDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const ticketsList = useSelector(selectAllTickets);

  useEffect(() => {
    dispatch(fetchMyTickets());
  }, [dispatch]);

  // Get predefined topics from admin-managed settings slice
  const supportTopics = useSelector((state) => state.settings?.supportTopics || [
    'Shipment Status Update',
    'RFQ Follow-up',
    'Invoice / Payment Query',
    'Custom Packaging Request',
    'Product Quality Issue',
    'Delivery Delay',
    'Other',
  ]);

  const isOther = selectedTopic === 'Other';
  const effectiveSubject = isOther ? otherText : selectedTopic;

  // OLD (commented out - do not delete)
  // const fallbackTickets = [
  //   { id: 'TCK-2026-982', date: 'Jun 11, 2026', subject: 'Inquiry status update on Cotton Bales re-route', status: 'Open' },
  //   { id: 'TCK-2026-981', date: 'May 30, 2026', subject: 'Bill of Lading documentation format change', status: 'Resolved' },
  // ];
  // NEW
  const fallbackTickets = [
    { id: 'TCK-2026-982', date: 'Jun 11, 2026', subject: 'Inquiry status update on Custom Mailers shipment', status: 'Open' },
    { id: 'TCK-2026-981', date: 'May 30, 2026', subject: 'Customized packaging design specifications review', status: 'Resolved' },
  ];

  const activeTickets = [...ticketsList, ...fallbackTickets];

  const columns = [
    {
      key: 'id',
      label: 'Ticket ID',
      render: (val) => <span className="font-mono font-semibold text-slate-800 dark:text-white">{val}</span>
    },
    {
      key: 'date',
      label: 'Created',
      render: (val) => <span className="text-slate-500">{val}</span>
    },
    {
      key: 'subject',
      label: 'Subject description',
      render: (val) => <span className="font-semibold text-slate-700 dark:text-slate-200">{val}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const colors = {
          'Open': 'bg-blue-50 text-blue-600 border-blue-200',
          'In Progress': 'bg-amber-50 text-amber-600 border-amber-200',
          'Resolved': 'bg-emerald-50 text-emerald-600 border-emerald-200',
          'Closed': 'bg-slate-50 text-slate-655 border-slate-200',
        };
        return (
          <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${colors[val] || 'bg-slate-100'}`}>
            {val}
          </span>
        );
      }
    }
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!selectedTopic) return;
    if (isOther && !otherText.trim()) return;
    setIsLoading(true);
    
    dispatch(createTicket({ subject: effectiveSubject, message: desc }))
      .unwrap()
      .then(() => {
        setIsLoading(false);
        setSelectedTopic('');
        setOtherText('');
        setDesc('');
        setShowCreate(false);
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err || 'Failed to dispatch ticket');
      });
  };

  return (
    <div className="flex flex-col gap-8 py-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-border/40 dark:border-slate-800/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
            Support Desk
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Submit inquiry queries to our customer support representatives or packaging specialists.
          </p>
        </div>

        <Button
          variant={showCreate ? 'outline' : 'primary'}
          onClick={() => setShowCreate(!showCreate)}
          icon={FiPlus}
        >
          {showCreate ? 'View My Tickets' : 'Open Support Ticket'}
        </Button>
      </div>

      {showCreate ? (
        <Card variant="glass" hover={false} className="p-6 border-slate-200 dark:border-slate-800 max-w-2xl">
          <form onSubmit={handleCreate} className="flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-850">
              Submit Helpdesk Ticket
            </h3>

            {/* Subject / Topic Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Subject / Topic <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedTopic}
                  onChange={(e) => {
                    setSelectedTopic(e.target.value);
                    if (e.target.value !== 'Other') setOtherText('');
                  }}
                  required
                  className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white px-4 py-2.5 pr-10 outline-none focus:border-secondary dark:focus:border-accent transition-colors shadow-sm cursor-pointer"
                >
                  <option value="" disabled>Select a topic...</option>
                  {supportTopics.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Always show additional detail input after any selection */}
            {selectedTopic && (
              <div className="flex flex-col gap-1.5 animate-fade-in-up">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {isOther ? 'Describe your issue *' : 'Additional details (optional)'}
                </label>
                <input
                  type="text"
                  value={isOther ? otherText : desc}
                  onChange={(e) => isOther ? setOtherText(e.target.value) : setDesc(e.target.value)}
                  placeholder={isOther
                    ? 'Please describe your specific issue or question...'
                    : `Add more context about your ${selectedTopic.toLowerCase()}...`
                  }
                  required={isOther}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:border-secondary dark:focus:border-accent transition-colors shadow-sm"
                />
              </div>
            )}

            <Textarea
              label="Core Problem Details"
              placeholder="Provide tracking code references, shipping line details, or document codes."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              icon={FiSend}
              iconPosition="right"
              className="w-full mt-2"
            >
              Dispatch Ticket
            </Button>
          </form>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <Table
            columns={columns}
            data={activeTickets}
            emptyMessage="No helpdesk support tickets recorded."
            className="border-border-default/70 bg-background-surface"
          />
        </div>
      )}
    </div>
  );
}
