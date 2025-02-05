const crypto = require('crypto')

const generateSecretKey = () => {
  return crypto.randomBytes(64).toString('hex')
}

console.log('Generated Session Secret Key:')
console.log(generateSecretKey())
