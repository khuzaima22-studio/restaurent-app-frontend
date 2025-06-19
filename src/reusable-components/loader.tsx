import { LuLoaderCircle } from "react-icons/lu";

export default function Loader() {
  return (
    <p className="text-lg font-medium text-[#ff5722] flex gap-x-1.5 justify-center items-center">
      <LuLoaderCircle className="animate-spin"/> Loading...
    </p>
  );
}
