import { useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { employeeApi, departmentApi } from '../../api'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  departmentId: '',
  designation: '',
  salary: '',
  joiningDate: '',
  status: 'ACTIVE',
}

export default function EmployeeFormModal({ open, onClose, employee, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [departments, setDepartments] = useState([])
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      departmentApi.getAll().then(({ data }) => setDepartments(data.data))
    }
  }, [open])

  useEffect(() => {
    if (employee) {
      setForm({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phoneNumber: employee.phoneNumber || '',
        departmentId: employee.departmentId || '',
        designation: employee.designation || '',
        salary: employee.salary || '',
        joiningDate: employee.joiningDate || '',
        status: employee.status || 'ACTIVE',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [employee, open])

  const validate = () => {
    const e = {}
    if (!form.firstName) e.firstName = 'Required'
    if (!form.lastName) e.lastName = 'Required'
    if (!form.email) e.email = 'Required'
    if (!form.departmentId) e.departmentId = 'Required'
    if (!form.designation) e.designation = 'Required'
    if (!form.salary || Number(form.salary) < 0) e.salary = 'Enter a valid salary'
    if (!form.joiningDate) e.joiningDate = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setSaving(true)
    const payload = { ...form, salary: Number(form.salary), departmentId: Number(form.departmentId) }
    try {
      if (employee) {
        await employeeApi.update(employee.id, payload)
        toast.success('Employee updated successfully')
      } else {
        await employeeApi.create(payload)
        toast.success('Employee added successfully')
      }
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save employee')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={employee ? 'Edit Employee' : 'Add Employee'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First name" value={form.firstName} error={errors.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <Input label="Last name" value={form.lastName} error={errors.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          <Input label="Email" type="email" value={form.email} error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone number" value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
          <Select label="Department" value={form.departmentId} error={errors.departmentId}
            onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Select>
          <Input label="Designation" value={form.designation} error={errors.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })} />
          <Input label="Salary (annual)" type="number" min="0" value={form.salary} error={errors.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          <Input label="Joining date" type="date" value={form.joiningDate} error={errors.joiningDate}
            onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} />
          <Select label="Status" value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </Select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>{employee ? 'Save changes' : 'Add employee'}</Button>
        </div>
      </form>
    </Modal>
  )
}
