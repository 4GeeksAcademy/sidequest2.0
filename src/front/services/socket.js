// src/front/services/socket.js
//
// Tanda 7F — Cliente Socket.IO (singleton).
//
// La autenticación del handshake es la cookie httpOnly sq_access_token
// (Tanda 7D): withCredentials hace que el navegador la adjunte solo.
// Si no hay sesión, getSocket() devuelve null y los consumidores
// simplemente no se suscriben (su polling de fallback sigue activo).
//
// Eventos que emite el backend a la sala personal user_<id>:
//   "notification:new"  {type}     → refetch de /notifications
//   "chat:message"      {room_id}  → refetch de rooms / mensajes
//
// Patrón ping→refetch: el socket solo AVISA; los datos siempre se piden
// por la API REST normal. Una única fuente de verdad.

import { io } from "socket.io-client";
import { isLoggedIn } from "./auth";

const BASE = import.meta.env.VITE_BACKEND_URL || "";

let socket = null;

export const getSocket = () => {
  if (!isLoggedIn() || !BASE) return null;
  if (socket) return socket;
  socket = io(BASE, {
    // Adjunta la cookie httpOnly en el handshake (polling y upgrade).
    withCredentials: true,
    // Intenta WebSocket primero; si el proxy/worker no lo soporta,
    // socket.io cae a long-polling automáticamente.
    transports: ["websocket", "polling"],
  });
  return socket;
};

// Llamar en el logout: cierra la conexión y olvida el singleton para
// que el siguiente login cree una conexión con la cookie nueva.
export const disconnectSocket = () => {
  if (socket) {
    try { socket.disconnect(); } catch (_) { /* ignore */ }
    socket = null;
  }
};
