import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfilePersonalContainer } from "../../hooks";
import { Show } from "@/components/utilities";
import { FormInput } from "@/components/form-fields/form-input";
import { FormWrapper } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const ProfilePersonalContainer = () => {
  const { t, form, isLoading, isUpdated, onSubmit, onCancel, setIsUpdated } =
    useProfilePersonalContainer();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.password.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormWrapper className="space-y-6" form={form} onSubmit={onSubmit}>
          <FormInput
            control={form.control}
            name="firstName"
            label={t("profile.personal.fields.firstName.label")}
            placeholder={t("profile.personal.fields.firstName.placeholder")}
            required
            disabled={isLoading || !isUpdated}
          />
          <FormInput
            control={form.control}
            name="lastName"
            label={t("profile.personal.fields.lastName.label")}
            placeholder={t("profile.personal.fields.lastName.placeholder")}
            required
            disabled={isLoading || !isUpdated}
          />
          <FormInput
            control={form.control}
            name="email"
            label={t("profile.personal.fields.email.label")}
            placeholder={t("profile.personal.fields.email.placeholder")}
            required
            disabled
          />
          <Show when={isUpdated}>
            <div className="flex items-center justify-start gap-2">
              <Button
                className="w-fit"
                size="lg"
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={onCancel}
              >
                {t("buttons.cancel", { ns: "common" })}
              </Button>
              <Button
                className="w-fit"
                size="lg"
                type="submit"
                disabled={isLoading}
              >
                <Show when={isLoading}>
                  <Spinner />
                </Show>
                {t("buttons.update", { ns: "common" })}
              </Button>
            </div>
          </Show>
          <Show when={!isUpdated}>
            <Button
              className="w-fit"
              size="lg"
              type="button"
              disabled={isLoading}
              onClick={() => setIsUpdated(true)}
            >
              {t("profile.buttons.update-personal-information")}
            </Button>
          </Show>
        </FormWrapper>
      </CardContent>
    </Card>
  );
};

export default ProfilePersonalContainer;
