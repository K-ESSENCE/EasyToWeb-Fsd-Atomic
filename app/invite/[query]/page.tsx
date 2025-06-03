"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import apiHandler from "../../../shared/api/axios";
import { useRouter } from "next/navigation";

export default function InviteApprovePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.query as string;
  const code = searchParams.get("code") || "";
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!projectId || !code) {
      setStatus("error");
      setMessage("잘못된 초대 링크입니다.");
      return;
    }
    apiHandler
      .acceptProjectInvite(projectId, { code })
      .then(() => {
        setStatus("success");
        setMessage("프로젝트에 성공적으로 참가하였습니다.");
        router.push(`/editor/${projectId}`);
      })
      .catch((err: unknown) => {
        let msg = "초대 승인에 실패했습니다.";
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as { response?: unknown }).response === "object"
        ) {
          const responseData = (
            err as {
              response?: { data?: { errors?: { errorDescription?: string } } };
            }
          ).response?.data;
          const errorDesc =
            responseData &&
            responseData.errors &&
            responseData.errors.errorDescription;
          if (errorDesc) msg = errorDesc;
          else if (
            "message" in err &&
            typeof (err as { message?: unknown }).message === "string"
          ) {
            msg = (err as { message: string }).message;
          }
        } else if (err instanceof Error) {
          msg = err.message;
        }
        setStatus("error");
        setMessage(msg);
      });
  }, [projectId, code]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {status === "loading" && (
          <div className="text-gray-500">초대 승인 중...</div>
        )}
        {status === "success" && (
          <div className="text-green-600 font-semibold">{message}</div>
        )}
        {status === "error" && (
          <div className="text-red-500 font-semibold">{message}</div>
        )}
      </div>
    </div>
  );
}
