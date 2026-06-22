import { useState, useEffect } from 'react';
import { FiUser, FiSearch, FiEdit2, FiTrash2, FiUserCheck, FiShield } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Table from '../../commonComponents/tables/Table';
import Button from '../../commonComponents/buttons/Button';
import Modal from '../../commonComponents/modals/Modal';
import Input from '../../commonComponents/inputs/Input';
import Dropdown from '../../commonComponents/dropdowns/Dropdown';
import apiClient from '../../services/apiClient';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [role, setRole] = useState('user');
  const [status, setStatus] = useState('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/users');
      setUsers(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setRole(user.role || 'user');
    setStatus(user.status || 'active');
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await apiClient.put(`/users/${editingUser._id}`, { role, status });
      const updatedUser = response.data.data;
      setUsers(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u));
      setIsEditModalOpen(false);
      alert('User settings updated successfully.');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to permanently delete user ${user.firstName || 'Client'} (${user.email})?`)) {
      try {
        await apiClient.delete(`/users/${user._id}`);
        setUsers(prev => prev.filter(u => u._id !== user._id));
        alert('User deleted successfully.');
      } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(u => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
    return fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
  });

  const columns = [
    {
      key: '_id',
      label: 'User ID',
      render: (val) => <span className="font-mono font-bold text-slate-500 dark:text-slate-400 text-xs">{val}</span>
    },
    {
      key: 'name',
      label: 'Name',
      render: (_, row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
            {(row.firstName ? row.firstName[0] : 'U').toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 dark:text-white">{`${row.firstName || ''} ${row.lastName || ''}`.trim() || 'Anonymous'}</span>
            {row.companyName && <span className="text-[10px] text-slate-400 font-semibold uppercase">{row.companyName}</span>}
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email Address',
      render: (val) => <span className="font-mono text-slate-700 dark:text-slate-300 text-xs select-all">{val}</span>
    },
    {
      key: 'role',
      label: 'Role',
      render: (val) => {
        const isAdmin = val === 'admin';
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
            isAdmin 
              ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-500/10' 
              : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}>
            {isAdmin ? <FiShield className="h-3 w-3 shrink-0" /> : <FiUser className="h-3 w-3 shrink-0" />} {val}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Account Status',
      render: (val) => {
        const isActive = val === 'active';
        return (
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
            isActive 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
              : 'bg-red-50 text-red-700 border-red-250 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
          }`}>
            {val || 'active'}
          </span>
        );
      }
    },
    {
      key: 'createdAt',
      label: 'Joined Date',
      render: (val) => <span className="text-xs text-slate-500 dark:text-slate-400">{val ? new Date(val).toLocaleDateString() : 'N/A'}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="p-2 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white" 
            onClick={() => handleOpenEdit(row)}
          >
            <FiEdit2 className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="p-2 border-slate-200 dark:border-slate-800 text-slate-550 hover:text-brand-danger hover:bg-red-50 dark:hover:bg-red-950/20" 
            onClick={() => handleDeleteUser(row)}
          >
            <FiTrash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-8 py-2 animate-fade-in-up">
      {/* Header Toolbar */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            User Workspace Accounts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage store registration accounts, adjust authorization roles, and audit login activity logs.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="glass" hover={false} className="p-4 flex items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search accounts name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={FiSearch}
          />
        </div>
      </Card>

      {/* User Database Table */}
      <Table
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
        emptyMessage="No registered user accounts match search criteria."
        className="text-slate-700 dark:text-slate-350"
      />

      {/* User edit modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User Authority Settings"
        size="sm"
      >
        {editingUser && (
          <form onSubmit={handleUpdateUser} className="flex flex-col gap-5 text-slate-900 dark:text-white">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200">{`${editingUser.firstName || ''} ${editingUser.lastName || ''}`}</div>
              <div className="font-mono text-slate-500 dark:text-slate-400 mt-0.5">{editingUser.email}</div>
            </div>

            <Dropdown
              label="User Role Authority"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { label: 'Standard Customer (user)', value: 'user' },
                { label: 'CRM System Admin (admin)', value: 'admin' },
              ]}
              required
            />

            <Dropdown
              label="Account Authorization Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { label: 'Active (Unlocked)', value: 'active' },
                { label: 'Inactive (Suspended)', value: 'inactive' },
              ]}
              required
            />

            <div className="flex gap-3 justify-end mt-4">
              <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" isLoading={isSubmitting} icon={FiUserCheck}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
