import { redirect } from 'next/navigation';

export default function Page() {
  // Redirect to the actual home page in the (public) route group
  redirect('/');
}
