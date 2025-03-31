// This script provides developer account credentials for testing purposes
// Run with: node scripts/create-dev-account.js

console.log('='.repeat(50));
console.log('DEVELOPER ACCOUNT CREDENTIALS');
console.log('='.repeat(50));
console.log('');
console.log('Email:      dev@tennispro.com');
console.log('Password:   TennisPro2025!');
console.log('Membership: Premium');
console.log('');
console.log('Note: This is a special developer account that bypasses Supabase authentication.');
console.log('It allows you to log in without email verification during development.');
console.log('');
console.log('To use these credentials:');
console.log('1. Go to the login page at /auth/login');
console.log('2. Enter the email and password above');
console.log('3. You will be logged in as a developer with Premium membership');
console.log('4. Your authentication state will be stored in localStorage and cookies');
console.log('5. You will have access to all protected routes');
console.log('');
console.log('Implementation details:');
console.log('- The dev login bypasses Supabase entirely');
console.log('- Regular users still use the normal Supabase authentication flow');
console.log('- The dev authentication state is stored in localStorage and synced to cookies');
console.log('- The middleware checks for the dev auth cookie to allow access to protected routes');
console.log('');
console.log('='.repeat(50));
