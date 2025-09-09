"use client";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { jwtDecode } from "jwt-decode"; // <-- Cambia esta línea
import { useUserStore } from "@/store/userStore";
import axios from "axios";

interface LoginProps {
  onClose: () => void;
}

export default function Login({ onClose }: LoginProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const setUser = useUserStore((state) => state.setUser);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const userData: any = jwtDecode(credentialResponse.credential!); // <-- Usa jwtDecode directamente
    console.log("Datos del usuario:", userData);

    setUser({
      name: userData.name,
      email: userData.email,
      picture: userData.picture,
      credential: credentialResponse.credential,
    });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
        { token: credentialResponse.credential }
      );
      console.log("Respuesta del backend:", response.data);
      if (response.data.success) {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Error al enviar el token al backend:", error);
      alert("Error al autenticar con el backend.");
    }
  };

  const handleGoogleError = () => {
    console.error("Error en login con Google");
    alert("Error al iniciar sesión con Google. Intenta nuevamente.");
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={onClose}>
      <div className="w-full max-w-sm p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg animate-fade-in animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <p className="text-gray-200 text-center mb-6">¡Únete a IPx! Crea tu cuenta y accede</p>
        <div className="space-y-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            size="large"
            text="continue_with"
            shape="pill"
            theme="filled_black"
            width="350"
            locale="es"
          />
          <button onClick={handleAppleLogin} className="w-full bg-black text-white py-2 px-4 rounded-lg border border-white/20 flex items-center justify-center gap-3 font-medium hover:bg-gray-900 transition-colors">
            <FaApple size={18} className="text-white" />
            <span>Continuar con Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
}
