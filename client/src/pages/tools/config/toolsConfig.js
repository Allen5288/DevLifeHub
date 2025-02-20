import {
  CalendarMonth as CalendarIcon,
  Code as JsonIcon,
  Lock as KeyGenIcon,
  Translate as Base64Icon,
  Key as JwtIcon,
  Google as GoogleIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material'

export const TOOLS_CONFIG = [
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format and validate JSON data',
    icon: JsonIcon,
    path: '/tools/json-formatter',
  },
  {
    id: 'base64',
    title: 'Base64 Converter',
    description: 'Encode and decode Base64 strings',
    icon: Base64Icon,
    path: '/tools/base64',
  },
  {
    id: 'session-key',
    title: 'Session Key Generator',
    description: 'Generate secure session keys',
    icon: KeyGenIcon,
    path: '/tools/session-key',
  },
  {
    id: 'jwt-config',
    title: 'JWT Configuration',
    description: 'Generate JWT configuration and keys',
    icon: JwtIcon,
    path: '/tools/jwt-config',
  },
  {
    id: 'google-oauth',
    title: 'Google OAuth Setup',
    description: 'Configure Google OAuth credentials',
    icon: GoogleIcon,
    path: '/tools/google-oauth',
  },
  {
    id: 'calendar',
    title: 'Class Calendar',
    description: 'Manage your teaching schedule and track earnings',
    icon: CalendarIcon,
    path: '/tools/calendar',
  },
  {
    id: 'code-compare',
    title: 'Code Compare',
    description: 'Show Code diffs',
    icon: CalendarIcon,
    path: '/tools/code-compare',
  },
  {
    id: 'salary-calculator',
    title: 'Salary Calculator',
    description: 'Calculate mutlple country tax and after tax salary',
    icon: CalendarIcon,
    path: '/tools/salary-calculator',
  },
  {
    id: 'currency-exchange',
    title: 'Currency Exchange',
    description: 'Have a quick look for the currency exchange rates',
    icon: CalendarIcon,
    path: '/tools/currency-exchange',
  },
  {
    id: 'todo',
    title: 'Todo Manager',
    description: 'Organize your tasks and projects efficiently',
    icon: CalendarIcon,
    path: '/tools/todo',
  },
  {
    id: 'loan-calculator',
    title: 'Loan Calculator',
    description: 'Calculate loan payments with support for CNY and AUD currencies',
    icon: CalculateIcon,
    path: '/tools/loan-calculator',
  }
]
