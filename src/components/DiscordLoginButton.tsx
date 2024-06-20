import { Button } from "./ui/button";

const DiscordLoginButton = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/discord';
  };

  return (
    <Button size={'lg'} className="rounded-md p-3 bg-[#5865F2]" onClick={handleLogin}>
      Login with Discord 
    </Button>
  );
};

export default DiscordLoginButton;
