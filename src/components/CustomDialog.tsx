import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Dispatch, memo, ReactNode, SetStateAction } from "react";

interface Props {
  trigger?: ReactNode | string;
  title?: string;
  description?: string;
  children: ReactNode;
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  side?: "left" | "right" | "center";
}

function CustomDialog({
  children,
  title,
  trigger,
  description,
  isOpen,
  setIsOpen,
  side = "left",
}: Props) {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          {title && (
            <DialogTitle
              className={cn(
                side === "left" && "text-left",
                side === "center" && "text-center",
                side === "right" && "text-right"
              )}
            >
              {title}
            </DialogTitle>
          )}
          {description && (
            <DialogDescription
              className={cn(
                side === "left" && "text-left",
                side === "center" && "text-center",
                side === "right" && "text-right"
              )}
            >
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default memo(CustomDialog);
