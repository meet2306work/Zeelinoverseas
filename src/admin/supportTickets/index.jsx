import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiMessageSquare, FiSend, FiUser, FiInfo, FiChevronDown } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Table from '../../commonComponents/tables/Table';
import Button from '../../commonComponents/buttons/Button';
import Drawer from '../../commonComponents/drawers/Drawer';
import Textarea from '../../commonComponents/textareas/Textarea';
import { fetchAllTickets, addTicketReply, selectAllTickets } from '../../redux/slices/ticketSlice';

export default function AdminSupportTicketsScreen() {
  const dispatch = useDispatch();
  const ticketsList = useSelector(selectAllTickets);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setReplyText('');
    setIsDrawerOpen(true);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() && newStatus === selectedTicket.status) return;

    setIsSubmitting(true);
    try {
      const messagePayload = replyText.trim() || `Status updated to ${newStatus}`;
      const response = await dispatch(addTicketReply({
        ticketId: selectedTicket._id || selectedTicket.id,
        message: messagePayload,
        status: newStatus
      })).unwrap();

      // Update local drawer state with the updated ticket
      setSelectedTicket(response);
      setReplyText('');
      alert('Ticket updated successfully');
      dispatch(fetchAllTickets()); // Refresh the main table
    } catch (error) {
      alert(error || 'Failed to update ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: '_id',
      label: 'Ticket ID',
      render: (_, row) => <span className="font-mono font-bold text-slate-550 dark:text-slate-400">{row._id || row.id}</span>
    },
    {
      key: 'user',
      label: 'Customer',
      render: (val) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-white">
            {val ? `${val.firstName || ''} ${val.lastName || ''}`.trim() || 'Anonymous' : 'Guest'}
          </span>
          <span className="text-[11px] text-slate-500 font-mono select-all">
            {val?.email || 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (val) => <span className="font-semibold text-slate-700 dark:text-slate-200">{val}</span>
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (val) => {
        const colors = {
          'Low': 'bg-slate-100 text-slate-750 dark:bg-slate-800 dark:text-slate-300',
          'Medium': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-500/25',
          'High': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-500/25',
          'Urgent': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-500/25',
        };
        return (
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${colors[val] || 'bg-slate-100'}`}>
            {val || 'Medium'}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const colors = {
          'Open': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/25',
          'In Progress': 'bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25',
          'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25',
          'Closed': 'bg-slate-150 text-slate-600 border-slate-250 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-800/25',
        };
        return (
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${colors[val] || 'bg-slate-100'}`}>
            {val}
          </span>
        );
      }
    },
    {
      key: 'date',
      label: 'Created',
      render: (val) => <span className="text-xs text-slate-500">{val}</span>
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOpenTicket(row)}
          className="border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
        >
          View & Reply
        </Button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-8 py-2 animate-fade-in-up">
      {/* Header toolbar */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Customer Support Desk
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Resolve support tickets, read customer inquiries, and manage global logistic responses.
          </p>
        </div>
      </div>

      {/* Tickets Database Table */}
      <Table
        columns={columns}
        data={ticketsList}
        emptyMessage="No customer support tickets recorded."
        className="text-slate-700 dark:text-slate-355"
      />

      {/* Detail & Reply Thread Slide Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Support Ticket Details`}
        size="lg"
      >
        {selectedTicket && (
          <div className="flex flex-col gap-6 text-slate-750 dark:text-slate-300 h-full">
            {/* Header info */}
            <div className="flex flex-col gap-3.5 bg-slate-50 dark:bg-slate-950 p-4.5 rounded-xl border border-slate-200 dark:border-slate-850">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <FiInfo className="h-4 w-4" />
                <span>Inquiry Overview</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                {selectedTicket.subject}
              </h3>
              <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                {selectedTicket.message}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-xs mt-2 text-slate-600 dark:text-slate-400">
                <div>Customer: <span className="font-bold text-slate-900 dark:text-slate-200">{selectedTicket.user ? `${selectedTicket.user.firstName || ''} ${selectedTicket.user.lastName || ''}`.trim() : 'Guest'}</span></div>
                <div>Email: <span className="font-mono text-slate-900 dark:text-slate-200">{selectedTicket.user?.email || 'N/A'}</span></div>
                <div>Priority: <span className="font-semibold text-amber-600 dark:text-amber-400">{selectedTicket.priority}</span></div>
                <div>Current Status: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedTicket.status}</span></div>
              </div>
            </div>

            {/* Replies / Message Log */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FiMessageSquare className="h-4 w-4" />
                <span>Conversation Thread ({selectedTicket.replies?.length || 0})</span>
              </span>

              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {selectedTicket.replies?.length === 0 ? (
                  <div className="text-xs text-slate-500 text-center py-6 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    No replies yet. Use the response workspace below to start negotiation.
                  </div>
                ) : (
                  selectedTicket.replies.map((reply, index) => {
                    const isCurrentUser = reply.user === selectedTicket.user?._id || reply.user === selectedTicket.user?.id;
                    return (
                      <div 
                        key={reply._id || index}
                        className={`flex flex-col gap-1.5 p-3.5 rounded-2xl max-w-[85%] border ${
                          isCurrentUser
                            ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 self-start'
                            : 'bg-teal-50/40 dark:bg-teal-950/20 border-teal-150/40 dark:border-teal-900/30 self-end text-right items-end'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                          <FiUser className="h-3 w-3" />
                          <span>{isCurrentUser ? 'Client' : 'ZO Support Agent'}</span>
                          <span>•</span>
                          <span>{new Date(reply.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-medium whitespace-pre-line">
                          {reply.message}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply} className="flex flex-col gap-4 mt-auto border-t border-slate-100 dark:border-slate-850 pt-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-350 uppercase tracking-wider">
                  Update Ticket Status
                </label>
                <div className="relative">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white px-4 py-2.5 pr-10 outline-none focus:border-secondary dark:focus:border-accent transition-colors shadow-sm cursor-pointer font-medium"
                  >
                    <option value="Open">Open (Unresolved)</option>
                    <option value="In Progress">In Progress (Active Negotiation)</option>
                    <option value="Resolved">Resolved (Complete)</option>
                    <option value="Closed">Closed (Locked)</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <Textarea
                label="Write Response Message"
                placeholder="Propose solutions, request shipping documentation copies, or declare milestones..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="w-full"
                icon={FiSend}
                iconPosition="right"
              >
                Submit Response & Update Status
              </Button>
            </form>
          </div>
        )}
      </Drawer>
    </div>
  );
}
