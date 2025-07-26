import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "@icons-pack/react-simple-icons";

export default function Footer() {
  return (
    <footer className="py-8 bg-gray-100 text-center text-gray-700">
      {/* MNU Logo and Organizer using Card */}
      <div className="w-full flex justify-center mb-4 md:mb-0">
        <Card className="w-fit text-center shadow-none border-none bg-transparent p-0">
          <CardContent className="flex flex-col items-center p-0">
            <Link
              href="https://mnu.edu.mv"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MNU Home"
            >
              <img
                src="/images/mnu-logo.png"
                alt="Maldives National University Logo"
                style={{ width: "200px", height: "auto" }}
                className="mx-auto mb-2"
              />
            </Link>
            <p className="text-sm text-gray-500">
              Organized by Maldives National University
            </p>
          </CardContent>
        </Card>
      </div>
      <hr className="my-6 max-w-7xl w-3/4 mx-auto" />
      <div className="container w-fit md:w-full mx-auto flex flex-col items-center gap-6 md:flex-row md:justify-between md:items-start md:gap-12 px-4 md:px-12">
        {/* Useful Links Section */}
        <div className="flex flex-col items-center md:items-center justify-center w-full md:w-1/3 mb-4 md:mb-0">
          <div className="w-full md:w-fit text-left">
            <p className="font-semibold">Useful Links</p>
            <ul>
              <li>
                <Link href="/" className="transition hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/races/latest"
                  className="transition hover:underline"
                >
                  Latest Race
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* MNU Address Section */}
        <div className="flex flex-col items-center md:items-center justify-center w-full md:w-1/3 mb-4 md:mb-0">
          <div className="w-full md:w-fit text-left">
            <p className="font-semibold">Address</p>
            <p>MNU Central Administration,</p>
            <p>Rahdhebai Hingun,</p>
            <p>Malé 20371, Maldives</p>
          </div>
        </div>
        {/* Further Contact Section */}
        <div className="flex flex-col items-center md:items-center justify-center w-full md:w-1/3">
          <div className="w-full md:w-fit text-left">
            <p className="mb-1 font-semibold">Further Contact</p>
            <p>
              Email:{" "}
              <Link
                href="mailto:info@3000tfg.com"
                className="transition hover:underline"
              >
                info@3000tfg.com
              </Link>
            </p>
            <p>
              Phone:{" "}
              <Link
                href="tel:+9603345400"
                className="transition hover:underline"
              >
                +960 3345400
              </Link>
            </p>
            <div className="mt-4">
              <p className="mb-1 font-semibold">Socials</p>
              <div className="flex gap-3">
                <Link
                  href="https://www.facebook.com/mnu.edu.mv"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="transition hover:text-blue-600"
                >
                  <SiFacebook className="h-5 w-5" />
                </Link>
                <Link
                  href="https://twitter.com/mnu_edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="transition hover:text-blue-400"
                >
                  <SiX className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.instagram.com/mnu.edu.mv"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="transition hover:text-pink-600"
                >
                  <SiInstagram className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.youtube.com/@mnu_edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="transition hover:text-red-600"
                >
                  <SiYoutube className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-6 text-sm text-center">
        &copy; {new Date().getFullYear()} MNU. All rights reserved.
      </p>
    </footer>
  );
}
