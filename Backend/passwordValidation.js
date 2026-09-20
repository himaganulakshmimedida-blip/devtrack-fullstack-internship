const PASSWORD_RULES = [
  {
    label: 'at least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    label: 'at least one uppercase letter (A-Z)',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: 'at least one lowercase letter (a-z)',
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: 'at least one number (0-9)',
    test: (password) => /[0-9]/.test(password),
  },
  {
    label: 'at least one special character (!@#$%^&*)',
    test: (password) => /[!@#$%^&*]/.test(password),
  },
]

function validateSignupPassword(password) {
  if (!password || typeof password !== 'string') {
    return 'Password is required'
  }

  const failedRules = PASSWORD_RULES.filter((rule) => !rule.test(password))

  if (failedRules.length === 0) {
    return null
  }

  return `Password must include ${failedRules.map((rule) => rule.label).join(', ')}`
}

module.exports = {
  validateSignupPassword,
}
