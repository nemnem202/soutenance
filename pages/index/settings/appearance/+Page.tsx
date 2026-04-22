import { LanguageParam, ThemePicker } from "@/components/features/settings/parameters";
import { SettingsSection } from "@/components/features/settings/settings-assets";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  const { instance } = useLanguage();

  return (
    <>
      <SettingsSection
        title={instance.getItem("appearance")}
        description={instance.getItem("appearance_description")}
      >
        <LanguageParam />
        <div className="px-5 py-4 flex flex-col gap-2 border-b border-border">
          <span className="paragraph font-medium text-foreground">{instance.getItem("theme")}</span>
          <ThemePicker />
        </div>
      </SettingsSection>
    </>
  );
}
