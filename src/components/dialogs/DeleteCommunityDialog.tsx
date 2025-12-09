import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteCommunityDialogProps {
  onConfirm: () => void;
}

export const DeleteCommunityDialog = ({
  onConfirm,
}: DeleteCommunityDialogProps) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel size={"md"}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          size="md"
          onClick={(e) => {
            e.preventDefault();
            onConfirm();
          }}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
