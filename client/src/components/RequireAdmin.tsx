import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminMe } from "../services/admin";

type Props = { children: React.ReactNode };

export default function RequireAdmin({ children }: Props) {
  const [ok, setOk] = useState<null | boolean>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await adminMe();
        if (mounted) setOk(true);
      } catch {
        if (mounted) {
          setOk(false);
          navigate("/admin/login", { replace: true });
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (ok === null) {
    return (
      <div className="py-24 text-center text-gray-500">Vérification…</div>
    );
  }
  return <>{children}</>;
}
