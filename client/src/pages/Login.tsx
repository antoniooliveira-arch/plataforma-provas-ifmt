import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { startLogin } from "@/const";
import { LogIn, School, Shield } from "lucide-react";

const IFMT_GREEN = "#009b3f";
const IFMT_GREEN_DARK = "#006e2d";

export default function Login() {
  const portalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const configured = Boolean(portalUrl) && Boolean(appId);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md mx-4 p-0 shadow-xl border-0">
        <div
          className="h-2"
          style={{ background: `linear-gradient(90deg, ${IFMT_GREEN}, ${IFMT_GREEN_DARK})` }}
        />
        <div className="p-8 pt-10 flex flex-col items-center text-center">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-xl mb-6"
            style={{
              background: `linear-gradient(135deg, ${IFMT_GREEN}, ${IFMT_GREEN_DARK})`,
            }}
          >
            <School className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1">
            Plataforma Institucional de Provas
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Instituto Federal de Educação, Ciência e Tecnologia de Mato Grosso
          </p>

          <div className="grid grid-cols-3 items-center gap-2 w-full mb-6">
            <div className="border-t" />
            <span className="text-xs uppercase text-muted-foreground font-medium">
              Acesso
            </span>
            <div className="border-t" />
          </div>

          <div className="flex items-start gap-3 text-left mb-6">
            <Shield className="h-5 w-5" style={{ color: IFMT_GREEN }} />
            <p className="text-sm text-muted-foreground">
              Acesse com sua conta institucional utilizando a autenticação
              única do IFMT.
            </p>
          </div>

          {configured ? (
            <Button
              type="button"
              className="w-full h-11 text-base font-semibold"
              style={{
                background: `linear-gradient(135deg, ${IFMT_GREEN}, ${IFMT_GREEN_DARK})`,
              }}
              onClick={startLogin}
            >
              <LogIn className="h-5 w-5 mr-2" />
              Entrar com conta institucional
            </Button>
          ) : (
            <div className="w-full space-y-3">
              <p className="text-xs text-muted-foreground">
                As variáveis de ambiente <code>VITE_OAUTH_PORTAL_URL</code> e{" "}
                <code>VITE_APP_ID</code> não estão configuradas. Configure-as
                no painel da Vercel para ativar o login.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 text-base"
                onClick={() => {
                  alert(
                    `Configure as variáveis de ambiente no Vercel:\n\n- VITE_OAUTH_PORTAL_URL\n- VITE_APP_ID\n- OAUTH_SERVER_URL\n- JWT_SECRET\n- OWNER_OPEN_ID`
                  );
                }}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Configurar acesso
              </Button>
            </div>
          )}
        </div>
        <div className="h-px bg-border" />
        <div className="px-8 py-4 text-center">
          <p className="text-[10px] uppercase text-muted-foreground">
            Plataforma de Provas On-line
          </p>
        </div>
      </Card>
    </div>
  );
}
