const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')
const { logger } = require('../middleware/logger')

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      proxy: true,
      timeout: 30000, // Increase timeout to 30 seconds
      passReqToCallback: true,
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      state: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        if (!profile || !profile.id) {
          logger.error('Invalid profile data received from Google')
          return done(new Error('Invalid profile data received from Google'))
        }

        let user = await User.findOne({ googleId: profile.id })

        if (!user) {
          if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
            logger.error('No email provided from Google')
            return done(new Error('No email provided from Google'))
          }

          user = await User.create({
            googleId: profile.id,
            name: profile.displayName || 'User',
            email: profile.emails[0].value,
            avatar: profile.photos?.[0]?.value || '',
            isVerified: true,
            role: 'user',
          })
        }

        return done(null, user)
      } catch (error) {
        logger.error('Google Auth Error:', error)
        if (error.oauthError && error.oauthError.code === 'ETIMEDOUT') {
          logger.error('Timeout error occurred while obtaining access token from Google')
        }
        return done(error, null)
      }
    }
  )
)

// Required for sessions
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

module.exports = passport
