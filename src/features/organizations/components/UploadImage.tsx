import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Dispatch, memo, SetStateAction } from "react";

interface Props {
  className?: string;
  image: string;
  setImage: Dispatch<SetStateAction<string>>;
}

function UploadImage({ className, image, setImage }: Props) {
  return image ? (
    <div
      className={cn(
        "size-24 mx-auto flex items-center justify-center relative",
        className
      )}
    >
      <img src={image} alt={image} className="size-full border rounded-full" />
      <div
        className="absolute size-8 bg-rose-500 hover:bg-rose-600 group cursor-pointer rounded-full flex items-center justify-center top-0 right-0"
        onClick={() => setImage("")}
      >
        <X className="group-hover:text-white text-zinc-100" />
      </div>
    </div>
  ) : (
    <UploadButton
      className={className}
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        setImage(res[0].url);
        console.log("Files: ", res);
      }}
    />
  );
}

export default memo(UploadImage);
