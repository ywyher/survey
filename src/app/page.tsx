"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getSurveys, deleteSurvey } from "@/lib/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function SurveysPage() {
  const queryClient = useQueryClient()

  const { data: surveys, isLoading, isError } = useQuery({
    queryKey: ["surveys"],
    queryFn: getSurveys,
  })

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: deleteSurvey,
    onSuccess: (result, id) => {
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Response deleted.")
      queryClient.setQueryData(["surveys"], (old: typeof surveys) =>
        old?.filter((s) => s.id !== id)
      )
    },
    onError: () => toast.error("Failed to delete."),
  })

  return (
    <div className="mt-6 flex flex-col gap-2">

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Survey Responses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {surveys?.length ?? 0} total responses
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
            <div key={i} className="bg-background rounded-xl border p-5 animate-pulse h-20" />
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-background rounded-xl border p-6 text-center text-muted-foreground">
          Failed to load surveys.
        </div>
      )}

      {!isLoading && surveys?.length === 0 && (
        <div className="bg-background rounded-xl border p-12 text-center">
          <p className="text-muted-foreground">No responses yet.</p>
          <Button className="mt-4">
            <Link href="/submit">Add the first one</Link>
          </Button>
        </div>
      )}

      {!isLoading && surveys && surveys.length > 0 && (
        <div className="grid gap-3">
          {surveys.map((s) => (
            <div key={s.id} className="
              bg-background rounded-xl border p-5 flex items-end justify-between
            ">
              <div className="flex flex-col gap-2">
                <div>
                  <p className="font-medium capitalize">{s.gender}, {s.age} yrs</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {s.occupation.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="flex flex-row flex-wrap sm:flex gap-2">
                  <Badge label="Diagnosed" value={s.isDiagnosed} />
                  <Badge label="Chronic Pain" value={s.hasChronicPain} />
                  <Badge label="Activity" value={s.activityLevel.replace(/_/g, " ")} />
                  {s.affectedJoints && s.affectedJoints.length > 0 && (
                    <Badge label="Joints" value={s.affectedJoints.join(", ")} />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">
                  {new Date(s.createdAt).toLocaleDateString()}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => remove(s.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium capitalize">{value}</span>
    </span>
  )
}