import DiscordLoginButton from "../DiscordLoginButton";
import { ConnectWallet, useAddress, useSigner } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Button } from "../ui/button";

interface IDiscordUser {
  username: string;
  id: string;
  avatar: string;
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const Home = () => {
  const serverIp = import.meta.env.VITE_SERVER_IP;
  const port = import.meta.env.VITE_PORT;

  const [user, setUser] = useState<IDiscordUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const address = useAddress();
  const signer = useSigner();
  console.log("Address:", address);

  const query = useQuery();
  const code = query.get("code");

  const handleButton = async () => {
    try {
      setIsLoading(true);

      const message = `I am updating my Matic address at ${new Date().toISOString()}`;
      const signature = await signer?.signMessage(message);
      console.log("Signature:", signature);

      const response = await axios.post(`http://${serverIp}:${port}/update-matic-address/`, {
        discordID: user?.id,
        maticAddress: address,
        signature,
        message,
      });

      console.log("User data updated:", response.data);
      setShowSuccessAlert(true);
    } catch (error) {
      console.error("Error updating user data:", error);
      setErrorMessage("Failed to update user data. Please try again.");
      setShowErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://${serverIp}:${port}/auth/discord/callback/?code=${code}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (code) {
      fetchUser();
    }
  }, [code]);

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-black text-white">
      <div className="w-1/2 h-[80vh] flex flex-col items-center justify-evenly p-5 rounded-lg bg-gray-600">
        <div className="flex flex-col gap-2">
          <p className="text-2xl">1. Login with Discord</p>
          {user ? (
            <p className="text-xl text-center">Welcome <span className="font-bold">{user.username}</span></p>
          ) : (
            <DiscordLoginButton />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-2xl">2. Login with Polygon</p>
          <ConnectWallet/>
        </div>

        <Button
          className="p-3 rounded-md bg-green-500 disabled:bg-gray-800 disabled:text-gray-500"
          disabled={!address || !user || isLoading}
          onClick={handleButton}
        >
          {isLoading ? "Updating..." : "Update your data!"}
        </Button>

        {showSuccessAlert && (
          <div className="mt-3 p-3 bg-green-200 text-green-800 rounded-md">
            User data updated successfully!
          </div>
        )}

        {showErrorAlert && (
          <div className="mt-3 p-3 bg-red-200 text-red-800 rounded-md">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};
