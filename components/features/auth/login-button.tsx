import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../../ui/button";
import Logo from "../../ui/logo";
import { Field, FieldError, FieldGroup, FieldLabel } from "../../molecules/field";
import { Controller } from "react-hook-form";
import { Input } from "../../ui/input";
import { useLoginForm, useRegisterForm } from "@/hooks/use-forms";
import { Checkbox } from "../../ui/checkbox";
import GoogleLoginButton from "../../organisms/google-login-button";
import Modal from "../../organisms/modal";
import EditableImage from "../../organisms/editable-image";
import { useLanguage } from "@/hooks/use-language";

export default function LoginButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const { instance } = useLanguage();
  return (
    <>
      <Button variant={"link"} className="title-3 text-primary" onClick={() => setIsOpen(true)}>
        {instance.getItem("login")}
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md" title="Login Modal">
        {mode === "login" ? <LoginModalContent setMode={setMode} /> : <RegisterModalContent setMode={setMode} />}
      </Modal>
    </>
  );
}

function LoginModalContent({ setMode }: { setMode: Dispatch<SetStateAction<"login" | "register">> }) {
  const { instance } = useLanguage();
  return (
    <div className="flex flex-col items-center min-w-0 min-h-0 gap-4">
      <Logo />
      <LoginForm />
      <div className="flex flex-col items-center w-full gap-3">
        <p className="paragraph-sm text-muted-foreground">{instance.getItem("or_login_with")}</p>
        <GoogleLoginButton />
      </div>
      <p className="paragraph-md flex gap-2">
        {instance.getItem("dont_have_an_account")}
        <Button
          variant={"link"}
          className="text-primary p-0 h-min paragraph-md "
          onClick={(e) => {
            e.preventDefault();
            setMode("register");
          }}
        >
          {instance.getItem("register_here")}
        </Button>
      </p>
    </div>
  );
}

function LoginForm() {
  const { form, formRef, handleSubmit } = useLoginForm();
  const { instance } = useLanguage();
  return (
    <form
      id="form-rhf-login"
      onSubmit={form.handleSubmit(handleSubmit)}
      ref={formRef}
      className="w-full flex flex-col items-center justify-between gap-4"
    >
      <h2 className="title-2 text-primary">{instance.getItem("login_to_your_account")}</h2>
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
                    onCheckedChange={(c) => form.setValue("remember", typeof c === "boolean" ? c : false)}
                  />
                  <FieldLabel htmlFor="form-rhf-remember">{instance.getItem("remember_me")}</FieldLabel>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button variant={"link"} className="text-primary p-0 h-min" onClick={(e) => e.preventDefault()}>
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

function RegisterModalContent({ setMode }: { setMode: Dispatch<SetStateAction<"login" | "register">> }) {
  const { instance } = useLanguage();
  return (
    <div className="flex flex-col items-center min-w-0 min-h-0 gap-4">
      <Logo />
      <RegisterForm />
      <div className="flex flex-col items-center w-full gap-3">
        <p className="paragraph-sm text-muted-foreground">{instance.getItem("or_login_with")}</p>
        <GoogleLoginButton />
      </div>
      <p className="paragraph-md flex gap-2">
        {instance.getItem("already_have_an_account")}
        <Button
          variant={"link"}
          className="text-primary p-0 h-min paragraph-md "
          onClick={(e) => {
            e.preventDefault();
            setMode("login");
          }}
        >
          {instance.getItem("login_here")}
        </Button>
      </p>
    </div>
  );
}

function RegisterForm() {
  const { form, formRef, handleSubmit } = useRegisterForm();
  const { instance } = useLanguage();
  return (
    <form
      id="form-rhf-register"
      onSubmit={form.handleSubmit(handleSubmit)}
      ref={formRef}
      className="w-full flex flex-col items-center justify-between gap-4"
    >
      <h2 className="title-2 text-primary">{instance.getItem("create_your_account")}</h2>
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
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                    onCheckedChange={(c) => form.setValue("agree_terms_of_service", typeof c === "boolean" ? c : false)}
                  />
                  <FieldLabel htmlFor="form-rhf-remember" className=" paragraph-md max-w-70">
                    <span>
                      {instance.getItem("by_checking_this")}{" "}
                      <a href="/therms-of-service" className="text-primary p-0 h-min hover:underline">
                        {instance.getItem("therms_of_service")} {/* TODO */}
                      </a>
                    </span>
                  </FieldLabel>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
