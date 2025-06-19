export default function About() {
  return (
    <div className="flex flex-col bg-[#fffaf7] text-gray-800 py-16 px-6">
      <main className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-[#ff5722]">
          About <span className="text-[#ff5722]">Us</span>
        </h2>

        <p className="text-lg leading-relaxed mb-6">
          At <span className="font-semibold text-[#ff5722] logo">STEAKZ</span>,
          we’re dedicated to delivering exceptional dining experiences. From our
          perfectly grilled steaks to our house-made sauces and sides, every
          dish is prepared with passion and precision.
        </p>

        <p className="text-lg leading-relaxed mb-6">
          Our team is made up of expert chefs, attentive staff, and creative
          individuals, all committed to making your visit memorable. Whether
          you’re enjoying a relaxed evening out or celebrating a special
          occasion, STEAKZ combines bold flavors, warm hospitality, and an
          inviting ambiance.
        </p>

        <p className="text-lg leading-relaxed">
          Come taste the flame, and become a part of the STEAKZ family.
        </p>
      </main>
    </div>
  );
}
