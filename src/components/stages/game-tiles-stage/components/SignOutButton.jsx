import { Button } from "@nextui-org/button";
import { signOut } from "../../../../util/authentication";

export default function SignOutButton() {
  const handleOnClick = () => signOut();

  return (
    <Button
      onPress={handleOnClick}
      size="lg"
      radius="full"
      className=" bg-foreground text-background font-medium sm:text-sm-screen-2"
    >
      Sign Out
    </Button>
  );
}
