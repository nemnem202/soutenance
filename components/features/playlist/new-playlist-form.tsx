import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useNewPlaylistForm } from "@/hooks/use-forms";
import { useLanguage } from "@/hooks/use-language";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../molecules/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../../molecules/input-group";
import EditableImage from "../../organisms/editable-image";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Switch } from "../../ui/switch";

export default function NewPlaylistForm({ axe = "x" }: { axe?: "x" | "y" }) {
  const { form, formRef, handleSubmit } = useNewPlaylistForm();
  const { instance } = useLanguage();
  return (
    <form
      id="form-rhf-post"
      onSubmit={form.handleSubmit(handleSubmit)}
      ref={formRef}
    >
      <FieldGroup
        className={`flex  items-center  flex-col ${axe === "x" && "md:flex-row"}`}
      >
        <Controller
          name="image.src"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 w-min">
              <div className="w-full flex justify-center">
                <div className="w-75 h-75 overflow-hidden">
                  <EditableImage
                    alt="playlist cover"
                    src={field.value}
                    onImageChange={(source) => field.onChange(source)}
                  />
                </div>
              </div>

              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="w-full flex flex-col gap-3">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <Input
                  {...field}
                  id="form-rhf-post-title"
                  aria-invalid={fieldState.invalid}
                  placeholder={instance.getItem("enter_the_title")}
                  autoComplete="off"
                  className="paragraph !text-left px-2"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <InputGroup className="">
                  <InputGroupTextarea
                    {...field}
                    id="form-rhf-post-content"
                    placeholder={instance.getItem("enter_your_description")}
                    rows={6}
                    className="min-h-24 resize-none focus:border-none focus-visible:ring-offset-0 paragraph"
                    aria-invalid={fieldState.invalid}
                    maxLength={500}
                  />
                  <InputGroupAddon
                    align="block-end"
                    className="w-full flex justify-end px-3"
                  >
                    <InputGroupText className="tabular-nums paragraph-sm">
                      {field.value ? field.value.length : 0}/500
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="tags"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <TagsInput
                  defaultValue={field.value}
                  onChange={(tags) => form.setValue("tags", tags)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="visibility"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <div className="flex gap-2 items-center">
                  <FieldLabel htmlFor="visibility-switch">
                    {instance.getItem("public")}
                  </FieldLabel>

                  <span className="inline-flex">
                    <Switch
                      id="visibility-switch"
                      defaultChecked={field.value === "public"}
                      onCheckedChange={(checked) =>
                        form.setValue(
                          "visibility",
                          checked ? "public" : "private",
                        )
                      }
                    />
                  </span>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div className="w-full flex justify-end">
            <Button className="w-full md:w-fit title-4" type="submit">
              {instance.getItem("submit")}
            </Button>
          </div>
        </div>
      </FieldGroup>
    </form>
  );
}

function TagsInput({
  onChange,
  defaultValue = [],
}: {
  defaultValue?: string[];
  onChange: (tags: string[]) => void;
}) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const { instance } = useLanguage();

  // biome-ignore lint/correctness/useExhaustiveDependencies: qsdqsd
  useEffect(() => {
    onChange(tags);
  }, [tags]);

  return (
    <div className="flex flex-col w-full gap-2">
      <Input
        placeholder={`${instance.getItem("tags")} (10 ${instance.getItem("max")})`}
        id="form-rhf-tags"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();

            const value = (e.target as HTMLInputElement).value.trim();
            if (!value) return;

            setTags((prev) => [...prev, value]);

            (e.target as HTMLInputElement).value = "";
          }
        }}
        className="!text-left px-3"
      />
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((t, index) => (
          <Badge
            variant="outline"
            className="text-muted-foreground paragraph-md gap-2 py-1.5 pl-2"
            key={t}
          >
            {t}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setTags((prev) => prev.filter((_, i) => i !== index));
              }}
              className="cursor-pointer rounded-full hover:bg-popover transition"
            >
              <X size={20} />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
