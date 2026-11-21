"""Ejemplo mínimo de la API de Higgsfield con Seedance 2.5 (texto a video).

Uso:  ~/.venvs/hf/bin/python main.py
La llave se lee de .env.local (HF_KEY=key-id:key-secret); nunca se imprime.
OJO: cada ejecución es una generación con costo.
"""
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name(".env.local"))
if not os.getenv("HF_KEY"):
    sys.exit("Falta HF_KEY en .env.local (formato key-id:key-secret).")

import higgsfield_client  # noqa: E402  (se importa después de cargar la llave)
from higgsfield_client import Cancelled, Completed, Failed, NSFW  # noqa: E402

MODEL = "bytedance/seedance-2.5/text-to-video"
ARGS = {
    "prompt": "A cinematic scene at sunset",
    "duration": 5,
    "resolution": "720p",
    "aspect_ratio": "16:9",
}


def main() -> int:
    last = {"status": None}

    def on_update(status):
        name = type(status).__name__
        if name != last["status"]:
            print("estado:", name, flush=True)
        last["status"] = status

    try:
        result = higgsfield_client.subscribe(
            MODEL,
            arguments=ARGS,
            on_enqueue=lambda rid: print("request_id:", rid, flush=True),
            on_queue_update=on_update,
        )
    except Exception as exc:  # errores de red, saldo, validación
        print("ERROR: la solicitud falló:", exc)
        return 1

    final = last["status"]
    if isinstance(final, (Failed, Cancelled, NSFW)):
        print("NO se generó el video. Estado final:", type(final).__name__)
        return 1
    video = (result or {}).get("video") or {}
    url = video.get("url") if isinstance(video, dict) else None
    if not isinstance(final, Completed) or not url:
        print("NO se obtuvo URL de video. Estado:", (result or {}).get("status"))
        return 1
    print("VIDEO_URL:", url)
    return 0


if __name__ == "__main__":
    sys.exit(main())
