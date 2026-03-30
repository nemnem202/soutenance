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
  return (
    <>
      <SettingsSection title={instance.getItem("appearance")}>
        <ThemeParam />
        <LanguageParam />
      </SettingsSection>
      <SettingsSection title={instance.getItem("account")}>
        <div className="flex gap-2 md:flex-row flex-col items-center md:items-start">
          <div className="w-33 aspect-square">
            <EditableImage alt="profile picture" onImageChange={() => {}} />
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
