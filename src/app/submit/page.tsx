"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, type FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { submitResponse } from "@/lib/actions";
import {
  activityLevels,
  booleanOptions,
  genders,
  joints,
  occupations,
} from "@/lib/constants";
import type { BooleanValue } from "@/lib/types";

export const responseSchema = z
  .object({
    gender: z.enum(["male", "female"], { message: "Please select a gender." }),
    age: z
      .number({ message: "Please enter a valid age." })
      .max(120, "Age must be at most 120."),
    occupation: z.enum(occupations, {
      message: "Please select an occupation.",
    }),
    isDiagnosed: z.enum(booleanOptions, {
      message: "Please indicate if you have been diagnosed.",
    }),
    affectedJoints: z.array(z.enum(joints)).optional(),
    hasChronicPain: z.enum(booleanOptions, {
      message: "Please indicate if you have been diagnosed.",
    }),
    activityLevel: z.enum(activityLevels, {
      message: "Please select an activity level.",
    }),
  })
  .superRefine((data, ctx) => {
    if (
      data.isDiagnosed === "yes" &&
      (!data.affectedJoints || data.affectedJoints.length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Please select at least one affected joint.",
        path: ["affectedJoints"],
      });
    }
  });

export default function SubmitPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDiagnosed, setIsDiagnosed] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      gender: "" as "male" | "female",
      age: "" as unknown as number,
      occupation: "" as (typeof occupations)[number],
      isDiagnosed: "" as (typeof booleanOptions)[number],
      affectedJoints: [] as Array<(typeof joints)[number]>,
      hasChronicPain: "" as (typeof booleanOptions)[number],
      activityLevel: "" as (typeof activityLevels)[number],
    },
  });

  const onSubmit = async (data: z.infer<typeof responseSchema>) => {
    setIsLoading(true);
    try {
      const result = await submitResponse(data);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Survey submitted successfully!");
      form.reset();
      setIsDiagnosed(false);
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof responseSchema>>) => {
    console.log(errors);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-row items-center gap-1">
          <Button
            onClick={() => router.push("/")}
            size="icon"
            variant="ghost"
            className="cursor-pointer"
          >
            <ChevronLeft className="w-12 h-12" />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            Osteoarthritis Survey
          </h1>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Please answer all questions as accurately as possible. Your responses
          are confidential.
        </p>
      </div>

      <form
        id="form"
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        {/* Demographics */}
        <div className="bg-background rounded-xl border p-6 space-y-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Demographics
          </h2>

          <Controller
            name="gender"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-medium">
                  Gender
                </FieldLabel>
                <RadioGroup
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  className="mt-2 flex gap-4"
                >
                  {genders.map((gender) => (
                    <Field
                      key={gender}
                      orientation="horizontal"
                      className="flex items-center gap-2"
                    >
                      <RadioGroupItem value={gender} id={`gender-${gender}`} />
                      <FieldLabel
                        htmlFor={`gender-${gender}`}
                        className="font-normal capitalize cursor-pointer"
                      >
                        {gender}
                      </FieldLabel>
                    </Field>
                  ))}
                </RadioGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="age"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-medium" htmlFor="age">
                  Age
                </FieldLabel>
                <Input
                  {...field}
                  value={isNaN(field.value) ? "" : field.value}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  type="number"
                  id="age"
                  placeholder="Enter your age"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  className="mt-2 max-w-40"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Occupation */}
        <div className="bg-background rounded-xl border p-6 space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Occupation
          </h2>

          <Controller
            name="occupation"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-medium">
                  Current occupation or the one you held for the longest period
                </FieldLabel>
                <RadioGroup
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  className="mt-3 space-y-2"
                >
                  {occupations.map((occupation) => (
                    <Field
                      key={occupation}
                      orientation="horizontal"
                      className="flex items-center gap-2"
                    >
                      <RadioGroupItem
                        value={occupation}
                        id={`occupation-${occupation}`}
                      />
                      <FieldLabel
                        htmlFor={`occupation-${occupation}`}
                        className="font-normal capitalize cursor-pointer"
                      >
                        {occupation.replace(/_/g, " ")}
                      </FieldLabel>
                    </Field>
                  ))}
                </RadioGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Medical History */}
        <div className="bg-background rounded-xl border p-6 space-y-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Medical History
          </h2>

          <Controller
            name="isDiagnosed"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-medium">
                  Have you been diagnosed with osteoarthritis by a doctor?
                </FieldLabel>
                <RadioGroup
                  value={field.value ?? ""}
                  onValueChange={(v: BooleanValue) => {
                    field.onChange(v);
                    setIsDiagnosed(v === "yes");
                  }}
                  className="mt-3 flex gap-4"
                >
                  {booleanOptions.map((opt) => (
                    <Field
                      key={opt}
                      orientation="horizontal"
                      className="flex items-center gap-2"
                    >
                      <RadioGroupItem value={opt} id={`diagnosed-${opt}`} />
                      <FieldLabel
                        htmlFor={`diagnosed-${opt}`}
                        className="font-normal capitalize cursor-pointer"
                      >
                        {opt}
                      </FieldLabel>
                    </Field>
                  ))}
                </RadioGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className={!isDiagnosed ? "hidden" : ""}>
            <Controller
              name="affectedJoints"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-base font-medium">
                    Affected Joints
                  </FieldLabel>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Select all that apply.
                  </p>
                  <FieldGroup className="mt-3 grid grid-cols-2 gap-2">
                    {joints.map((joint) => (
                      <Field
                        key={joint}
                        orientation="horizontal"
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          id={`joint-${joint}`}
                          checked={field.value?.includes(joint) ?? false}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...(field.value ?? []), joint]
                              : field.value?.filter((j) => j !== joint);
                            field.onChange(updated);
                          }}
                        />
                        <FieldLabel
                          htmlFor={`joint-${joint}`}
                          className="font-normal capitalize cursor-pointer"
                        >
                          {joint}
                        </FieldLabel>
                      </Field>
                    ))}
                  </FieldGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name="hasChronicPain"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-medium">
                  Do you experience joint pain or stiffness lasting more than 3
                  months?
                </FieldLabel>
                <RadioGroup
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  className="mt-3 flex gap-4"
                >
                  {booleanOptions.map((opt) => (
                    <Field
                      key={opt}
                      orientation="horizontal"
                      className="flex items-center gap-2"
                    >
                      <RadioGroupItem value={opt} id={`pain-${opt}`} />
                      <FieldLabel
                        htmlFor={`pain-${opt}`}
                        className="font-normal capitalize cursor-pointer"
                      >
                        {opt}
                      </FieldLabel>
                    </Field>
                  ))}
                </RadioGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Activity */}
        <div className="bg-background rounded-xl border p-6 space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Activity
          </h2>

          <Controller
            name="activityLevel"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-medium">
                  Your usual physical activity level
                </FieldLabel>
                <RadioGroup
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  className="mt-3 space-y-2"
                >
                  {activityLevels.map((activity) => (
                    <Field
                      key={activity}
                      orientation="horizontal"
                      className="flex items-center gap-2"
                    >
                      <RadioGroupItem
                        value={activity}
                        id={`activity-${activity}`}
                      />
                      <FieldLabel
                        htmlFor={`activity-${activity}`}
                        className="font-normal capitalize cursor-pointer"
                      >
                        {activity.replace(/_/g, " ")}
                      </FieldLabel>
                    </Field>
                  ))}
                </RadioGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="flex justify-end pb-8">
          <LoadingButton isLoading={isLoading} className="cursor-pointer px-8">
            Submit
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
