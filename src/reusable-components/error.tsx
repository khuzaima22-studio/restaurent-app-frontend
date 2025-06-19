import { BiError } from "react-icons/bi";

export default function Error() {
  return (
    <p className="text-lg font-medium text-[#ff5722] flex justify-center items-center gap-x-1.5">
      <BiError /> Something went wrong. Please try again.
    </p>
  );
}
