# Personal Website Setup Guide

## Step 1: Initial Setup

1. Create project structure:
bash
mkdir personal-website
cd personal-website
mkdir client server


2. Initialize root project:
bash
In root directory (personal-website/)
npm init -y


3. Update root package.json:
json
{
"name": "personal-website",
"version": "1.0.0",
"scripts": {
"server": "cd server && npm run dev",
"client": "cd client && npm start",
"dev": "concurrently \"npm run server\" \"npm run client\"",
"install-all": "npm install && cd server && npm install && cd ../client && npm install"
},
"devDependencies": {
"concurrently": "^7.0.0"
}
}
