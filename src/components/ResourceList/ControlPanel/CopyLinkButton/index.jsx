/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { toast } from "react-hot-toast";
import React, { useRef, useEffect } from "react";
import ClipboardJS from "clipboard";

function CopyLinkButton({ linkToCopy }) {
  const copyButtonRef = useRef(null);
  let clipboard = null;

  useEffect(() => {
    clipboard = new ClipboardJS(copyButtonRef.current, {
      text: () => linkToCopy,
    });

    clipboard.on("success", e => {
      toast.success("Copy success!");
    });

    clipboard.on("error", e => {
      toast.error("Copy failed...");
    });

    return () => {
      clipboard.destroy();
    };
  }, [linkToCopy]);

  return (
    <button ref={copyButtonRef} type="button">
      Copy provided link
    </button>
  );
}

export default CopyLinkButton;
