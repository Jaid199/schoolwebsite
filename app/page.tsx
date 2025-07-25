import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      {/* hero section */}
      <section
        className="relative w-full min-h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/hero-background.png')", // Updated image path
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-2/3 max-w-2xl flex flex-col items-center justify-center p-8 bg-black/60 rounded-lg">
          <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">
            Welcome to the Race!
          </h1>
          <p className="text-lg text-white drop-shadow-lg">
            Join the excitement and experience the thrill of competition.
            Discover upcoming events, results, and more.
          </p>
        </div>
      </section>
      {/* race route section */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-8 py-12">
        <div className="w-full md:w-1/2 flex justify-end">
          <Image
            src="/images/race-route.png" // Updated image path
            alt="Race event"
            width={500}
            height={500}
            className="rounded-lg shadow-lg object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-start">
          <div className="max-w-[600px] px-6 md:px-12">
            <h2 className="text-2xl font-semibold mb-3">
              Experience the Action
            </h2>
            <p className="text-gray-700 text-lg">
              Our races bring together competitors from all backgrounds to test
              their skills and push their limits. Whether you're a seasoned
              racer or a newcomer, there's a place for you on the track. Explore
              our events, meet fellow enthusiasts, and be part of an
              unforgettable journey!
            </p>
          </div>
        </div>
      </section>
      {/* age categories table section */}
      <section className="py-12 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-6">
          Race Events & Details
        </h2>
        <div className="max-w-5xl w-fit mx-auto px-4">
          <Table className="min-w-[900px] bg-white rounded-lg shadow-md">
            <TableHeader>
              <TableRow>
                <TableHead className="py-3 px-8 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                  Name
                </TableHead>
                <TableHead className="py-3 px-8 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                  Distance
                </TableHead>
                <TableHead className="py-3 px-8 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                  Start Time
                </TableHead>
                <TableHead className="py-3 px-8 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                  Additional Notes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b">
                <TableCell className="py-4 px-8">Kids Race</TableCell>
                <TableCell className="py-4 px-8">1 km</TableCell>
                <TableCell className="py-4 px-8">08:30 AM</TableCell>
                <TableCell className="py-4 px-8">
                  Parental consent required. Medals for all finishers.
                </TableCell>
              </TableRow>
              <TableRow className="border-b">
                <TableCell className="py-4 px-8">5K</TableCell>
                <TableCell className="py-4 px-8">5 km</TableCell>
                <TableCell className="py-4 px-8">09:00 AM</TableCell>
                <TableCell className="py-4 px-8">
                  Open to all. Commemorative t-shirt for participants.
                </TableCell>
              </TableRow>
              <TableRow className="border-b">
                <TableCell className="py-4 px-8">10K</TableCell>
                <TableCell className="py-4 px-8">10 km</TableCell>
                <TableCell className="py-4 px-8">09:45 AM</TableCell>
                <TableCell className="py-4 px-8">
                  Prizes for top 3 finishers. Water stations on course.
                </TableCell>
              </TableRow>
              <TableRow className="border-b">
                <TableCell className="py-4 px-8">Half Marathon</TableCell>
                <TableCell className="py-4 px-8">21.1 km</TableCell>
                <TableCell className="py-4 px-8">10:30 AM</TableCell>
                <TableCell className="py-4 px-8">
                  Finisher medals and refreshments at the finish line.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-4 px-8">Full Marathon</TableCell>
                <TableCell className="py-4 px-8">42.2 km</TableCell>
                <TableCell className="py-4 px-8">11:00 AM</TableCell>
                <TableCell className="py-4 px-8">
                  Special recognition for all finishers. Medical support
                  available.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
      {/* CTA section */}
      <section className="py-12 bg-blue-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Join the Race?</h2>
        <p className="mb-6 text-lg">
          Register now and be a part of an unforgettable event!
        </p>
        <Link
          href="/register"
          className="inline-block bg-white font-semibold px-8 py-3 rounded-full shadow transition hover:bg-gray-100 text-blue-900"
        >
          Register Now
        </Link>
        <p className="mt-6 text-sm text-blue-200">
          <span className="italic">
            Note: Item collection point is at <strong>MNU location</strong>.
          </span>
        </p>
      </section>
      {/* footer section */}
      <Footer />
    </>
  );
}
