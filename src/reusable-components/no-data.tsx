import { BsDatabaseFillX } from "react-icons/bs";

export default function NoData() {
  return (
    <p className="text-lg font-medium text-[#ff5722] flex justify-center gap-x-1.5 items-center">
      <BsDatabaseFillX /> No Data Found
    </p>
  );
}
