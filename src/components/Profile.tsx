import { useState } from "react";
import { users, type User } from "../data/user";
import useScrollContainerRef from "../hooks/useScrollContainerRef";
import { isDateRecent } from "../utils/isDateRecent";

type ProfileProps = {
  userName: User["name"];
  userAvatarUrl: string | null;
  blogAvatarUrl: string | null;
};

export function Profile(props: ProfileProps) {
  const { userName, userAvatarUrl, blogAvatarUrl } = props;

  const [status, setStatus] = useState<"close" | "hover" | "open">("close");

  const handleScrollContainerRef = useScrollContainerRef((element) => {
    const handleScrollContainerWheel = () => {
      setStatus("close");
    };

    element?.addEventListener("touchmove", handleScrollContainerWheel);

    return () => {
      element?.removeEventListener("touchmove", handleScrollContainerWheel);
    };
  }, []);

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

  return (
    <div
      ref={handleScrollContainerRef}
      className="relative"
      onMouseEnter={handleProfileEnter}
      onMouseLeave={handleProfileLeave}
    >
      <a
        className="flex items-center gap-1 text-sm text-inherit"
        href={`/${user?.github}`}
      >
        {userAvatarUrl != null && (
          <img
            src={userAvatarUrl}
            alt={`${user?.name ?? userName} Profile Image`}
            className="w-4 h-4 rounded-full"
            width={16}
            height={16}
            loading="lazy"
          />
        )}
        {user?.name ?? userName}
        {isDateRecent({ date: user?.joinDate ?? "", days: 7 }) && (
          <span className="inline-block bg-teal-600 h-1.5 w-1.5 rounded-full mb-2" />
        )}
      </a>
      <div
        className={`absolute top-full left-0 pt-1.5 z-10 select-none ${user != null && status === "open" ? "block" : "hidden"}`}
        onClick={(event) => !event.bubbles && event.preventDefault()}
      >
        <section
          className="flex flex-col gap-4 p-4 w-52 rounded bg-white"
          style={{
            boxShadow:
              "0px 0px 0px 1px #d1d9e080, 0px 6px 12px -3px #25292e0a, 0px 6px 18px 0px #25292e1f",
          }}
        >
          <div className="flex flex-col gap-2">
            {userAvatarUrl != null && (
              <img
                src={userAvatarUrl}
                alt={`${user?.name} Avatar Image`}
                className="w-8 h-8 rounded-full"
                width={32}
                height={32}
                loading="lazy"
              />
            )}
            <a href={`/${user?.github}`}>
              <span className="text-md font-bold">{user?.name} </span>
              {user?.github != null && (
                <span className="text-sm text-gray-700">{user.github}</span>
              )}
            </a>
          </div>
          <div className="flex flex-col gap-2">
            {user?.blog != null && (
              <a
                href={user.blog}
                target="_blank"
                className="flex gap-1.5 items-center"
              >
                {blogAvatarUrl != null && (
                  <img
                    src={blogAvatarUrl}
                    className="grayscale"
                    alt={`${user?.name} Blog link`}
                    width={16}
                    height={16}
                  />
                )}
                <p className="text-xs text-gray-700 w-full">Blog</p>
              </a>
            )}
            {user?.github != null && (
              <a
                href={`https://github.com/${user.github}`}
                target="_blank"
                className="flex gap-1.5 items-center"
              >
                <img
                  src="https://api.iconify.design/mingcute/github-fill.svg?height=none"
                  alt={`${user?.name} GitHub link`}
                  width={16}
                  height={16}
                />
                <p className="text-xs text-gray-700 w-full">GitHub</p>
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
