import { Locations } from "../helper/locations";
export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 grid">
          <h3 className="text-lg font-bold text-[#ff5722] mb-2">
            Become a Part of Our Grill Crew!
          </h3>
          <p className="text-sm text-gray-300">
            Join the <span className="text-[#ff5722] logo">STEAKZ</span> family
            and help us turn up the heat in the kitchen. We're looking for
            passionate, driven individuals who thrive in a fast-paced
            environment and take pride in serving unforgettable meals. Contact
            us on{" "}
            <span className="underline underline-offset-3 font-bold">
              join@steakz.com
            </span>
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#ff5722] mb-2">
            Our Locations
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {Locations.map((loc) => (
              <li>{loc}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
