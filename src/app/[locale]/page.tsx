import { redirect } from "@/navigation";
import { useLocale } from 'next-intl';

export default function RootPage() {
  const locale = useLocale();
  redirect({ href: '/home', locale });
}
