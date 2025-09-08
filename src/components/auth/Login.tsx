"use client";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useEffect, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function Login() {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    console.log("Login exitoso con Google:", credentialResponse);
  };

  const handleGoogleError = () => {
    console.error("Error en login con Google");
  };

  const handleAppleLogin = () => {
    if (!window.AppleID) {
      console.error("AppleID SDK no cargado");
      alert("Error al cargar Apple Login. Intenta nuevamente.");
      return;
    }
    window.AppleID.auth.init({
      clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
      scope: "name email",
      redirectURI: window.location.origin + "/auth/callback/apple",
      state: Math.random().toString(36).substring(2, 15),
      usePopup: true,
    }).then(() => {
      window.AppleID.auth.signIn();
    });
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    script.onload = () => console.log("AppleID SDK cargado");
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
      <p className="text-gray-200 text-center mb-4">
        ¡Únete a IPX! Crea tu cuenta y accede
      </p>
      <div className="space-y-3">
        {/* Botón personalizado de Google */}
        <div ref={googleButtonRef}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            size="large"
            text="continue_with"
            shape="pill"
            theme="filled_black"
            width="350"
            locale="es"
            containerProps={{
              style: { display: 'none' }
            }}
          />
        </div>
        <button
          onClick={() => googleButtonRef.current?.querySelector('button')?.click()}
          className="w-full bg-white text-black py-2 px-4 rounded-lg flex items-center justify-center gap-3 font-medium hover:bg-gray-200 transition-colors"
        >
          <FcGoogle size={18} />
          <span>Continuar con Google</span>
        </button>
        {/* Botón de Apple */}
        <button
          onClick={handleAppleLogin}
          className="w-full bg-black text-white py-2 px-4 rounded-lg border border-white/20 flex items-center justify-center gap-3 font-medium hover:bg-gray-900 transition-colors"
        >
          <FaApple size={18} className="text-white" />
          <span>Continuar con Apple</span>
        </button>
      </div>
    </div>
  );
}
