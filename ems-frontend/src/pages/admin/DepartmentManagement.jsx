import { useEffect, useState } from 'react'
import { departmentApi } from '../../api'
import { Card } from '../../components/ui/Primitives'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchDepartments = () => {
    setLoading(true)
    departmentApi.getAll()
      .then(({ data }) => setDepartments(data.data))
      .catch(() => toast.error('Failed to load departments'))
      .finally(() => setLoading(false))
  }

  useEffect(fetchDepartments, [])

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '' }); setErrors({}); setModalOpen(true) }
  const openEdit = (dept) => { setEditing(dept); setForm({ name: dept.name, description: dept.description || '' }); setErrors({}); setModalOpen(true) }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!form.name) { setErrors({ name: 'Required' }); return }
    setSaving(true)
    try {
      if (editing) {
        await departmentApi.update(editing.id, form)
        toast.success('Department updated')
      } else {
        await departmentApi.create(form)
        toast.success('Department created')
      }
      setModalOpen(false)
      fetchDepartments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save department')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await departmentApi.remove(deleteTarget.id)
      toast.success('Department deleted')
      setDeleteTarget(null)
      fetchDepartments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete department')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white">Departments</h2>
          <p className="text-sm text-navy-500 dark:text-navy-400">{departments.length} departments</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Add Department</Button>
      </div>

      {loading ? (
        <p className="text-sm text-navy-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <Card key={d.id} className="flex flex-col justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-navy-900 dark:text-white">{d.name}</h3>
                <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">{d.description || 'No description'}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-3 dark:border-navy-800">
                <span className="flex items-center gap-1.5 text-xs text-navy-400">
                  <Users size={13} /> {d.employeeCount} employees
                </span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(d)} className="focus-ring rounded-lg p-1.5 text-navy-500 hover:bg-navy-100 dark:hover:bg-navy-800">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(d)} className="focus-ring rounded-lg p-1.5 text-danger hover:bg-danger/10">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Department' : 'Add Department'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Department name" value={form.name} error={errors.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save changes' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete department"
        message={`Delete "${deleteTarget?.name}"? Departments with assigned employees cannot be deleted.`}
      />
    </div>
  )
}
