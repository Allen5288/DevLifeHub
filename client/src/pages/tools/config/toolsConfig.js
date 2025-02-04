import {
  CalendarMonth as CalendarIcon,
  Code as JsonIcon,
  Lock as KeyGenIcon,
  Translate as Base64Icon,
  Key as JwtIcon,
  Google as GoogleIcon
} from '@mui/icons-material';

export const TOOLS_CONFIG = [
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format and validate JSON data',
    icon: JsonIcon,
    path: '/tools/json-formatter'
  },
  {
    id: 'base64',
    title: 'Base64 Converter',
    description: 'Encode and decode Base64 strings',
    icon: Base64Icon,
    path: '/tools/base64'
  },
  {
    id: 'session-key',
    title: 'Session Key Generator',
    description: 'Generate secure session keys',
    icon: KeyGenIcon,
    path: '/tools/session-key'
  },
  {
    id: 'jwt-config',
    title: 'JWT Configuration',
    description: 'Generate JWT configuration and keys',
    icon: JwtIcon,
    path: '/tools/jwt-config'
  },
  {
    id: 'google-oauth',
    title: 'Google OAuth Setup',
    description: 'Configure Google OAuth credentials',
    icon: GoogleIcon,
    path: '/tools/google-oauth'
  },
  {
    id: 'calendar',
    title: 'Class Calendar',
    description: 'Manage your teaching schedule and track earnings',
    icon: CalendarIcon,
    path: '/tools/calendar'
  }
];