import { users, type User } from "../data/user";

type ProfileProps = {
  userName: User['name'];
};

export function Profile(props: ProfileProps) {
  const { userName } = props;

  const user = users.find((user) => user.name === userName);

  return (
    <span className="text-sm text-gray-700">
      {user?.name ?? userName}
    </span>
  );
}
