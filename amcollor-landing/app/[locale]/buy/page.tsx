import BuyClient from "@/app/components/buy/BuyClient";
import { getDictionary, Locale } from "@/app/lib/dictionaries";

export default async function BuyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);

  return (
    <BuyClient locale={typedLocale} dict={dict} />
  );
}
