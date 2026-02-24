import { useNewProjectForm } from "@/hooks/use-forms";
import { Field, FieldError, FieldGroup, FieldLabel } from "./field";
import { Controller } from "react-hook-form";
import { Input } from "./input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "./input-group";
import { Separator } from "./separator";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Badge } from "./badge";
import { SmallCheckboxGroup } from "./game/game-assets";
import EditableImage from "./editable-image";

export interface NewProjectFormProps {}

export default function NewProjectForm() {
  const { form, formRef, handleSubmit } = useNewProjectForm();
  return (
    <form id="form-rhf-post" onSubmit={form.handleSubmit(handleSubmit)} ref={formRef}>
      <FieldGroup>
        <div className="w-75 h-75 overflow-hidden">
          <EditableImage src="assets/playlist2.png" alt="the cover of the project" onImageChange={() => {}} />
        </div>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor="form-rhf-post-title" className="title-4">
                Titre
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-post-title"
                aria-invalid={fieldState.invalid}
                placeholder="Enter the title"
                autoComplete="off"
                className="paragraph !text-left px-2"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="composer"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor="form-rhf-post-composer" className="title-4">
                Composer
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-post-composer"
                aria-invalid={fieldState.invalid}
                placeholder="Enter the composer full-name."
                autoComplete="off"
                className="paragraph !text-left px-2"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor="form-rhf-post-content" className="title-4">
                Description (optionnal)
              </FieldLabel>
              <InputGroup className="">
                <InputGroupTextarea
                  {...field}
                  id="form-rhf-post-content"
                  placeholder="Enter your description..."
                  rows={6}
                  className="min-h-24 resize-none focus:border-none focus-visible:ring-offset-0 paragraph"
                  aria-invalid={fieldState.invalid}
                  maxLength={500}
                />
                <InputGroupAddon align="block-end" className="w-full flex justify-end px-3">
                  <InputGroupText className="tabular-nums paragraph-sm">
                    {field.value ? field.value.length : 0}/500
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Separator />
        <Controller
          name="config.defaultBpm"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex-row items-center">
              <FieldLabel htmlFor="form-rhf-post-bpm" className="title-4 !w-fit whitespace-nowrap">
                Default Bpm
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-post-bpm"
                aria-invalid={fieldState.invalid}
                type="number"
                autoComplete="off"
                className="paragraph px-2 !w-15 min-w-0 p-0 text-center"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="tags"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor="form-rhf-tags" className="title-4">
                Tags (max 10)
              </FieldLabel>
              <TagsInput defaultValue={field.value} onChange={(tags) => form.setValue("tags", tags)} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="config.activeTracks"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor="form-rhf-backing" className="title-4">
                Default backing tracks
              </FieldLabel>
              <div className="w-full flex flex-wrap gap-5" id="form-rhf-backing">
                <SmallCheckboxGroup
                  label="Piano"
                  checkboxProps={{
                    defaultChecked: field.value.piano,
                    onCheckedChange: (c: boolean) => form.setValue("config.activeTracks.piano", c),
                  }}
                />
                <SmallCheckboxGroup
                  label="Guitar"
                  checkboxProps={{
                    defaultChecked: field.value.guitar,
                    onCheckedChange: (c: boolean) => form.setValue("config.activeTracks.guitar", c),
                  }}
                />
                <SmallCheckboxGroup
                  label="Bass"
                  checkboxProps={{
                    defaultChecked: field.value.bass,
                    onCheckedChange: (c: boolean) => form.setValue("config.activeTracks.bass", c),
                  }}
                />
                <SmallCheckboxGroup
                  label="Drums"
                  checkboxProps={{
                    defaultChecked: field.value.drums,
                    onCheckedChange: (c: boolean) => form.setValue("config.activeTracks.drums", c),
                  }}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}

function TagsInput({ onChange, defaultValue = [] }: { defaultValue?: string[]; onChange: (tags: string[]) => void }) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  useEffect(() => {
    onChange(tags);
  }, [tags]);
  return (
    <div className="flex flex-col w-full gap-2">
      <Input
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
          <Badge variant="outline" className="text-muted-foreground paragraph-md gap-2 py-1.5 pl-2">
            {t}
            <button
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
