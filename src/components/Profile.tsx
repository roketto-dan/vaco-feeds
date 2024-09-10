import { useState } from "react";
import { users, type User } from "../data/user";

type ProfileProps = {
  userName: User['name'];
};

export function Profile(props: ProfileProps) {
  const { userName } = props;

  const [status, setStatus] = useState<"close" | "hover" | "open">("close");

  const user = users.find((user) => user.name === userName);

  const handleProfileEnter = () => {
    setStatus("hover");
    setTimeout(() => {
      setStatus((status) => {
        return status === "hover" ? "open" : status;
      });
    }, 1000 * 0.5);
  };

  const handleProfileLeave = () => {
    setStatus("close");
  };

  const handleButtonClick = () => {
    setStatus((status) => {
      switch(status) {
        case "close":
          return "open";
        case "hover":
          return "hover";
        case "open":
          return "close";
      }
    });
    setTimeout(() => {
      setStatus((status) => {
        return status === "open" ? "close" : status;
      });
    }, 1000 * 3);
  };

  return (
    <div className="relative" onMouseEnter={handleProfileEnter} onMouseLeave={handleProfileLeave}>
      <button className="flex items-center gap-1 text-sm text-gray-700" onClick={handleButtonClick}>
        {user?.name ?? userName}
      </button>
      {user != null && status === 'open' && (
        <div className="absolute top-full left-0 pt-1.5 z-10">
          <section className="flex flex-col gap-4 p-4 w-52 rounded bg-white" style={{ boxShadow: '0px 0px 0px 1px #d1d9e080, 0px 6px 12px -3px #25292e0a, 0px 6px 18px 0px #25292e1f' }}>
            {user.name}
          </section>
        </div>
      )}
    </div>
  );
}
