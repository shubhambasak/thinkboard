import { Link } from "react-router";
import { PlusIcon } from "lucide-react";

const Navbar = () => {
  return (
    <header className="border-b border-base-300 bg-base-100">
      <div className="mx-auto max-w-4xl px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-base-content hover:opacity-80 transition-opacity">
            Thinkboard
          </Link>
          <Link to="/create" className="btn btn-primary btn-sm gap-1">
            <PlusIcon className="size-4" />
            New note
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
