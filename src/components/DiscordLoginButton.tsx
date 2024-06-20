import { Button } from "./ui/button";

const DiscordLoginButton = () => {
  const handleLogin = () => {
    window.location.href = `https://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_PORT}/auth/discord`;
  };

  return (
    <Button size={'lg'} className="rounded-md p-3 bg-[#5865F2]" onClick={handleLogin}>
      Login with Discord 
    </Button>
  );
};

export default DiscordLoginButton;
