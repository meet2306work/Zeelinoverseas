import { useState } from 'react';
import { FiLock, FiCheck, FiInfo } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Button from '../../commonComponents/buttons/Button';

export default function AdminRolesPermissionsScreen() {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [isSaving, setIsSaving] = useState(false);

  const roles = [
    { id: 'admin', label: 'Administrator', desc: 'Full core administrative settings access, logs auditing, database credentials, and roles assignment.' },
    { id: 'sales', label: 'Sales Executive', desc: 'Interact with CRM leads, process product inquiries, negotiate customer RFQ prices.' },
    // OLD (commented out - do not delete)
    // { id: 'logistics', label: 'Logistics Coordinator', desc: 'Manage client orders cargo statuses, update ocean line tracking details, check thresholds.' },
    // NEW
    { id: 'logistics', label: 'Logistics Coordinator', desc: 'Manage client orders delivery statuses, update shipping tracking details, check thresholds.' },
  ];

  const permissions = [
    { key: 'read-catalog', label: 'Browse Products Catalog', desc: 'Allows viewing and searching in-stock catalog.' },
    { key: 'edit-catalog', label: 'Write & Edit Catalog', desc: 'Allows inserting, updating, or deleting products/categories.' },
    { key: 'manage-leads', label: 'CRM Leads Management', desc: 'Allows viewing, updating, and assigning leads in the CRM database.' },
    // OLD (commented out - do not delete)
    // { key: 'manage-orders', label: 'Process Logistics Orders', desc: 'Allows updating shipping line numbers and eta coordinates.' },
    // NEW
    { key: 'manage-orders', label: 'Process Logistics Orders', desc: 'Allows updating shipping tracking numbers and delivery dates.' },
    { key: 'audit-logs', label: 'View System Audit Logs', desc: 'Allows viewing database security entries and actor actions.' },
  ];

  const [rolePermissions, setRolePermissions] = useState({
    admin: ['read-catalog', 'edit-catalog', 'manage-leads', 'manage-orders', 'audit-logs'],
    sales: ['read-catalog', 'manage-leads'],
    logistics: ['read-catalog', 'manage-orders'],
  });

  const handleTogglePermission = (permKey) => {
    const activePerms = rolePermissions[selectedRole];
    let nextPerms;
    if (activePerms.includes(permKey)) {
      nextPerms = activePerms.filter(k => k !== permKey);
    } else {
      nextPerms = [...activePerms, permKey];
    }
    setRolePermissions({
      ...rolePermissions,
      [selectedRole]: nextPerms,
    });
  };

  const handleSaveMatrix = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Access Control List matrix saved successfully!');
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8 py-2 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            User Roles & Permissions Matrix
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Define system roles and configure active permissions to control layout routing access across team members.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roles List */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Select System Role</h3>
          <div className="flex flex-col gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`p-4 rounded-xl text-left border transition-all duration-200
                  ${selectedRole === role.id
                    ? 'bg-blue-50/80 border-blue-200 text-blue-700 shadow-md dark:bg-secondary/10 dark:border-secondary dark:text-white'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100/70 hover:text-slate-800 dark:bg-slate-950/20 dark:border-slate-850 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-200'
                  }
                `}
              >
                <div className="font-bold text-sm">{role.label}</div>
                <div className="text-[11px] mt-1.5 opacity-80 leading-relaxed">{role.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Settings Matrix */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Access Matrix for: <span className="text-cyan-600 dark:text-cyan-400">{roles.find(r => r.id === selectedRole)?.label}</span>
            </h3>
            
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleSaveMatrix}
              isLoading={isSaving}
            >
              Save ACL Matrix
            </Button>
          </div>

          <Card variant="glass" hover={false} className="p-6 flex flex-col gap-5">
            {permissions.map((perm) => {
              const isChecked = rolePermissions[selectedRole].includes(perm.key);
              return (
                <div 
                  key={perm.key} 
                  onClick={() => handleTogglePermission(perm.key)}
                  className="flex items-start gap-4 p-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/50 cursor-pointer transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                >
                  <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all shrink-0 mt-0.5
                    ${isChecked 
                      ? 'bg-secondary border-secondary text-white' 
                      : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950'
                    }
                  `}>
                    {isChecked && <FiCheck className="h-3.5 w-3.5" />}
                  </div>
                  
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">{perm.label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1 block">{perm.desc}</span>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}
