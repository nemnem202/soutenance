import { useState } from "react";
import { LoginModal } from "@/components/features/auth/login-button";
import {
  ChangeAccountButton,
  LogoutButton,
  RemoveAccountButton,
  UsernameParam,
} from "@/components/features/settings/parameters";
import { SettingsRow, SettingsSection } from "@/components/features/settings/settings-assets";
import EditableImage from "@/components/organisms/editable-image";
import { useLanguage } from "@/hooks/use-language";
import useSession from "@/hooks/use-session";
import { loadingToast } from "@/lib/toaster";
import { onImageChange } from "@/telefunc/image-change.telefunc";

export default function Page() {
  const { instance } = useLanguage();
  const { session, setSession } = useSession();
  const [isOpen, setIsOpen] = useState(true);

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
      <SettingsSection
        title={instance.getItem("account")}
        description={instance.getItem("account_description")}
      >
        <SettingsRow
          label={instance.getItem("profile_picture")}
          description={instance.getItem("profile_picture_description")}
        >
          <EditableImage
            alt={session ? session.profilePicture.alt : undefined}
            src={session ? session.profilePicture.url : undefined}
            onImageChange={handleImageChange}
          />
        </SettingsRow>
        <UsernameParam />

        <SettingsRow
          label={instance.getItem("session")}
          description={instance.getItem("session_description")}
        >
          <div className="flex gap-2 flex-wrap md:justify-end">
            <ChangeAccountButton />
            <LogoutButton />
          </div>
        </SettingsRow>
      </SettingsSection>
      <SettingsSection
        title={instance.getItem("danger_zone")}
        description={instance.getItem("danger_zone_description")}
        variant="danger"
      >
        <SettingsRow
          label={instance.getItem("remove_account")}
          description={instance.getItem("remove_account_description")}
        >
          <RemoveAccountButton />
        </SettingsRow>
      </SettingsSection>
    </>
  );
}
