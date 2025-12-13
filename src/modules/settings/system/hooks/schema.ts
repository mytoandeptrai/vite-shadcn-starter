import z from "zod";
import {
  regexLowerCase,
  regexNumber,
  regexSpace,
  regexSpecialCharacters,
  regexUpperCase,
} from "@/constant";
import type { TFunction } from "i18next";

const twoFaRemoveFormSchema = (t: TFunction) =>
  z.object({
    password: z
      .string()
      .min(1, {
        message: t("errors.common.field-required", {
          field: t("system.labels.two-fa.remove-modal.fields.password.label"),
          ns: "common",
        }),
      })
      .min(8, { message: t("system.labels.two-fa.remove-modal.errors.MSG-1.14") })
      .max(50, { message: t("system.labels.two-fa.remove-modal.errors.MSG-1.14") })
      .refine((val) => val.trim().length > 0, {
        message: t("system.labels.two-fa.remove-modal.errors.MSG-1.15"),
      })
      .superRefine((val, ctx) => {
        const hasUpperCase = regexUpperCase.test(val);
        const hasLowerCase = regexLowerCase.test(val);
        const hasNumber = regexNumber.test(val);
        const hasSpecialChar = regexSpecialCharacters.test(val);
        const hasSpace = regexSpace.test(val);
        if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)) {
          ctx.addIssue({
            code: "custom",
            message: t("system.labels.two-fa.remove-modal.errors.MSG-1.15"),
          });
        }
        if (hasSpace) {
          ctx.addIssue({
            code: "custom",
            message: t("system.labels.two-fa.remove-modal.errors.MSG-1.19"),
          });
        }
      }),
  });

type TwoFaRemoveFormData = z.infer<ReturnType<typeof twoFaRemoveFormSchema>>;

const initialFormData: TwoFaRemoveFormData = {
  password: "",
};

export { twoFaRemoveFormSchema, type TwoFaRemoveFormData, initialFormData };
