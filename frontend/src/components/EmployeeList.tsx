import React, { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { Avatar } from './Avatar';
import { AvatarUpload } from './AvatarUpload';
import { CSVUploader } from './CSVUploader';
import type { CSVRow } from './CSVUploader';
import { Pencil, Trash2, Copy } from 'lucide-react';
import { Icon } from '@stellar/design-system';
import { EmployeeRemovalConfirmModal } from './EmployeeRemovalConfirmModal';

interface Employee {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  position: string;
  wallet?: string;
  salary?: number;
  status?: 'Active' | 'Inactive';
}

interface EmployeeListProps {
  employees: Employee[];
  isLoading?: boolean;
  onEmployeeClick?: (employee: Employee) => void;
  onAddEmployee: (employee: Employee) => void;
  onEditEmployee?: (employee: Employee) => void;
  onRemoveEmployee?: (id: string) => void;
  onUpdateEmployeeImage?: (id: string, imageUrl: string) => void;
}

const SKELETON_ROW_COUNT = 5;

const EmployeeSkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200/20">
    {/* Name column */}
    <td className="p-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-300/30 shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="h-2.5 rounded bg-gray-300/30 w-3/4" />
          <div className="h-2 rounded bg-gray-300/20 w-1/2" />
        </div>
      </div>
    </td>
    {/* Role */}
    <td className="p-6">
      <div className="h-2.5 rounded bg-gray-300/30 w-2/3" />
    </td>
    {/* Wallet */}
    <td className="p-6">
      <div className="h-2.5 rounded bg-gray-300/20 w-3/4 font-mono" />
    </td>
    {/* Salary */}
    <td className="p-6">
      <div className="h-2.5 rounded bg-gray-300/30 w-1/2" />
    </td>
    {/* Status */}
    <td className="p-6">
      <div className="h-5 rounded-full bg-gray-300/20 w-16" />
    </td>
    {/* Actions */}
    <td className="p-6">
      <div className="flex gap-2">
        <div className="w-5 h-5 rounded bg-gray-300/20" />
        <div className="w-5 h-5 rounded bg-gray-300/20" />
      </div>
    </td>
  </tr>
);

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  isLoading = false,
  onAddEmployee,
  onEditEmployee,
  onRemoveEmployee,
  onUpdateEmployeeImage,
}) => {
  const [csvData, setCsvData] = useState<Employee[]>([]);
  const [showCSVUploader, setShowCSVUploader] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<{ open: boolean; employee?: Employee }>({
    open: false,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    open: boolean;
    employee?: Employee;
  }>({
    open: false,
  });
  const [showAvatarModal, setShowAvatarModal] = useState<{
    open: boolean;
    employee?: Employee;
  }>({ open: false });
  const [sortKey, setSortKey] = useState<keyof Employee>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleDataParsed = (data: CSVRow[]) => {
    const newEmployees = data.map((row) => ({
      id: String(Date.now() + Math.random()),
      name: row.data.name,
      email: row.data.email,
      wallet: row.data.wallet,
      position: row.data.position,
      salary: Number(row.data.salary) || 0,
      status: (row.data.status as 'Active' | 'Inactive') || 'Active',
    }));
    setCsvData(newEmployees);
  };

  const handleAddEmployees = () => {
    csvData.forEach((employee) => {
      onAddEmployee(employee);
    });
    setCsvData([]);
    setShowCSVUploader(false);
  };

  const handleSort = (key: keyof Employee) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredEmployees = debouncedSearch
    ? employees.filter((emp) => {
        const q = debouncedSearch.toLowerCase();
        return (
          emp.name.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.position.toLowerCase().includes(q)
        );
      })
    : employees;

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const valA = a[sortKey] ?? '';
    const valB = b[sortKey] ?? '';
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const shortenWallet = (wallet: string) => {
    if (!wallet) return '';
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  };

  // Add Modal (simple inline for demo)
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: '',
    name: '',
    email: '',
    position: '',
    wallet: '',
    salary: 0,
    status: 'Active',
  });

  const handleAddModalSubmit = () => {
    onAddEmployee({
      ...newEmployee,
      id: String(Date.now() + Math.random()),
    });
    setNewEmployee({
      id: '',
      name: '',
      email: '',
      position: '',
      wallet: '',
      salary: 0,
      status: 'Active',
    });
    setShowAddModal(false);
  };

  // Edit Modal (simple inline for demo)
  const [editSalary, setEditSalary] = useState<number>(0);

  const handleEditModalSubmit = () => {
    if (showEditModal.employee && onEditEmployee) {
      onEditEmployee({
        ...showEditModal.employee,
        salary: editSalary,
      });
    }
    setShowEditModal({ open: false });
  };

  // Delete Confirm
  const handleDeleteConfirm = (employeeId: string) => {
    if (onRemoveEmployee) {
      onRemoveEmployee(employeeId);
    }
    setShowDeleteConfirm({ open: false });
  };

  return (
    <div className="w-full card glass noise overflow-hidden p-0">
      <div className="flex flex-wrap justify-between items-center gap-3 p-6">
        <span className="font-bold text-lg">Employees</span>
        <input
          type="search"
          id="employee-search"
          aria-label="Search employees"
          placeholder="Search by name, email, or role…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded border border-gray-300 bg-transparent px-3 py-1.5 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <table className="w-full table-fixed text-left border-collapse">
        <thead>
          <tr className="border-b border-hi">
            <th
              className="w-[28%] p-6 text-xs font-bold uppercase tracking-widest text-muted cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Name {sortKey === 'name' && (sortAsc ? '▲' : '▼')}
            </th>
            <th
              className="w-[18%] p-6 text-xs font-bold uppercase tracking-widest text-muted cursor-pointer"
              onClick={() => handleSort('position')}
            >
              Role {sortKey === 'position' && (sortAsc ? '▲' : '▼')}
            </th>
            <th
              className="w-[16%] p-6 text-xs font-bold uppercase tracking-widest text-muted cursor-pointer"
              onClick={() => handleSort('wallet')}
            >
              Wallet {sortKey === 'wallet' && (sortAsc ? '▲' : '▼')}
            </th>
            <th
              className="w-[14%] p-6 text-xs font-bold uppercase tracking-widest text-muted cursor-pointer"
              onClick={() => handleSort('salary')}
            >
              Salary {sortKey === 'salary' && (sortAsc ? '▲' : '▼')}
            </th>
            <th
              className="p-6 text-xs font-bold uppercase tracking-widest text-muted cursor-pointer"
              onClick={() => handleSort('status')}
            >
              Status {sortKey === 'status' && (sortAsc ? '▲' : '▼')}
            </th>
            <th className="p-6 text-xs font-bold uppercase tracking-widest text-muted">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200/5">
          {isLoading ? (
            Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => <EmployeeSkeletonRow key={i} />)
          ) : sortedEmployees.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <Icon.User className="text-muted w-12 h-12 opacity-20" />
                  <p className="text-muted font-medium">
                    {debouncedSearch ? `No employees match "${debouncedSearch}"` : 'No employees found'}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            sortedEmployees.map((employee, idx) => (
              <tr
                key={employee.id}
                className="group cursor-pointer transition-all hover:bg-accent/[0.03]"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar
                        email={employee.email}
                        name={employee.name}
                        imageUrl={employee.imageUrl}
                        size="md"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-bg ${employee.status === 'Active' ? 'bg-success' : 'bg-danger'}`} />
                    </div>
                    <div className="min-w-0 flex flex-col">
                      <span
                        className="truncate text-sm font-bold text-text group-hover:text-accent transition-colors"
                        title={employee.name}
                      >
                        {employee.name}
                      </span>
                      <span
                        className="truncate text-xs text-muted"
                        title={employee.email}
                      >
                        {employee.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text truncate">{employee.position}</span>
                    <span className="text-[10px] text-muted uppercase tracking-wider">Position</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 group/wallet">
                    <code className="text-[10px] text-muted font-mono bg-surface-hi px-2 py-1 rounded border border-border">
                      {shortenWallet(employee.wallet || '')}
                    </code>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold text-text">
                      {onEditEmployee ? (
                        <button
                          className="hover:text-accent transition-colors"
                          onClick={() => {
                            setEditSalary(employee.salary || 0);
                            setShowEditModal({ open: true, employee });
                          }}
                        >
                          ${(employee.salary ?? 0).toLocaleString()}
                        </button>
                      ) : (
                        `$${(employee.salary ?? 0).toLocaleString()}`
                      )}
                    </span>
                    <span className="text-[10px] text-muted uppercase tracking-wider">per month</span>
                  </div>
                </td>
                <td className="p-6">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                      employee.status === 'Active'
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-danger/10 text-danger border-danger/20'
                    }`}
                  >
                    {employee.status || '-'}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-2 text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                      title="Edit"
                      onClick={() => {
                        setEditSalary(employee.salary || 0);
                        setShowEditModal({ open: true, employee });
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                      title="Remove"
                      onClick={() => setShowDeleteConfirm({ open: true, employee })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* CSV Import */}
      <div className="p-6 w-full flex flex-col items-center justify-center text-center bg-black/10">
        <p className="text-muted mb-4 font-medium">Need to migrate your legacy payroll system?</p>
        {!showCSVUploader && (
          <button
            className="text-accent font-bold text-sm hover:underline"
            onClick={() => setShowCSVUploader(true)}
          >
            Import from CSV
          </button>
        )}
        {showCSVUploader && (
          <div className="w-full max-w-2xl mx-auto">
            <CSVUploader
              requiredColumns={['name', 'email', 'wallet', 'position', 'salary', 'status']}
              onDataParsed={handleDataParsed}
            />
            <div className="flex gap-2 justify-center mt-4">
              <button
                onClick={handleAddEmployees}
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={csvData.length === 0}
              >
                Add Employees from CSV
              </button>
              <button
                onClick={() => {
                  setShowCSVUploader(false);
                  setCsvData([]);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add Employee</h2>
            <input
              type="text"
              placeholder="Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Wallet"
              value={newEmployee.wallet}
              onChange={(e) => setNewEmployee({ ...newEmployee, wallet: e.target.value })}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Position"
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              type="number"
              placeholder="Salary"
              value={newEmployee.salary}
              onChange={(e) => setNewEmployee({ ...newEmployee, salary: Number(e.target.value) })}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <select
              value={newEmployee.status}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, status: e.target.value as 'Active' | 'Inactive' })
              }
              className="w-full mb-4 px-3 py-2 border rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddModalSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {showEditModal.open && showEditModal.employee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Salary</h2>
            <div className="mb-4">
              <span className="font-semibold">{showEditModal.employee.name}</span>
              <span className="ml-2 text-xs text-muted">{showEditModal.employee.position}</span>
            </div>
            <input
              type="number"
              value={editSalary}
              onChange={(e) => setEditSalary(Number(e.target.value))}
              className="w-full mb-4 px-3 py-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal({ open: false })}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditModalSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Employee Removal Confirmation Modal */}
      <EmployeeRemovalConfirmModal
        isOpen={showDeleteConfirm.open}
        employeeName={showDeleteConfirm.employee?.name || ''}
        employeeId={showDeleteConfirm.employee?.id || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm({ open: false })}
      />

      {showAvatarModal.open && showAvatarModal.employee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6">
            <h2 className="mb-4 text-lg font-bold">Update Employee Photo</h2>
            <AvatarUpload
              email={showAvatarModal.employee.email}
              name={showAvatarModal.employee.name}
              currentImageUrl={showAvatarModal.employee.imageUrl}
              label="Upload Employee Photo"
              onImageUpload={(imageUrl) => {
                if (onUpdateEmployeeImage) {
                  onUpdateEmployeeImage(showAvatarModal.employee!.id, imageUrl);
                } else if (onEditEmployee) {
                  onEditEmployee({ ...showAvatarModal.employee!, imageUrl });
                }
                setShowAvatarModal({ open: false });
              }}
            />
            <button
              type="button"
              className="mt-4 w-full rounded bg-gray-200 px-3 py-2 text-sm text-gray-700"
              onClick={() => setShowAvatarModal({ open: false })}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
