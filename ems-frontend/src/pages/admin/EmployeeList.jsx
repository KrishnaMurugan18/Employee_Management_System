import { useEffect, useState, useCallback } from 'react'
import { employeeApi, departmentApi } from '../../api'
import useDebounce from '../../hooks/useDebounce'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import { Badge, Spinner } from '../../components/ui/Primitives'
import EmployeeFormModal from '../../components/employee/EmployeeFormModal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Search, Plus, Download, Pencil, Trash2, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [sortBy, setSortBy] = useState('id')
  const [sortDir, setSortDir] = useState('asc')

  const [formOpen, setFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [exporting, setExporting] = useState(false)

  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    departmentApi.getAll().then(({ data }) => setDepartments(data.data))
  }, [])

  const fetchEmployees = useCallback(() => {
    setLoading(true)
    employeeApi
      .search({
        search: debouncedSearch || undefined,
        departmentId: departmentId || undefined,
        status: status || undefined,
        page,
        size: 10,
        sortBy,
        sortDir,
      })
      .then(({ data }) => {
        setEmployees(data.data.content)
        setTotalPages(data.data.totalPages)
        setTotalElements(data.data.totalElements)
      })
      .catch(() => toast.error('Failed to load employees'))
      .finally(() => setLoading(false))
  }, [debouncedSearch, departmentId, status, page, sortBy, sortDir])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await employeeApi.remove(deleteTarget.id)
      toast.success('Employee deleted')
      setDeleteTarget(null)
      fetchEmployees()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete employee')
    } finally {
      setDeleting(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const { data } = await employeeApi.exportExcel({
        search: debouncedSearch || undefined,
        departmentId: departmentId || undefined,
        status: status || undefined,
      })
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'employees.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Export downloaded')
    } catch {
      toast.error('Failed to export employees')
    } finally {
      setExporting(false)
    }
  }

  const SortHeader = ({ field, children }) => (
    <button
      onClick={() => toggleSort(field)}
      className="focus-ring flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-navy-500 hover:text-navy-800 dark:text-navy-400 dark:hover:text-navy-100"
    >
      {children}
      <ArrowUpDown size={12} className={sortBy === field ? 'text-amber-500' : 'opacity-40'} />
    </button>
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white">Employees</h2>
          <p className="text-sm text-navy-500 dark:text-navy-400">{totalElements} total employees</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} loading={exporting}>
            <Download size={16} /> Export
          </Button>
          <Button onClick={() => { setEditingEmployee(null); setFormOpen(true) }}>
            <Plus size={16} /> Add Employee
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
          <Input
            placeholder="Search by name, email or code..."
            value={search}
            className="pl-10"
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          />
        </div>
        <Select value={departmentId} onChange={(e) => { setDepartmentId(e.target.value); setPage(0) }}>
          <option value="">All departments</option>
          {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </Select>
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0) }}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl2 border border-navy-100 bg-card-light shadow-soft dark:border-navy-800 dark:bg-card-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy-100 bg-navy-50 dark:border-navy-800 dark:bg-navy-900">
              <tr>
                <th className="px-4 py-3"><SortHeader field="employeeCode">ID</SortHeader></th>
                <th className="px-4 py-3"><SortHeader field="firstName">Name</SortHeader></th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-400">Department</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-400">Designation</th>
                <th className="px-4 py-3"><SortHeader field="salary">Salary</SortHeader></th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-400">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center"><Spinner className="mx-auto" /></td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-navy-400">No employees match your filters</td></tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-navy-50 last:border-0 hover:bg-navy-50/60 dark:border-navy-800/60 dark:hover:bg-navy-900/40">
                    <td className="px-4 py-3 font-mono text-xs text-navy-500 dark:text-navy-400">{emp.employeeCode}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-100 text-xs font-semibold text-navy-700 dark:bg-navy-800 dark:text-navy-200">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-navy-900 dark:text-white">{emp.fullName}</p>
                          <p className="truncate text-xs text-navy-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-navy-700 dark:text-navy-300">{emp.departmentName || '—'}</td>
                    <td className="px-4 py-3 text-navy-700 dark:text-navy-300">{emp.designation}</td>
                    <td className="px-4 py-3 font-mono text-navy-700 dark:text-navy-300">
                      ₹{Number(emp.salary).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={emp.status === 'ACTIVE' ? 'success' : 'danger'}>{emp.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => { setEditingEmployee(emp); setFormOpen(true) }}
                          className="focus-ring rounded-lg p-2 text-navy-500 hover:bg-navy-100 dark:hover:bg-navy-800"
                          aria-label={`Edit ${emp.fullName}`}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(emp)}
                          className="focus-ring rounded-lg p-2 text-danger hover:bg-danger/10"
                          aria-label={`Delete ${emp.fullName}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-navy-100 px-4 py-3 dark:border-navy-800">
          <p className="text-xs text-navy-400">Page {totalPages === 0 ? 0 : page + 1} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={14} />
            </Button>
            <Button variant="outline" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>

      <EmployeeFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        employee={editingEmployee}
        onSaved={fetchEmployees}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete employee"
        message={`Are you sure you want to delete ${deleteTarget?.fullName}? This action cannot be undone.`}
      />
    </div>
  )
}
