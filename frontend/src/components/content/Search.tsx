import { useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();

  return (
    <input
      className="search-aside-input w-full rounded-lg border border-transparent bg-[#090E11] px-3 py-2 text-sm font-medium text-white placeholder:text-[#7B8794] transition-colors hover:border-[#1B232B] focus:border-primary focus:outline-none focus-visible:border-primary active:border-primary"
      placeholder="Search assets..."
      type="search"
      autoComplete="off"
      onKeyDown={(key) => {
        if (key.key === "Enter") {
          navigate(`/crypto/${(key.target as HTMLInputElement).value.toLowerCase()}`);
        }
      }}
    />
  );
}
