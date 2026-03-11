import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./button";
import Logo from "./logo";
import { Field, FieldError, FieldGroup, FieldLabel } from "./field";
import { Controller } from "react-hook-form";
import { Input } from "./input";
import { useLoginForm, useRegisterForm } from "@/hooks/use-forms";
import { Checkbox } from "./checkbox";
import GoogleLoginButton from "./google-login-button";
import Modal from "./modal";
import EditableImage from "./editable-image";
import Link from "./link";

export default function LoginButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  return (
    <>
      <Button variant={"link"} className="title-3 text-primary" onClick={() => setIsOpen(true)}>
        Login
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md" title="Example Modal">
        {mode === "login" ? <LoginModalContent setMode={setMode} /> : <RegisterModalContent setMode={setMode} />}
      </Modal>
    </>
  );
}

function LoginModalContent({ setMode }: { setMode: Dispatch<SetStateAction<"login" | "register">> }) {
  return (
    <div className="flex flex-col items-center min-w-0 min-h-0 gap-4">
      <Logo />
      <LoginForm />
      <div className="flex flex-col items-center w-full gap-3">
        <p className="paragraph-sm text-muted-foreground">Or login with</p>
        <GoogleLoginButton />
      </div>
      <p className="paragraph-md flex gap-2">
        Don't have an account ?
        <Button
          variant={"link"}
          className="text-primary p-0 h-min paragraph-md "
          onClick={(e) => {
            e.preventDefault();
            setMode("register");
          }}
        >
          register here
        </Button>
      </p>
    </div>
  );
}

function LoginForm() {
  const { form, formRef, handleSubmit } = useLoginForm();
  return (
    <form
      id="form-rhf-login"
      onSubmit={form.handleSubmit(handleSubmit)}
      ref={formRef}
      className="w-full flex flex-col items-center justify-between gap-4"
    >
      <h2 className="title-2 text-primary">Login to your accout</h2>
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
                placeholder="Email"
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
                placeholder="Password"
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
                  <FieldLabel htmlFor="form-rhf-remember">remember me</FieldLabel>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button variant={"link"} className="text-primary p-0 h-min" onClick={(e) => e.preventDefault()}>
            forgot password ?
          </Button>
        </div>
      </FieldGroup>
      <Button className="title-3 w-full" type="submit">
        Login
      </Button>
    </form>
  );
}

function RegisterModalContent({ setMode }: { setMode: Dispatch<SetStateAction<"login" | "register">> }) {
  return (
    <div className="flex flex-col items-center min-w-0 min-h-0 gap-4">
      <Logo />
      <RegisterForm />
      <div className="flex flex-col items-center w-full gap-3">
        <p className="paragraph-sm text-muted-foreground">Or login with</p>
        <GoogleLoginButton />
      </div>
      <p className="paragraph-md flex gap-2">
        Already have an account ?
        <Button
          variant={"link"}
          className="text-primary p-0 h-min paragraph-md "
          onClick={(e) => {
            e.preventDefault();
            setMode("login");
          }}
        >
          login here
        </Button>
      </p>
    </div>
  );
}

function RegisterForm() {
  const { form, formRef, handleSubmit } = useRegisterForm();
  return (
    <form
      id="form-rhf-register"
      onSubmit={form.handleSubmit(handleSubmit)}
      ref={formRef}
      className="w-full flex flex-col items-center justify-between gap-4"
    >
      <h2 className="title-2 text-primary">Create your account</h2>
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
                placeholder="Username"
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
                placeholder="Email"
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
                  placeholder="Password"
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
                  placeholder="Confirm Password"
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
                  <FieldLabel htmlFor="form-rhf-remember" className=" paragraph-sm">
                    <span>
                      By checking this, i agree all statements in{" "}
                      <a href="/therms-of-service" className="text-primary p-0 h-min hover:underline">
                        therms of service
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
        Register
      </Button>
    </form>
  );
}
