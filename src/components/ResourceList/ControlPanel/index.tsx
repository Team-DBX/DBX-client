import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { toast } from "react-hot-toast";
import { getAuth, signOut } from "firebase/auth";
import CopyLinkButton from "./CopyLinkButton";

interface ControlPanelProps {
  email: string | null;
  resourceData: {
    categoryName: string;
    authorName: string;
    resourceName: string;
    uploadDate: string;
    version: string;
    files: Array<{
      _id: string;
      fileName: string;
      svgUrl: string;
      pngUrl: string;
    }>;
  } | null;
  categoryId: string;
  resourceId: string;
}

function ControlPanel({
  email,
  resourceData,
  categoryId,
  resourceId,
}: ControlPanelProps) {
  const providedUrl = `${
    import.meta.env.VITE_SERVER_URL
  }/dbx/categories/${categoryId}/resources/${resourceId}`;

  async function handleLogOut() {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      toast.error("Logout failed");
    }
  }

  const controlPanelHeader = (
    <div className="flex items-center bg-stone-100 h-16 text-stone-500">
      <div className="flex items-center ml-4">
        <div className="w-6 h-6 rounded-md bg-green-400"> </div>
        <p className="ml-1 text-base">{email}</p>
        <button
          className="hover:bg-stone-200 flex ml-2 rounded p-1 text-sm bg-gray-300"
          type="button"
          onClick={handleLogOut}
        >
          Logout
        </button>
      </div>
    </div>
  );

  if (!resourceData) {
    return (
      <div className="w-1/5 h-full drop-shadow-2xl bg-stone-300">
        {controlPanelHeader}
      </div>
    );
  }

  const { categoryName, authorName, resourceName, uploadDate, version, files } =
    resourceData;

  function handleDownload(fileUrl: string) {
    const url = new URL(fileUrl);
    const fileKey = decodeURIComponent(url.pathname.substring(1));
    const s3 = new S3Client({
      region: "ap-northeast-2",
      credentials: {
        accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY,
      },
    });
    const params = {
      Bucket: "team-dbx",
      Key: fileKey,
    };

    function downloadBlob(blob: Blob, name: string) {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name;
      document.body.appendChild(link);
      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      document.body.removeChild(link);
    }

    async function getS3Object() {
      try {
        const command = new GetObjectCommand(params);
        const data = await s3.send(command);
        const dataBody = await data.Body?.transformToByteArray();

        if (dataBody && url.pathname) {
          const fileBlob = new Blob([dataBody], {
            type: "application/octet-stream",
          });

          downloadBlob(fileBlob, url.pathname.split("/").pop() || "downLoad");
        }
      } catch (err) {
        toast.error("File download failed.");
      }
    }

    getS3Object();
  }

  return (
    <div className="w-1/5 h-full drop-shadow-2xl bg-stone-300">
      <div className="flex items-center bg-stone-100 h-16 text-stone-500">
        <div className="flex items-center ml-6">
          <div className="w-8 h-8 rounded-md bg-green-400"> </div>
          <p className="ml-4">{email}</p>
        </div>
      </div>
      <div className="p-6">
        <div className="p-3 bg-stone-600 text-stone-100 rounded-xl mb-5">
          <h2 className="text-xl font-bold mb-2">{resourceName}</h2>
          <p>Category: {categoryName}</p>
          <p>Author: {authorName}</p>
          <p>Upload date: {new Date(uploadDate).toLocaleDateString()}</p>
          <p>Version: {version}</p>
        </div>
        <div className="flex justify-center bg-stone-800 text-center rounded-full text-sm py-1 text-stone-100">
          <span className="material-symbols-outlined pr-1">content_paste</span>
          <CopyLinkButton linkToCopy={providedUrl} />
        </div>
        <h3 className="text-lg font-bold mt-4">Files:</h3>
        <ul>
          {files.map(file => (
            <li key={file._id} className=" p-3 bg-stone-100 mb-5 rounded-xl">
              <h4 className="mb-3 px-3 bg-stone-400 inline-block text-stone-100 text-md font-semibold rounded-full">{`${file.fileName}`}</h4>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => handleDownload(file.svgUrl)}
                  className="hover:bg-stone-200 flex font-medium"
                >
                  <span className="material-symbols-outlined">download</span>
                  <p>SVG</p>
                </button>
                <p className="px-3"> / </p>
                <button
                  type="button"
                  onClick={() => handleDownload(file.pngUrl)}
                  className="hover:bg-stone-200 flex font-medium"
                >
                  <span className="material-symbols-outlined">download</span>
                  <p>PNG</p>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ControlPanel;
