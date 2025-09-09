export const config = {
  // AO Network Configuration
  aoProcessId: 'iuy9lPpMoMcA5gqglNbZ7QreP57Wn4n3leLRk_weiCI', // TODO: Replace with your AO process ID
  
  // APUS HyperBEAM Node Configuration
  apusHyperbeamNodeUrl: 'http://72.46.85.207:8734',
  
  // App Configuration
  appName: 'Oco Agent',
  appLogo: undefined,
  
  // UI Configuration
  theme: {
    accent: { r: 9, g: 29, b: 255 },
  },
  
  // Wallet Configuration
  walletPermissions: ['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'DISPATCH'] as const,
  ensurePermissions: true,
} as const; 