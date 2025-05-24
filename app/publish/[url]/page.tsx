"use client";

import { useEffect, useState } from "react";
import apiHandler from "../../../shared/api/axios";
import React from "react";

function isAxiosErrorWithResponse(err: unknown): err is {
  response: { data?: { errors?: { errorDescription?: string } } };
  message?: string;
} {
  return typeof err === "object" && err !== null && "response" in err;
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ url: string }>;
}) {
  const { url } = React.use(params);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("url", url);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setContent(null);
    apiHandler
      .getPublishedProject(url)
      .then((res) => {
        if (res.data?.content) {
          const decoded = (() => {
            try {
              return atob(res.data.content);
            } catch {
              setError("게시된 내용을 해독할 수 없습니다.");
              return null;
            }
          })();
          if (decoded !== null) setContent(decoded);
        } else {
          setError("게시된 내용을 찾을 수 없습니다.");
        }
      })
      .catch((err) => {
        let msg = "게시된 프로젝트를 불러오지 못했습니다.";
        if (isAxiosErrorWithResponse(err)) {
          const responseData = err.response?.data;
          const errorDesc =
            responseData &&
            responseData.errors &&
            responseData.errors.errorDescription;
          if (errorDesc) msg = errorDesc;
          else if ("message" in err && typeof err.message === "string")
            msg = err.message;
        } else if (err instanceof Error) {
          msg = err.message;
        }
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [url]);

  if (loading)
    return <div className="p-8 text-center text-gray-400">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!content)
    return (
      <div className="p-8 text-center text-gray-400">
        게시된 내용이 없습니다.
      </div>
    );
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
