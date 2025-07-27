export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email address is already registered. Please use a different email or try logging in.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with this email address. Please check your email or sign up.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials and try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/requires-recent-login':
      return 'Please log in again to continue.';
    case 'auth/configuration-not-found':
      return 'Firebase configuration error. Please check your internet connection and try again.';
    case 'auth/app-not-authorized':
      return 'This app is not authorized to use Firebase Authentication. Please contact support.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';
    default:
      console.error('Unknown auth error:', errorCode);
      return 'An error occurred. Please try again.';
  }
};