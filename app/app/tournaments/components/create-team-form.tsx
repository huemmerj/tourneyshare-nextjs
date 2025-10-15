"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
});
export function CreateTeamForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof teamSchema>) => {
    console.log("Form Data:", data);
    try {
      setLoading(true);
      await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      // @Todo only reload if the request was successful
      window.location.reload();
      setLoading(false);
    }
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="text-muted-foreground">
              Team Name
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Enter team name"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button className="mt-4" type="submit">
        {loading && <Spinner />}
        Create
      </Button>
    </form>
  );
}
