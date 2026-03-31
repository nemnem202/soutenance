import { Controller } from "react-hook-form";
import { useLoginForm } from "@/hooks/use-forms";
import { useLanguage } from "@/hooks/use-language";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../molecules/field";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Input } from "../../ui/input";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { form, formRef, handleSubmit } = useLoginForm({ onSuccess });
  const { instance } = useLanguage();
  return (
    <form
      id="form-rhf-login"
      onSubmit={form.handleSubmit(handleSubmit)}
      ref={formRef}
      className="w-full flex flex-col items-center justify-between gap-4"
    >
      <h2 className="title-2 text-primary">
        {instance.getItem("login_to_your_account")}
      </h2>
      <FieldGroup className="gap-3">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <Input
                {...field}
                id="form-rhf-login-email"
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
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <Input
                {...field}
                id="form-rhf-login-password"
                aria-invalid={fieldState.invalid}
                placeholder={instance.getItem("password")}
                type="password"
                autoComplete="off"
                className="paragraph !text-left px-2"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="flex justify-between items-center">
          <Controller
            name="remember"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <div className="flex gap-2">
                  <Checkbox
                    id="form-rhf-remember"
                    defaultChecked={field.value}
                    onCheckedChange={(c) =>
                      form.setValue(
                        "remember",
                        typeof c === "boolean" ? c : false,
                      )
                    }
                  />
                  <FieldLabel htmlFor="form-rhf-remember ">
                    {instance.getItem("remember_me")}
                  </FieldLabel>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            variant={"link"}
            className="text-primary p-0 h-min"
            onClick={(e) => e.preventDefault()}
          >
            {instance.getItem("forgot_password")}
          </Button>
        </div>
      </FieldGroup>
      <Button className="title-3 w-full" type="submit">
        {instance.getItem("login")}
      </Button>
    </form>
  );
}
