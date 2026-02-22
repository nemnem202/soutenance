import { useNewProjectForm } from "@/hooks/use-forms";
import { Field, FieldError, FieldGroup, FieldLabel } from "./field";
import { Controller } from "react-hook-form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "./input-group";
import { Separator } from "./separator";

export interface NewProjectFormProps {}

export default function NewProjectForm() {
  const { form, formRef, handleSubmit } = useNewProjectForm();
  return (
    <form id="form-rhf-post" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-0">
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
            <Field data-invalid={fieldState.invalid} className="gap-0">
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
            <Field data-invalid={fieldState.invalid} className="gap-0">
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
      </FieldGroup>
    </form>
  );
}
