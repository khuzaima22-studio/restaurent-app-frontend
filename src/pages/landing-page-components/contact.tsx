import { Locations } from "../../helper/locations";

export default function Contact() {
  return (
    <div className="flex flex-col bg-white text-gray-800 py-16 px-6">
      <main className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-[#ff5722]">
          Contact Us
        </h2>

        <div className="space-y-10">
          <div>
            <h3 className="text-xl font-semibold text-[#ff5722] mb-2">Email</h3>
            <p>info@steakz.com</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#ff5722] mb-2">Phone</h3>
            <p>+34 616 888 4321</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#ff5722] mb-2">
              Our Locations
            </h3>
            <ul className="text-base leading-relaxed list-disc pl-5">
              {Locations.map((loc) => (
                <li>{loc}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
