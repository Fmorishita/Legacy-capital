"""Genera clips imagen-a-video (Seedance 2.5, 720p, 4 s, sin audio) para el Doctor V8.

Uso: ~/.venvs/hf/bin/python clips_doctor.py nombre1 nombre2 ...   (cada clip tiene costo)
Se detiene si la API rechaza por saldo. Nunca imprime la llave.
"""
import json, os, sys, threading, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from dotenv import load_dotenv

HERE = Path(__file__).parent
load_dotenv(HERE / ".env.local")
import higgsfield_client as hf  # noqa: E402

IMG = HERE.parent / "videos/punta-pacifico-doctor-v8-es/assets/img"
OUT = HERE.parent / "videos/punta-pacifico-doctor-v8-es/assets/clips"
LOG = HERE / "salidas/clips_doctor.log.jsonl"
MODEL = "bytedance/seedance-2.5/image-to-video"
BASE = ("Photorealistic, natural lifelike motion from the very first frame, continuous action throughout, "
        "keep every person's face, clothing and the architecture exactly as in the image, "
        "no text, no logos, no new people, no morphing. ")
CLIPS = {
 "doc": ("doc", "A doctor in navy scrubs and a tan jacket stands on a rooftop terrace by the sea. He walks two steps forward, turns his head toward the ocean and smiles with satisfaction, the string lights sway in the breeze. Smooth cinematic camera push-in toward him."),
 "celebra": ("celebra", "A doctor and his partner sit at a table in front of a laptop. They react with joy: he pumps his fist, she claps and laughs, they look at each other and hug. Gentle handheld camera push-in."),
 "pickleball": ("v09", "Two men play pickleball on a blue court. The player in front swings the paddle and hits the yellow ball over the net, the player behind moves and returns it. Fast energetic rally, camera tracks the action sideways."),
 "asador": ("asador", "A man grills steaks on a barbecue, flipping the meat with tongs while smoke rises, the woman next to him tosses a salad and laughs with him. Camera slowly orbits to the right."),
 "pareja-mar": ("v07", "A couple stands by the railing of a rooftop terrace overlooking the ocean. They hold each other, she points at the sea, they laugh, the wind moves her hair and clothes, waves move on the sea. Camera slowly glides left toward the ocean view."),
 "cena": ("v11", "A couple has dinner outdoors at a table with salad and wine. They clink wine glasses, laugh and talk, he serves food onto her plate. Slow camera push-in, candle flame flickers."),
 "roofcena": ("roofcena", "Four friends have dinner on a rooftop terrace at sunset with the sea behind. They raise their glasses and toast, laughing and talking, string lights glow and sway. Slow camera pull-back revealing the terrace."),
 "renta": ("v19", "A homeowner welcomes a guest with a suitcase in front of a modern house. They shake hands warmly, the owner hands over a key card and gestures toward the door, both smile. Camera slowly pushes in."),
 "alberca": ("v08", "A couple sits at the edge of a swimming pool with their feet in the water. They splash water gently with their feet, laugh and talk, the water ripples and sparkles in the sun, palm leaves move. Slow camera push-in."),
 "liquidez": ("v13", "A couple reviews their budget at a wooden table. She writes numbers in a notebook, he types on a calculator and points at the page, they nod and smile at each other. Slow overhead camera drift."),
 "smart": ("v20", "A man sits on a sofa in a modern living room and taps his smartphone; the ceiling lights of the room turn on and brighten in response, he looks up and smiles. Camera slowly pans from the phone to the room."),
 "recamara": ("v27", "A couple sits on the edge of a bed in a bright bedroom looking at a book together. She turns the page, they laugh, he puts his arm around her. Curtains move softly, slow camera push-in toward the window view."),
 "cerradura": ("v21", "A man stands at the front door of a modern house, taps his smartphone and then the digital lock; the lock lights up and he pushes the door open, smiling. Camera slowly moves closer."),
 "aparta": ("v16", "A couple sits on a sofa looking at a laptop, house keys on the table. He points at the screen, she smiles and nods, they high-five. Slow camera push-in toward the keys and the couple."),
 "roofpareja": ("k05", "A couple sits at a table on a rooftop terrace under a wooden pergola with the ocean behind. They talk and laugh, he pours a drink, string lights sway in the breeze. Slow camera rise and push-in toward the sea."),
}
stop = threading.Event()
lock = threading.Lock()

def log(rec):
    with lock:
        with open(LOG, "a") as f:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
        print(json.dumps({k: v for k, v in rec.items() if k != "url"}, ensure_ascii=False), flush=True)

def run(name):
    if stop.is_set():
        return log({"clip": name, "resultado": "omitido"})
    img, prompt = CLIPS[name]
    out = OUT / f"ai-{name}.mp4"
    if out.exists():
        return log({"clip": name, "resultado": "ya existe"})
    last = {"s": None}
    try:
        url = hf.upload_file(IMG / f"{img}.jpg")
        rc = hf.submit(MODEL, arguments={"image_url": url, "prompt": BASE + prompt, "duration": 4,
                                         "resolution": "720p", "generate_audio": False})
        while True:  # se consulta el estado en crudo para conservar el mensaje de error
            res = rc._transport.request("GET", rc.status_url).json()
            if res.get("status") not in ("queued", "in_progress"):
                break
            time.sleep(5)
    except Exception as exc:
        return log({"clip": name, "resultado": "error", "detalle": str(exc)[:300]})
    video = res.get("video") or {}
    vurl = video.get("url") if isinstance(video, dict) else None
    if res.get("status") != "completed" or not vurl:
        err = str(res.get("error") or "")[:300]
        if any(w in err.lower() for w in ("credit", "balance", "top up")):
            stop.set()
        return log({"clip": name, "resultado": "sin video", "estado": res.get("status"), "detalle": err})
    urllib.request.urlretrieve(vurl, out)
    log({"clip": name, "resultado": "ok", "archivo": out.name, "request_id": (res or {}).get("request_id"), "url": vurl})

if __name__ == "__main__":
    names = sys.argv[1:]
    bad = [n for n in names if n not in CLIPS]
    if bad or not names:
        sys.exit(f"clips válidos: {', '.join(CLIPS)}")
    with ThreadPoolExecutor(max_workers=3) as ex:
        list(ex.map(run, names))
