import { useEffect, useRef, useState } from 'react'
import { employeeApi, userApi } from '../../api'
import { Card, Badge, Spinner } from '../../components/ui/Primitives'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Camera, Mail, Phone, Calendar, Briefcase, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/api$/, '')

export default function EmployeeProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phoneNumber: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [changingPw, setChangingPw] = useState(false)

  const fetchProfile = () => {
    setLoading(true)
    employeeApi.getMyProfile()
      .then(({ data }) => {
        setProfile(data.data)
        setEditForm({
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          phoneNumber: data.data.phoneNumber || '',
        })
      })
      .catch(() => toast.error('Failed to load your profile'))
      .finally(() => setLoading(false))
  }

  useEffect(fetchProfile, [])

  const handleProfileSave = async (ev) => {
    ev.preventDefault()
    setSavingProfile(true)
    try {
      const { data } = await employeeApi.updateMyProfile(editForm)
      setProfile(data.data)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleImageSelect = async (ev) => {
    const file = ev.target.files?.[0]
    if (!file || !profile) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const { data } = await employeeApi.uploadImage(profile.id, formData)
      setProfile(data.data)
      toast.success('Profile photo updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const validatePassword = () => {
    const e = {}
    const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).+$/
    if (!pwForm.currentPassword) e.currentPassword = 'Required'
    if (!pwForm.newPassword) e.newPassword = 'Required'
    else if (pwForm.newPassword.length < 8) e.newPassword = 'Min 8 characters'
    else if (!pattern.test(pwForm.newPassword)) e.newPassword = 'Needs upper, lower, digit & symbol'
    if (pwForm.confirmPassword !== pwForm.newPassword) e.confirmPassword = 'Passwords do not match'
    setPwErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePasswordChange = async (ev) => {
    ev.preventDefault()
    if (!validatePassword()) return
    setChangingPw(true)
    try {
      await userApi.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      toast.success('Password changed successfully')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setChangingPw(false)
    }
  }

  if (loading || !profile) {
    return <div className="flex h-64 items-center justify-center"><Spinner size={32} /></div>
  }

  const imageUrl = profile.profileImageUrl ? `${API_ORIGIN}${profile.profileImageUrl}` : null

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="flex flex-col items-center text-center lg:col-span-1">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-navy-100 text-2xl font-semibold text-navy-700 dark:bg-navy-800 dark:text-navy-200">
            {imageUrl ? (
              <img src={imageUrl} alt={profile.fullName} className="h-full w-full object-cover" />
            ) : (
              `${profile.firstName[0]}${profile.lastName[0]}`
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="focus-ring absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-white shadow-soft hover:bg-navy-800 dark:bg-amber-400 dark:text-navy-950"
            aria-label="Change profile photo"
          >
            {uploading ? <Spinner size={14} /> : <Camera size={14} />}
          </button>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageSelect} />
        </div>

        <h2 className="mt-4 font-display text-lg font-bold text-navy-900 dark:text-white">{profile.fullName}</h2>
        <p className="font-mono text-xs text-navy-400">{profile.employeeCode}</p>
        <Badge tone={profile.status === 'ACTIVE' ? 'success' : 'danger'} className="mt-2">{profile.status}</Badge>

        <div className="mt-5 w-full space-y-3 border-t border-navy-100 pt-4 text-left text-sm dark:border-navy-800">
          <div className="flex items-center gap-2.5 text-navy-600 dark:text-navy-300">
            <Mail size={15} className="text-navy-400" /> {profile.email}
          </div>
          <div className="flex items-center gap-2.5 text-navy-600 dark:text-navy-300">
            <Phone size={15} className="text-navy-400" /> {profile.phoneNumber || 'Not provided'}
          </div>
          <div className="flex items-center gap-2.5 text-navy-600 dark:text-navy-300">
            <Building2 size={15} className="text-navy-400" /> {profile.departmentName || 'Not assigned'}
          </div>
          <div className="flex items-center gap-2.5 text-navy-600 dark:text-navy-300">
            <Briefcase size={15} className="text-navy-400" /> {profile.designation}
          </div>
          <div className="flex items-center gap-2.5 text-navy-600 dark:text-navy-300">
            <Calendar size={15} className="text-navy-400" /> Joined {profile.joiningDate}
          </div>
        </div>
      </Card>

      <div className="space-y-6 lg:col-span-2">
        <Card>
          <h3 className="mb-4 font-display text-base font-semibold text-navy-900 dark:text-white">Personal Information</h3>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="First name" value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} />
              <Input label="Last name" value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} />
            </div>
            <Input label="Phone number" value={editForm.phoneNumber}
              onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })} />
            <div className="flex justify-end">
              <Button type="submit" loading={savingProfile}>Save changes</Button>
            </div>
          </form>
        </Card>

        <Card>
          <h3 className="mb-4 font-display text-base font-semibold text-navy-900 dark:text-white">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input label="Current password" type="password" value={pwForm.currentPassword} error={pwErrors.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="New password" type="password" value={pwForm.newPassword} error={pwErrors.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
              <Input label="Confirm new password" type="password" value={pwForm.confirmPassword} error={pwErrors.confirmPassword}
                onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="secondary" loading={changingPw}>Update password</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
