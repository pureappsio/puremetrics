Accounts.ui.config({
  requestPermissions: {
	  google: [
	    'https://www.googleapis.com/auth/analytics.readonly'
	  ],
	  facebook: ['ads_read']
  },
  requestOfflineToken: {
    google: true,
  },
  forceApprovalPrompt: {
    google: true,
  }
});
