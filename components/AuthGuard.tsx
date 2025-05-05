"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return <>{children}</>;
};

export default AuthGuard;
