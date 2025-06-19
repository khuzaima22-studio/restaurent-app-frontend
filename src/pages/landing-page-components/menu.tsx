export default function Menu() {
  const menuItems = [
    {
      name: "Smoked BBQ Beef Ribs",
      description:
        "Tender, slow-smoked beef ribs glazed in a rich, smoky barbecue sauce.",
      price: "$18.99",
    },
    {
      name: "Classic Cheeseburger",
      description:
        "Grilled beef patty topped with melted cheddar, fresh lettuce, tomato, and our signature house sauce.",
      price: "$12.49",
    },
  ];

  return (
    <div className="flex flex-col bg-white text-gray-800 py-16 px-4 sm:px-6 lg:px-12">
      <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-[#ff5722]">
        Our Most Loved Items
      </h2>

      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg max-h-[500px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-[#ffefe6] text-[#ff5722] sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">#</th>
              <th className="px-6 py-4 text-left font-semibold">Item</th>
              <th className="px-6 py-4 text-left font-semibold">Description</th>
              <th className="px-6 py-4 text-left font-semibold">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {menuItems.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-[#fff6f0] transition-colors duration-200"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-semibold">{item.name}</td>
                <td className="px-6 py-4">{item.description}</td>
                <td className="px-6 py-4 text-[#ff5722] font-bold">
                  {item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
