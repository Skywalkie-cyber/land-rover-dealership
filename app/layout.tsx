import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Land Rover | Premium Luxury SUVs — Official Dealership",
    template: "%s | Land Rover Dealership",
  },
  description: "Discover the world's finest luxury SUVs at our official Land Rover dealership. Explore the Range Rover, Defender, Discovery, and more. Book a test drive today.",
  keywords: ["Land Rover", "Range Rover", "Defender", "Discovery", "luxury SUV", "dealership", "test drive"],
  authors: [{ name: "Land Rover Dealership" }],
  openGraph: {
    type: "website",
    siteName: "Land Rover Dealership",
    title: "Land Rover | Premium Luxury SUVs",
    description: "Experience unparalleled luxury and capability with Land Rover.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
