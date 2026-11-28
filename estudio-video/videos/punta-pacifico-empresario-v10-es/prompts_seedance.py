# Lienzo de Dreamina: https://dreamina.capcut.com/ai-tool/ai-canvas/43be5cc9-1ee4-47de-b1f3-0234d29c8f3b
# Modo first_last_frame (la foto es el primer cuadro; en las tomas de Fran también el último), 9:16, 720p.
# Prompts de Seedance 2.5 (Dreamina) para las fotos del Empresario V9. Uno por toma; ligados a lo que dice la voz.
COUPLE = ("the client couple — a fit man in his fifties with wavy salt-and-pepper hair, dark sunglasses, white linen shirt and a beige knit "
          "sweater draped over his shoulders, and an elegant blonde woman in her forties with her hair in a low bun, dark sunglasses and a cream silk blouse")
FRAN = ("Fran, the Legacy Capital real-estate advisor — a man in his thirties with slicked-back dark wavy hair, a full dark beard, transparent "
        "light-blue rectangular glasses, navy blue suit, black crew-neck T-shirt, black belt with a gold Ferragamo Gancini buckle, steel wristwatch "
        "and white leather sneakers with a green-red-green stripe; he never puts his hands in his pockets")
KEEP = ("Keep every face, hairstyle, outfit and accessory exactly as in the first frame: the same people with the same identity from the first to the "
        "last frame, no face morphing, no extra people. Keep the architecture, finishes, furniture, vegetation, sky and ocean view exactly as in the "
        "first frame; nothing new appears and nothing disappears. Natural, physically plausible movement with real weight, subtle breathing and natural "
        "blinking. Shot like a premium global real-estate commercial: cinematic 35mm look, smooth stabilized camera, natural light, shallow depth of "
        "field, rich but realistic colors. Photorealistic. No text, no logos, no subtitles, no cuts.")
KEEP_RENDER = ("This is an official architectural render: keep the room, materials, finishes, colors, furniture and light fixtures exactly as in the "
               "first frame; only the camera and the light move. Smooth stabilized camera, premium real-estate commercial look, photorealistic. "
               "No text, no logos, no people appearing, no cuts.")
