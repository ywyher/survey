"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getResponses } from "@/lib/actions";
import Delete from "@/components/delete";
import { format } from "date-fns"

export default function ResponsesPage() {

  const {
    data: responses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["responses"],
    queryFn: getResponses,
  });

  return (
    <div className="mt-6 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Survey Responses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {responses?.length ?? 0} total responses
          </p>
        </div>
        <Button>
          <Link className="flex flex-row items-center gap-1" href="/submit">
            <Plus className="w-4 h-4 mr-2" />
            Add Response
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-background rounded-xl border p-5 animate-pulse h-20"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-background rounded-xl border p-6 text-center text-muted-foreground">
          Failed to load responses.
        </div>
      )}

      {!isLoading && responses?.length === 0 && (
        <div className="bg-background rounded-xl border p-12 text-center">
          <p className="text-muted-foreground">No responses yet.</p>
          <Button className="mt-4">
            <Link href="/submit">Add the first one</Link>
          </Button>
        </div>
      )}

      {!isLoading && responses && responses.length > 0 && (
        <div className="grid gap-3">
          {responses.map((s) => (
            <div
              key={s.id}
              className="
              bg-background rounded-xl border p-5 flex items-end justify-between
              flex-col md:flex-row
            "
            >
              <div className="flex flex-col gap-2">
                <div>
                  <p className="font-medium capitalize">
                    {s.gender}, {s.age} yrs
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {s.occupation.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="flex flex-row flex-wrap sm:flex gap-2">
                  <Badge label="Diagnosed" value={s.isDiagnosed} />
                  <Badge label="Chronic Pain" value={s.hasChronicPain} />
                  <Badge
                    label="Activity"
                    value={s.activityLevel.replace(/_/g, " ")}
                  />
                  {s.affectedJoints && s.affectedJoints.length > 0 && (
                    <Badge label="Joints" value={s.affectedJoints.join(", ")} />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">
                  {format(new Date(s.createdAt), "MMM d, yyyy h:mm a")}
                </p>
                <Delete response={s} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium capitalize">{value}</span>
    </span>
  );
}
