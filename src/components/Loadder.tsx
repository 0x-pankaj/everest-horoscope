import { FaSpinner } from "react-icons/fa";

export default function Loadder() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
    </div>

    // <div className="flex justify-center items-center h-screen">
    //   <FaSpinner className="animate-spin text-4xl text-yellow-500" />
    // </div>
  );
}
