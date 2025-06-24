"use client";

import { useEffect, useState } from "react";
import apiHandler from "../../../shared/api/axios";
import React from "react";
import { SectionData } from "../../../components/types/common/layoutStyle";
import LayoutViewer from "../../../components/LayoutViewer";
import CenteredStatus from "../../../components/CenteredStatus";

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
  const [content, setContent] = useState<SectionData[] | null>(null);
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
          console.log(res.data.content, "??");
          setContent(JSON.parse(res.data.content));
        }
        if (res?.data?.content === null) {
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

  if (loading) return <CenteredStatus type="loading" message="로딩 중입니다..." />;
  if (error) return <CenteredStatus type="error" message={error} />;
  if (!content) return <CenteredStatus type="empty" message="없는 페이지입니다." />;

  return (
    <div className="w-full h-full">
      <LayoutViewer sectionValues={content}
                    imageStyles={{}}
      />
    </div>
  );
}
