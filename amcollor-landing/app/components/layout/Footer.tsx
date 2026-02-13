"use client";

import { brand } from "../../lib/brand";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type Props = {
  locale: "fa" | "en";
  dict: any;
};

export default function Footer({ locale, dict }: Props) {
  const isFa = locale === "fa";
  const pathname = usePathname();

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    if (pathname === `/${locale}` || pathname === `/${locale}/`) {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = `/${locale}#${anchor}`;
    }
  };

  const texts = dict?.footer || {};

  return (
    <footer
      className="px-6 py-14 text-sm text-white"
      style={{ background: brand.BackgroundDark }}
      dir={isFa ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-6xl flex flex-col gap-12">
        {/* Row 1: Logo + Logotype */}
        <div className="flex justify-center border-b border-white/10 pb-10">
          <div className={`flex flex-col gap-4 ${isFa ? "items-start" : "items-end"}`}>
            <Link href={`/${locale}`} className="flex justify-center w-full mx-auto">
              <Image
                src="/images/logo.svg"
                alt="AMCOLLAR"
                width={200}
                height={200}
                className={`h-20 md:h-22 w-auto mx-auto `}
                loading="lazy"
              />
            </Link>

            <div className="w-full flex justify-center">
              <Image
                src="/images/LOGOTYPEr.svg"
                alt="AMCOLLAR Typo"
                width={100}
                height={50}
                className="h-12 w-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Links in one row (2 columns) */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-20 ${isFa ? "ml-32" : "mr-32"}`}>
          <div>
            <ul className="space-y-4 opacity-80">
              <li>
                <Link href={`/${locale}/contact`} className="hover:opacity-100 transition">
                  {texts.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:opacity-100 transition">
                  {texts.contact}
                </Link>
              </li>
              <li>
                <a
                  href={`/${locale}#vetcoopration`}
                  onClick={(e) => handleAnchorClick(e, "vetcoopration")}
                  className="hover:opacity-100 transition"
                >
                  {texts.cooperation}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}#vetcoopration`}
                  onClick={(e) => handleAnchorClick(e, "vetcoopration")}
                  className="hover:opacity-100 transition"
                >
                  {texts.faq}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <ul className="space-y-4 opacity-80">
              <li>
                <Link href={`/${locale}/terms`} className="hover:opacity-100 transition">
                  {texts.terms}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="hover:opacity-100 transition">
                  {texts.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookies`} className="hover:opacity-100 transition">
                  {texts.cookies}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Row 3: Address + socials | Enamad */}
        <div className={`mt-6 grid gap-8 items-start ${isFa ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          <div className="space-y-2 opacity-80 text-sm leading-7">
            <p>
              {texts.address} {texts.addressLine1}
              <br />
              {texts.addressLine2}
              <br />
              {texts.postalCode}
            </p>
            <p>{texts.phone}</p>
            <p>{texts.mobile}</p>

            <div className="flex gap-3 opacity-80 pt-1">
              <a
                href="https://instagram.com/am_collar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10"
              >
                <Image src="/images/social/instagram.png" alt="Instagram" width={30} height={30} />
              </a>
              <a
                href="https://wa.me/989965701706"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10"
              >
                <Image src="/images/social/whatsapp.png" alt="WhatsApp" width={30} height={30} />
              </a>
            </div>
          </div>

          {isFa && (
            <div className="flex justify-start md:justify-end pl-25">
              <a
                referrerPolicy="origin"
                target="_blank"
                href="https://trustseal.enamad.ir/?id=685968&Code=3lVLi6PJJnuVu4NmExNRRLI4WDf2pJwj"
              >
                <img
                  referrerPolicy="origin"
                  src={
                    process.env.NODE_ENV === "development"
                      ? "/images/enamad-placeholder.svg"
                      : "https://trustseal.enamad.ir/logo.aspx?id=685968&Code=3lVLi6PJJnuVu4NmExNRRLI4WDf2pJwj"
                  }
                  alt="Enamad"
                  style={{
                    cursor: "pointer",
                    height: 130,
                    marginLeft: 20,
                    marginRight: 20,
                  }}
                  data-code="3lVLi6PJJnuVu4NmExNRRLI4WDf2pJwj"
                />
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-white/10 pt-6 text-center text-xs opacity-70">{texts.copyright}</div>
      </div>
    </footer>
  );
}