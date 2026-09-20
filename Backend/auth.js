const crypto = require('crypto')

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

function getJwtSecret() {
  return process.env.JWT_SECRET || 'devtrack-temporary-jwt-secret'
}

function createAuthToken(userId) {
  const payload = {
    userId,
    exp: Date.now() + TOKEN_TTL_MS,
  }

  const payloadSegment = Buffer.from(JSON.stringify(payload)).toString(
    'base64url'
  )
  const signature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(payloadSegment)
    .digest('base64url')

  return `${payloadSegment}.${signature}`
}

function verifyAuthToken(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  const [payloadSegment, signature] = token.split('.')
  if (!payloadSegment || !signature) {
    return null
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', getJwtSecret())
      .update(payloadSegment)
      .digest('base64url')

    if (signature !== expectedSignature) {
      return null
    }

    const payload = JSON.parse(
      Buffer.from(payloadSegment, 'base64url').toString('utf8')
    )

    const userId = Number(payload.userId)
    if (!Number.isFinite(userId) || payload.exp < Date.now()) {
      return null
    }

    return userId
  } catch (error) {
    return null
  }
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication required',
    })
  }

  const token = authHeader.slice(7)
  const userId = verifyAuthToken(token)

  if (!Number.isFinite(userId)) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    })
  }

  req.userId = userId
  req.user = { id: userId }
  next()
}

function ownerQuery(userId) {
  const numericId = Number(userId)
  return {
    userId: { $in: [numericId, String(numericId)] },
  }
}

function identityQuery(userId) {
  const numericId = Number(userId)
  return {
    id: { $in: [numericId, String(numericId)] },
  }
}

async function findOwnedOrDeny(collection, numericId, userId) {
  const document = await collection.findOne({ id: numericId })

  if (!document) {
    return { status: 404, message: 'Resource not found' }
  }

  if (Number(document.userId) !== Number(userId)) {
    return { status: 403, message: 'You do not have access to this resource' }
  }

  return { document }
}

function sanitizeUser(user) {
  if (!user) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

function buildAuthResponse(user) {
  const safeUser = sanitizeUser(user)

  return {
    ...safeUser,
    token: createAuthToken(Number(user.id)),
  }
}

module.exports = {
  createAuthToken,
  verifyAuthToken,
  requireAuth,
  sanitizeUser,
  buildAuthResponse,
  ownerQuery,
  identityQuery,
  findOwnedOrDeny,
}
