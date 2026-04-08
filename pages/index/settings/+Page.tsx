import { useState } from "react";
import { LoginModal } from "@/components/features/auth/login-button";
import MobileHeader from "@/components/features/layout/mobile-header";
import {
  ChangeAccountButton,
  LanguageParam,
  LogoutButton,
  RemoveAccountButton,
  ThemeParam,
  UsernameParam,
} from "@/components/features/settings/parameters";
import { SettingsSection } from "@/components/features/settings/settings-assets";
import SizeAdapter from "@/components/molecules/size-adapter";
import EditableImage from "@/components/organisms/editable-image";
import Headline from "@/components/ui/headline";
import { useLanguage } from "@/hooks/use-language";
import useSession from "@/hooks/use-session";
import { loadingToast } from "@/lib/toaster";
import { onImageChange } from "@/telefunc/image-change.telefunc";

export default function Page() {
  return <SizeAdapter sm={<Mobile />} md={<Desktop />} />;
}

function Desktop() {
  const { instance } = useLanguage();

  return (
    <>
      <Headline>{instance.getItem("settings")}</Headline>
      <Content />
    </>
  );
}

function Mobile() {
  const { instance } = useLanguage();
  return (
    <>
      <MobileHeader title={instance.getItem("settings")} />
      <Content />
    </>
  );
}

function Content() {
  const { instance } = useLanguage();
  const { session, setSession } = useSession();
  const [_isOpen, setIsOpen] = useState(true);

  const handleImageChange = async (image: File) => {
    const imagePromise = onImageChange(image);
    loadingToast(imagePromise, {
      loading: "Upload de l'image en cours...",
      success: {
        title: "Image enregistrée !",
      },
      error: {
        title: "Échec de l'envoi",
        description: "Vérifiez votre connexion internet ou la taille du fichier.",
      },
    });
    const response = await imagePromise;

    if (response.success) {
      const session = response.data;
      setSession(session);
    }
  };

  return (
    <>
      {!session && (
        <LoginModal
          isOpen={true}
          setIsOpen={() => {}}
          onSuccess={() => setIsOpen(false)}
          initMode="login"
        />
      )}
      <SettingsSection title={instance.getItem("appearance")}>
        <ThemeParam />
        <LanguageParam />
      </SettingsSection>
      <SettingsSection title={instance.getItem("account")}>
        <div className="flex gap-2 md:flex-row flex-col items-center md:items-start">
          <div className="w-33 aspect-square">
            <EditableImage
              alt={session ? session.profilePictureSource.alt : undefined}
              src={session ? session.profilePictureSource.src : undefined}
              onImageChange={handleImageChange}
            />
          </div>
          <UsernameParam />
        </div>
        <div className="flex gap-4 flex-wrap">
          <div>
            <ChangeAccountButton />
          </div>
          <div>
            <RemoveAccountButton />
          </div>
          <div>
            <LogoutButton />
          </div>
        </div>
      </SettingsSection>
    </>
  );
}
