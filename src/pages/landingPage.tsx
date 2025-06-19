import Footer from "../reusable-components/footer";
import NavBar from "../reusable-components/navbar";
import About from "./landing-page-components/about";
import Contact from "./landing-page-components/contact";
import Menu from "./landing-page-components/menu";
import bgFood from "../assets/images/bg-food.png";
import steak1 from "../assets/images/steak-1.jpg";
import steak2 from "../assets/images/steak-2.jpg";
import { useState } from "react";
import TableBookModal from "./landing-page-components/book-table-modal";
export default function LandingPage() {
  const [isTableBookModal, setIsTableBookModal] = useState(false);
  const onclose = () => {
    setIsTableBookModal(!isTableBookModal);
  };
  return (
    <div className="bg-white text-gray-900">
      <NavBar />

      <main
        className={`min-h-screen text-center flex justify-center items-center flex-col bg-contain bg-center`}
        style={{ backgroundImage: `url(${bgFood})` }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          WELCOME TO <span className="text-[#ff5722] logo">STEAKZ</span>
        </h1>
        <div className="flex justify-center mt-6">
          <button
            className="bg-[#ff5722] hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-md transition"
            onClick={() => {
              setIsTableBookModal(true);
            }}
          >
            Book a Table
          </button>
          {isTableBookModal && (
            <TableBookModal isOpen={isTableBookModal} onclose={onclose} />
          )}
        </div>
      </main>
      <Menu />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 lg:px-12 mx-auto ">
        <div className="h-[30rem] ">
          <img
            src={steak1}
            alt="steak1"
            className="h-full w-full object-cover"
          />
        </div>
        <About />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 lg:px-12 mx-auto ">
        <Contact />
        <div className="h-[30rem] ">
          <img
            src={steak2}
            alt="steak2"
            className="h-full w-full object-cover"
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
