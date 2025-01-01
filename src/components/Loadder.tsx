import { FaSpinner } from "react-icons/fa";

export default function Loadder() {
  return (
    <div className="flex justify-center items-center h-screen">
      <FaSpinner className="animate-spin text-4xl text-yellow-500" />
    </div>
  );
}
