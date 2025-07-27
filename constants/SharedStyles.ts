import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from './Design';

export const SharedStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    backgroundColor: 'transparent',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.lg,
  },

  // Typography
  title: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
  },
  sectionTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray[800],
    marginBottom: Spacing.md,
  },
  bodyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray[600],
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
  },
  caption: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray[500],
    fontWeight: Typography.fontWeight.medium,
  },

  // Buttons
  primaryButton: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  primaryButtonGradient: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.transparent,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  outlineButtonText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  smallOutlineButton: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.transparent,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  smallOutlineButtonText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },

  // Form Elements
  inputContainer: {
    marginBottom: Spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.gray[200],
    paddingHorizontal: Spacing.md,
    height: 56,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  inputIcon: {
    marginRight: Spacing.sm,
    color: Colors.primary,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.gray[800],
    paddingVertical: Spacing.sm,
  },
  inputHint: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray[500],
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },

  // Logo and Branding
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.xl,
  },
  logoText: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: Typography.fontSize.lg,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: Typography.fontWeight.medium,
  },

  // Layout Helpers
  row: {
    flexDirection: 'row',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  flex1: {
    flex: 1,
  },

  // Spacing
  marginBottomSm: {
    marginBottom: Spacing.sm,
  },
  marginBottomMd: {
    marginBottom: Spacing.md,
  },
  marginBottomLg: {
    marginBottom: Spacing.lg,
  },
  marginBottomXl: {
    marginBottom: Spacing.xl,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    marginTop: Spacing.md,
    fontWeight: Typography.fontWeight.medium,
  },

  // Headers
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingTop: Spacing.md,
  },
  welcomeText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    marginTop: Spacing.xs,
  },

  // Feature Items
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: Typography.fontSize.xs,
    marginTop: Spacing.sm,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
  },
});