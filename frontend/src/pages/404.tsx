import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#05090D] text-white">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-[#7B8794]">Page not found</p>
      <Link to="/" className="mt-6 text-primary underline">
        Back to home
      </Link>
    </div>
  );
}

export default NotFound;