J = [
 # id, imagen, duración (s), mismo cuadro al final (Fran), prompt
 ('s01', 'a-empresario', 4, False,
  "A successful company owner in his fifties (wavy salt-and-pepper hair, dark sunglasses, navy blazer, white open-collar shirt) sits in his executive "
  "office at sunset. He slowly lowers his hand from his chin, turns his head from the ocean window toward the camera with a calm, confident smile, "
  "then glances back at the golden sun over the Pacific. The laptop screen glows softly, the sunlight shimmers on the sea and creates a warm lens flare. "
  "Very slow cinematic push-in. " + KEEP),
 ('s02', 'n-brindis', 4, False,
  "Golden-hour rooftop terrace with an ocean view: " + COUPLE + " stand at the railing holding glasses of white wine. They turn to each other, smile and "
  "gently clink their glasses, she laughs softly and leans her head toward him; the sea breeze moves her loose hair strands and the sweater; the string "
  "lights sway slightly; the sun sparkles on the ocean behind them. Slow cinematic orbit to the right around the couple. " + KEEP),
 ('s03', 'o-dinero', 4, False,
  "Sunset on a terrace with a sea view: " + COUPLE + " sit at a marble table. He points at the rising chart on the tablet and explains with a smile; she "
  "nods, smiles and rests her chin on her hand, both clearly excited about the investment. The stacks of banknotes, the loose bills and the house keys "
  "stay perfectly still on the table, unchanged. The wine in the glass catches the light, the bougainvillea and the string lights move gently in the breeze, "
  "the sun reflects on the ocean. Slow cinematic push-in toward the couple and the tablet. " + KEEP),
 ('s04', 'd-fachada', 4, False,
  "In front of a modern single-story home with a stone entrance and a roof pergola at golden hour, " + COUPLE + " walk arm in arm slowly toward the camera "
  "along the path, smiling and talking; she carries a woven basket, his sweater and her blouse move naturally with each step. The wall sconces glow warmly. "
  "Smooth backward tracking shot (dolly out) keeping them centered, the house facade fully visible. " + KEEP),
 ('s05', 'i-roof-sofa', 4, False,
  "On a private rooftop lounge facing the ocean at golden hour, " + COUPLE + " relax on the white sofa. She rests her head on his shoulder and closes her "
  "eyes peacefully, he gently caresses her arm and looks at the sea with a serene smile; the waves roll softly and sparkle in the sun, the pergola lights "
  "glow. Slow lateral camera slide to the left with a slight rise. " + KEEP),
 ('s06', 'e-asador', 4, False,
  "Sunny afternoon at the outdoor grill area of the residential community: " + COUPLE + " — he wears a brown apron — grill together. He turns the meat "
  "with the tongs while smoke and heat rise from the grill, the food sizzles; she laughs, holds the bowl and offers him a taste, he smiles at her. Palm "
  "trees and the umbrella sway in the breeze. Gentle handheld-style push-in, warm and joyful family atmosphere. " + KEEP),
 ('s07', 'k-familia', 4, False,
  "A vacation-rental family arrives at a modern single-story home with a roof pergola at sunset: a dark-haired father with a backpack and a rolling "
  "suitcase, a mother in a sun hat and a long cream dress, and their son and daughter pulling their own small suitcases. They walk toward the entrance, "
  "the children walk ahead excitedly, the mother turns back and smiles at the father; the suitcase wheels roll on the pavement, the warm interior lights "
  "glow through the windows. Smooth steadicam follow shot from behind, slowly moving forward. " + KEEP),
 ('s08', 'm-asesoria', 5, True,
  "Sunset terrace with an ocean view. " + FRAN + " sits at a wooden table with the client — the man in his fifties with salt-and-pepper hair, sunglasses "
  "and a beige sweater over his shoulders. Fran turns the tablet slightly toward him and explains the flexible payment plan with a calm open-hand gesture "
  "and a friendly smile; the client listens, nods slowly with his hand at his chin, then smiles with confidence. Steam rises softly from the coffee cup; "
  "the sun sets over the sea. Slow cinematic push-in. The last frame returns to the exact pose of the first frame. " + KEEP),
 ('s09', 'b-firma', 4, True,
  "Golden-hour terrace with an ocean view: " + COUPLE + " sit at a round wooden table signing the reservation of their new home. The man signs the "
  "document with the pen, the woman leans in and smiles happily; " + FRAN + " sits beside them, smiles and nods, and gently points to where to sign. "
  "Warm sunset light, the sea glitters in the background. Slow cinematic arc to the left. The last frame returns to the exact pose of the first frame. " + KEEP),
 ('e1', 'eq-closet', 4, False,
  "Interior of a modern bedroom with built-in full-height wooden closets. Slow, smooth dolly-in toward the wooden closet doors, soft daylight shifting "
  "gently across the wood grain. " + KEEP_RENDER),
 ('e2', 'eq-minisplit', 4, False,
  "Bright open living, dining and kitchen area. The man on the sofa taps his smartphone; on the wall, the white minisplit air conditioner turns on and its "
  "louver opens slowly; the leaves of the plant move slightly with the cool air. Slow camera push-in toward the minisplit. Keep the man's face and clothes "
  "exactly as in the first frame. " + KEEP_RENDER.replace('no people appearing, ', 'no new people, ')),
 ('e3', 'eq-bano', 4, False,
  "Modern bathroom with a floating stone vanity, vessel sink, wide mirror and a wooden door, light from the skylight. Slow, smooth dolly-in toward the "
  "vanity and mirror; soft sunlight slowly moves across the walls. " + KEEP_RENDER),
 ('e4', 'eq-roof', 4, False,
  "Private rooftop garden with a wooden pergola, string lights, an outdoor kitchen, lounge and a set dining table facing the ocean. Slow crane-down "
  "camera move toward the dining table; the string lights flicker on softly, the olive branches and napkins move slightly in the sea breeze, the ocean "
  "sparkles. " + KEEP_RENDER),
 ('s10', 'c-roof-vino', 4, False,
  "Sunset on a private rooftop lounge with a fire pit and ocean view: " + COUPLE + " sit close together with glasses of red wine. They raise and gently clink "
  "their glasses, laugh, and she rests her head on his shoulder while both look at the sunset over the Pacific; the fire pit flames flicker, the warm light "
  "glows on their faces. Slow cinematic push-in. " + KEEP),
 ('s11', 'h-fran-cta', 9, True,
  "Rooftop terrace at sunset with the Pacific Ocean behind. " + FRAN + " stands facing the camera, smiling warmly. He points down with both index fingers "
  "toward the bottom of the frame twice, as if showing the button below the video, then opens his hands in a welcoming gesture, nods with confidence and "
  "returns to pointing down with both hands, smiling. The sea breeze moves his hair slightly, the sun sets over the ocean, the wall lamp glows. Very slow "
  "cinematic push-in. The last frame returns to the exact pose of the first frame. " + KEEP),
]
