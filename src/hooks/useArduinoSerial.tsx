import { useCallback, useEffect, useRef, useState } from "react";

export interface SensorReading {
  rpm?: number;
  bpm?: number;
  speed_kmh?: number;
  distance_m?: number;
  force_n?: number;
  raw?: Record<string, unknown>;
  timestamp: number;
}

interface UseArduinoSerialOptions {
  baudRate?: number;
  onReading?: (reading: SensorReading) => void;
}

// Web Serial API typings (minimal, since lib.dom may not include them)
type SerialPortLike = {
  open: (opts: { baudRate: number }) => Promise<void>;
  close: () => Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
};

declare global {
  interface Navigator {
    serial?: {
      requestPort: () => Promise<SerialPortLike>;
      getPorts: () => Promise<SerialPortLike[]>;
    };
  }
}

/**
 * Parses a line coming from the Arduino.
 * Accepts either JSON (e.g. {"rpm":80,"bpm":120,"speed":15.2,"distance":250,"force":40})
 * or CSV with key=value pairs (e.g. "rpm=80,bpm=120,speed=15.2,distance=250,force=40")
 */
function parseLine(line: string): SensorReading | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  try {
    if (trimmed.startsWith("{")) {
      const obj = JSON.parse(trimmed);
      return {
        rpm: numOrUndef(obj.rpm),
        bpm: numOrUndef(obj.bpm),
        speed_kmh: numOrUndef(obj.speed ?? obj.speed_kmh),
        distance_m: numOrUndef(obj.distance ?? obj.distance_m),
        force_n: numOrUndef(obj.force ?? obj.force_n),
        raw: obj,
        timestamp: Date.now(),
      };
    }
  } catch {
    // fall through to CSV
  }

  // key=value,key=value
  if (trimmed.includes("=")) {
    const out: Record<string, number> = {};
    trimmed.split(/[,;\s]+/).forEach((pair) => {
      const [k, v] = pair.split("=");
      if (k && v !== undefined) {
        const n = Number(v);
        if (!Number.isNaN(n)) out[k.toLowerCase()] = n;
      }
    });
    if (Object.keys(out).length === 0) return null;
    return {
      rpm: out.rpm,
      bpm: out.bpm,
      speed_kmh: out.speed ?? out.speed_kmh,
      distance_m: out.distance ?? out.distance_m,
      force_n: out.force ?? out.force_n,
      raw: out,
      timestamp: Date.now(),
    };
  }

  return null;
}

function numOrUndef(v: unknown): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function useArduinoSerial({ baudRate = 9600, onReading }: UseArduinoSerialOptions = {}) {
  const [supported, setSupported] = useState<boolean>(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latest, setLatest] = useState<SensorReading | null>(null);

  const portRef = useRef<SerialPortLike | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const keepReadingRef = useRef(false);
  const onReadingRef = useRef(onReading);

  useEffect(() => {
    onReadingRef.current = onReading;
  }, [onReading]);

  useEffect(() => {
    setSupported(typeof navigator !== "undefined" && !!navigator.serial);
  }, []);

  const disconnect = useCallback(async () => {
    keepReadingRef.current = false;
    try {
      await readerRef.current?.cancel();
    } catch {
      /* ignore */
    }
    try {
      readerRef.current?.releaseLock();
    } catch {
      /* ignore */
    }
    try {
      await portRef.current?.close();
    } catch {
      /* ignore */
    }
    readerRef.current = null;
    portRef.current = null;
    setConnected(false);
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    if (!navigator.serial) {
      setError("Web Serial n'est pas supporté par ce navigateur. Utilisez Chrome ou Edge sur ordinateur.");
      return;
    }
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate });
      portRef.current = port;
      setConnected(true);
      keepReadingRef.current = true;

      // Read loop
      (async () => {
        const decoder = new TextDecoder();
        let buffer = "";
        while (keepReadingRef.current && port.readable) {
          const reader = port.readable.getReader();
          readerRef.current = reader;
          try {
            while (keepReadingRef.current) {
              const { value, done } = await reader.read();
              if (done) break;
              if (!value) continue;
              buffer += decoder.decode(value, { stream: true });
              let idx;
              while ((idx = buffer.indexOf("\n")) >= 0) {
                const line = buffer.slice(0, idx);
                buffer = buffer.slice(idx + 1);
                const reading = parseLine(line);
                if (reading) {
                  setLatest(reading);
                  onReadingRef.current?.(reading);
                }
              }
            }
          } catch (e) {
            console.error("Serial read error", e);
          } finally {
            try {
              reader.releaseLock();
            } catch {
              /* ignore */
            }
          }
        }
      })();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Connexion impossible";
      setError(msg);
      setConnected(false);
    }
  }, [baudRate]);

  useEffect(() => {
    return () => {
      keepReadingRef.current = false;
      readerRef.current?.cancel().catch(() => {});
      portRef.current?.close().catch(() => {});
    };
  }, []);

  return { supported, connected, error, latest, connect, disconnect };
}
