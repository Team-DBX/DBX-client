import { toast } from "react-hot-toast";
import { useRef, useEffect } from "react";
import ClipboardJS from "clipboard";

interface CopyLinkButtonProps {
  linkToCopy: string;
}

function CopyLinkButton({ linkToCopy }: CopyLinkButtonProps) {
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const clipboard = useRef<ClipboardJS | null>(null);

  useEffect(() => {
    if (copyButtonRef.current) {
      clipboard.current = new ClipboardJS(copyButtonRef.current, {
        text: () => linkToCopy,
      });
      clipboard.current.on("success", () => {
        toast.success("Copy success!");
      });
      clipboard.current.on("error", () => {
        toast.error("Copy failed...");
      });
    }

    return () => {
      if (clipboard.current) {
        clipboard.current.destroy();
      }
    };
  }, [linkToCopy]);

  return (
    <button ref={copyButtonRef} type="button">
      Copy provided link
    </button>
  );
}

export default CopyLinkButton;
