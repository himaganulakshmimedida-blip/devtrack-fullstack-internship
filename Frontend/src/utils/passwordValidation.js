export const PASSWORD_RULES = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'At least one uppercase letter (A-Z)',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    label: 'At least one lowercase letter (a-z)',
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: 'number',
    label: 'At least one number (0-9)',
    test: (password) => /[0-9]/.test(password),
  },
  {
    id: 'special',
    label: 'At least one special character (!@#$%^&*)',
    test: (password) => /[!@#$%^&*]/.test(password),
  },
]

export function getPasswordValidation(password = '') {
  return PASSWORD_RULES.map((rule) => ({
    ...rule,
    satisfied: rule.test(password),
  }))
}

export function isPasswordValid(password = '') {
  return getPasswordValidation(password).every((rule) => rule.satisfied)
}

export function getPasswordValidationMessage(password = '') {
  const failedRules = getPasswordValidation(password).filter(
    (rule) => !rule.satisfied
  )

  if (failedRules.length === 0) {
    return null
  }

  return `Password must meet all requirements: ${failedRules
    .map((rule) => rule.label.toLowerCase())
    .join('; ')}`
}
