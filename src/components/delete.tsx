'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { deleteResponse } from "@/lib/actions";
import { Response } from "@/lib/db/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Delete({ response }: { response: Response }) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient();

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: deleteResponse,
    onSuccess: (result, id) => {
      setIsLoading(true)
      if (result.error) {
        toast.error(result.error);
        setIsLoading(false)
        return;
      }
      toast.success("Response deleted.");
      queryClient.setQueryData(["responses"], (old: Response[]) =>
        old?.filter((s) => s.id !== id),
      );
      setIsLoading(false)
    },
    onError: () => {
      toast.error("Failed to delete.")
      setIsLoading(false)
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        }
      >
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete response?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The response will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => remove(response.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            render={
              <LoadingButton
                variant="destructive"
                isLoading={isLoading}
              >
                Delete
              </LoadingButton>
            }
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}