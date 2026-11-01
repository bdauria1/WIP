import PocketBase from 'pocketbase'

export const pb = new PocketBase('/')
pb.autoCancellation(false)

const FRIENDLY_CODES = {
  validation_not_unique: 'is already in use',
  validation_required: 'is required',
  validation_is_email: 'must be a valid email address',
  validation_min_text_constraint: 'must be at least 8 characters',
}

export function errorMessage(error) {
  if (error?.isAbort || error?.status === 0) return 'Could not reach the server. Check your connection.'
  const fields = error?.response?.data
  if (fields && typeof fields === 'object') {
    for (const [name, field] of Object.entries(fields)) {
      if (!field?.message) continue
      const label = name === 'passwordConfirm' ? 'Password' : name[0].toUpperCase() + name.slice(1)
      return `${label} ${FRIENDLY_CODES[field.code] || field.message.toLowerCase()}`
    }
  }
  return error?.response?.message || error?.message || 'Something went wrong.'
}
