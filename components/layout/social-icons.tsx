import { Button } from "components/ui/button";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { FC } from "react";

interface SocialIconsProps {}

const SocialIcons: FC<SocialIconsProps> = ({}) => {
  return (
    <div className="flex flex-row gap-[0.125rem]">
      <Button
        variant="ghost"
        className="text-emma-primary"
        size="icon"
        href="https://www.facebook.com/profile.php?id=61550886644164"
      >
        <Facebook className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        className="text-emma-primary"
        size="icon"
        href="https://instagram.com/emgineer_society"
      >
        <Instagram className="w-5 h-5" />
      </Button>
      {/* <Button
        variant="ghost"
        className="text-emma-primary"
        size="icon"
        href="https://lakeesiv.com"
      >
        <Youtube className="w-5 h-5" />
      </Button> */}
    </div>
  );
};

export default SocialIcons;
