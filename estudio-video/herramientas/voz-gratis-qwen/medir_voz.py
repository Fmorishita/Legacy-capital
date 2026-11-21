import sys, numpy as np, soundfile as sf, librosa, onnxruntime as ort
sess = ort.InferenceSession('/root/.cache/dnsmos/sig_bak_ovr.onnx')
p_ovr = np.poly1d([-0.06766283, 1.11546468, 0.04602535]); p_sig = np.poly1d([-0.08397278, 1.22083953, 0.0052439]); p_bak = np.poly1d([-0.13166888, 1.60915514, -0.39604546])
def dnsmos(y, fs):
    a = librosa.resample(y, orig_sr=fs, target_sr=16000); L = int(9.01 * 16000)
    while len(a) < L: a = np.append(a, a)
    hops = int(np.floor(len(a) / 16000) - 9.01) + 1; r = []
    for i in range(hops):
        s, b, o = sess.run(None, {'input_1': a[i * 16000:i * 16000 + L].astype('float32')[None, :]})[0][0]
        r.append((p_sig(s), p_bak(b), p_ovr(o)))
    return np.array(r).mean(0)
for p in sys.argv[1:]:
    y, fs = sf.read(p, dtype='float64'); y = y if y.ndim == 1 else y.mean(1)
    sig, bak, ovr = dnsmos(y, fs)
    f0, vf, _ = librosa.pyin(librosa.resample(y, orig_sr=fs, target_sr=16000), fmin=60, fmax=300, sr=16000, frame_length=1024)
    f0 = f0[~np.isnan(f0)]; st = 12*np.log2(f0/np.median(f0))
    e = librosa.feature.rms(y=y, frame_length=int(0.03*fs), hop_length=int(0.01*fs))[0]; db = 20*np.log10(e+1e-9); thr = db.max()-35
    sil = db < thr
    # pausas internas > 150 ms
    runs=[];c=0
    for s in sil[10:-10]:
        if s: c+=1
        else:
            if c>=15: runs.append(c)
            c=0
    print(f"{p:12s} dur {len(y)/fs:5.2f}s  DNSMOS SIG {sig:.2f} BAK {bak:.2f} OVRL {ovr:.2f} | F0 med {np.median(f0):5.1f} Hz, var {st.std():.2f} st | pausas>150ms {len(runs)} total {sum(runs)/100:.2f}s")
