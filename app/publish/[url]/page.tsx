"use client";

import { useEffect, useState } from "react";
import apiHandler from "../../../shared/api/axios";
import React from "react";
import { SectionData } from "../../../components/types/common/layoutStyle";

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

  if (loading)
    return <div className="p-8 text-center text-gray-400">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!content)
    return (
      <div className="p-8 text-center text-gray-400">없는 페이지입니다.</div>
    );

  return (
    <div className="w-full h-full flex flex-col gap-4 p-8  text-black">
      {content?.map((section) => {
        return (
          <div
            className="w-full h-[200px] justify-center items-center p-8 border border-gray-200 flex gap-4"
            key={section.sectionKey}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {section.layoutValues.map((item) => {
              if (item.layoutName === "text") {
                return (
                  <div className="text-xl " key={item.id}>
                    {item.textValue}
                  </div>
                );
              }
              if (item.layoutName === "img") {
                return (
                  <div className="w-48 h-full" key={item.id}>
                    <img
                      className="w-full h-full object-cover"
                      alt={`image-${item.id}`}
                      src={`https://dev-api.easytoweb.store${item.imgValue}?format=WEBP`}
                    />
                  </div>
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
}
