import { Button } from "../../ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../molecules/field";
import { Controller } from "react-hook-form";
import { Input } from "../../ui/input";
import { useRegisterForm } from "@/hooks/use-forms";
import { Checkbox } from "../../ui/checkbox";
import EditableImage from "../../organisms/editable-image";
import { useLanguage } from "@/hooks/use-language";

export default function RegisterForm() {
  const { form, formRef, handleSubmit } = useRegisterForm();
  const { instance } = useLanguage();
  return (
    <form
      id="form-rhf-register"
      onSubmit={form.handleSubmit(handleSubmit)}
      ref={formRef}
      className="w-full flex flex-col items-center justify-between gap-4"
    >
      <h2 className="title-2 text-primary">
        {instance.getItem("create_your_account")}
      </h2>
      <FieldGroup className="gap-3 mb-3">
        <Controller
          name="image.src"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <div className="w-full flex justify-center">
                <div className="w-50 h-50 overflow-hidden">
                  <EditableImage
                    alt="playlist cover"
                    src={field.value}
                    onImageChange={(source) => field.onChange(source)}
                    canBeEdited={false}
                  />
                </div>
              </div>

              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <Input
                {...field}
                id="form-rhf-register-username"
                aria-invalid={fieldState.invalid}
                placeholder={instance.getItem("username")}
                type="text"
                autoComplete="off"
                className="paragraph !text-left px-2"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <Input
                {...field}
                id="form-rhf-register-email"
                aria-invalid={fieldState.invalid}
                placeholder={instance.getItem("email")}
                type="email"
                autoComplete="off"
                className="paragraph !text-left px-2"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="flex gap-2">
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <Input
                  {...field}
                  id="form-rhf-register-password"
                  aria-invalid={fieldState.invalid}
                  placeholder={instance.getItem("password")}
                  type="password"
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
            name="password_confirm"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <Input
                  {...field}
                  id="form-rhf-register-password"
                  aria-invalid={fieldState.invalid}
                  placeholder={instance.getItem("confirm_password")}
                  type="password"
                  autoComplete="off"
                  className="paragraph !text-left px-2"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="flex justify-between items-center">
          <Controller
            name="agree_terms_of_service"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <div className="flex gap-2">
                  <Checkbox
                    id="form-rhf-remember"
                    defaultChecked={field.value}
                    onCheckedChange={(c) =>
                      form.setValue(
                        "agree_terms_of_service",
                        typeof c === "boolean" ? c : false,
                      )
                    }
                  />
                  <FieldLabel
                    htmlFor="form-rhf-remember"
                    className=" paragraph-md max-w-70"
                  >
                    <span>
                      {instance.getItem("by_checking_this")}{" "}
                      <a
                        href="/therms-of-service"
                        className="text-primary p-0 h-min hover:underline"
                      >
                        {instance.getItem("therms_of_service")} {/* TODO */}
                      </a>
                    </span>
                  </FieldLabel>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>
      <Button className="title-3 w-full" type="submit">
        {instance.getItem("register")}
      </Button>
    </form>
  );
}
