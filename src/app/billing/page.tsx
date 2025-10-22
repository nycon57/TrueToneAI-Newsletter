import { redirect } from 'next/navigation';

/**
 * Billing page redirect
 * Redirects to the account page with billing tab selected
 */
export default function BillingPage() {
  redirect('/account?tab=billing');
}
