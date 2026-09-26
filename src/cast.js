// cast.js: Konata Izumi, in the film's watercolor-and-ink style.
// Keep the researcher/researcherDancer API: the chapters use it for the singer.
// (x, y) is the ground point; shoulders are (+/-1.75s, -7.6s), hands 3.2s from
// the shoulders, and the head centre is (0, -10.7s). Scene props rely on these anchors.
// All motion is computed from T and the supplied pose, including the long hair.
// Existing eyes/mouth/movement options and draw/handL/handR hooks remain supported.
// coat/pants/shirt tint the blouse/skirt/scarf. glassesTilt is accepted but unused.

const KONATA = {
  hair: '#537CDF', hairLight: '#82A5F5', hairDark: '#3455A7', iris: '#479C70',
  uniform: '#FFF8EB', collar: '#CC4357', skirt: '#BD3C54', scarf: '#F0C856',
  sock: '#FFF4E4', shoe: '#643C3F'
};
// Kept global for the chapter's particle version of the character.
const SKIN = '#FFE0C7', HAIR = KONATA.hair, COAT = KONATA.uniform, PANTS = KONATA.skirt;

function researcher(x, y, s, o = {}) {
  const sw = clamp(s / 13, .45, 2.2), J = s * .035, sq = (o.sq || 0) + (o.take || 0);
  const coat = o.coat || COAT, skirt = o.pants || PANTS, scarf = o.shirt || KONATA.scarf;
  const up = clamp(o.hairUp || 0), motion = o.run != null ? .55 : o.walk != null ? .28 : .12;
  const sway = Math.sin(T * (o.run != null ? 9 : 2.6)) * motion + Math.sin(T * 4.1) * .07;
  if (!o.noShadow) paint(ellPts(x, y + s * .1, s * 3.2, s * .7, 18), { fill: PAL.ink, fillOp: 80, bleed: .2, tex: .3, border: .1, ink: null });
  push(); translate(x, y + (o.dy || 0) * s);
  if (o.rot) rotate(o.rot);
  const sx = (o.flip ? -1 : 1) * (o.spin != null ? Math.cos(o.spin * TAU) : 1);
  scale(sx * (1 + sq * .5), 1 - sq);
  const pts = a => a.map(([px, py]) => [px * s, py * s]);

  // Long back hair: separate tapered locks, with broad pigment washes rather than
  // many expensive watercolor fills. Seated hair folds beside the chair.
  const backHair = () => {
    const end = o.sit ? -2.5 : -.65, drift = sway + up * .15;
    const hp = [[-2.5, -11.6], [-2.7, -8.5], [-3.05 + drift * .3, -4.8],
      [-3.35 + drift, end - .15], [-2.15 + drift, end - .9], [-1.65 + drift, end + .2],
      [-.65 + drift, end - .8], [.35 + drift, end], [1.05 + drift, end - .95],
      [2.35 + drift, end - .1], [3.15 + drift, end - .8], [2.85 + drift * .4, -6.8], [2.5, -11.7]];
    paint(pts(hp), { wash: HAIR, ink: PAL.ink, sw: sw * .8, curv: .22 });
    paint(pts([[-2.55, -10.5], [-2.45, -6], [-2.95 + drift, end - .5],
      [-2.15 + drift, end - 1.1], [-1.85, -6.5], [-1.9, -10.7]]), { wash: KONATA.hairDark, washOp: 150, ink: null, curv: .35 });
    paint(pts([[1.45, -10.7], [2.2, -10.1], [2.35 + drift * .4, -6],
      [2.6 + drift, end - 1.1], [1.9 + drift, end - 1.5], [1.7, -6.7]]), { wash: KONATA.hairLight, washOp: 120, ink: null, curv: .35 });
    for (const side of [-1, 1]) inkLine(pts([[side * 2.45, -8.7], [side * 2.35 + drift * .5, -4.7],
      [side * 2.4 + drift, end - 1.2]]), sw * .35, KONATA.hairDark, 'inkfine', .55);
  };
  if (!o.back) backHair();

  const leg = (side, i) => {
    let h = o.sit ? 2.9 : 4.1, a = 0;
    if (o.walk != null) { const ph = Math.sin((o.walk + (i ? .5 : 0)) * TAU); if (ph > 0) h -= ph * .8; }
    if (o.run != null) a = Math.sin((o.run + (i ? .5 : 0)) * TAU) * .55;
    push(); translate(side * .8 * s, -4.0 * s); rotate(a);
    paint(rectPts(-.42 * s, 0, .84 * s, h * s, J), { wash: SKIN, ink: PAL.ink, sw: sw * .55 });
    paint(rectPts(-.43 * s, h * .42 * s, .86 * s, h * .58 * s, J * .5), { wash: KONATA.sock, ink: PAL.ink, sw: sw * .5 });
    paint(ellPts(side * .16 * s, h * s, .76 * s, .34 * s, 12), { wash: KONATA.shoe, ink: PAL.ink, sw: sw * .55 });
    inkLine([[-.35 * s, h * s - .12 * s], [.35 * s, h * s - .12 * s]], sw * .3, '#A57467', 'inkfine', 0);
    pop();
  };
  leg(-1, 0); leg(1, 1);

  // Short sailor sleeves, with the old shoulder, hand and prop-hook coordinates.
  const arm = (side, a, hook) => {
    push(); translate(side * 1.75 * s, -7.6 * s); rotate(side < 0 ? a : -a);
    paint(rectPts(side < 0 ? -3 * s : 0, -.32 * s, 3 * s, .64 * s, J), { wash: SKIN, ink: PAL.ink, sw: sw * .6 });
    paint(pts([[0, -.55], [side * 1.65, -.49], [side * 1.65, .48], [0, .6]]), { wash: coat, ink: PAL.ink, sw: sw * .65 });
    inkLine(pts([[side * 1.4, -.46], [side * 1.4, .46]]), sw * .7, KONATA.collar, 'ink', 0);
    translate(side * 3.2 * s, 0);
    paint(ellPts(0, 0, .5 * s, .48 * s, 12), { wash: SKIN, ink: PAL.ink, sw: sw * .55 });
    if (hook) { if (side < 0) scale(-1, 1); hook(s, sw); }
    pop();
  };
  arm(-1, o.aL ?? -1.25, o.handL); arm(1, o.aR ?? -1.25, o.handR);

  // White blouse, red sailor collar and a short pleated skirt. The legs retain
  // the original standing/seated foot height while leaving room for the socks.
  paint(pts([[-1.9, -8.2], [1.9, -8.2], [1.7, -5.25], [-1.7, -5.25]]), { wash: coat, ink: PAL.ink, sw: sw * .8 });
  paint(pts([[-1.65, -5.3], [1.65, -5.3], [2.4 + sway * .12, -3.2],
    [1.2, -3.05], [0, -3.18], [-1.2, -3.05], [-2.4 + sway * .12, -3.2]]), { wash: skirt, ink: PAL.ink, sw: sw * .8 });
  for (const xx of [-1.15, -.4, .4, 1.15]) {
    inkLine(pts([[xx, -5.05], [xx * 1.48 + sway * .1, -3.32]]), sw * .45, '#8F2F4A', 'inkfine', 0);
  }
  inkLine(pts([[-1.65, -5.2], [1.65, -5.2]]), sw * .8, KONATA.collar, 'ink', 0);
  if (!o.back) {
    paint(pts([[-1.85, -8.2], [-.65, -8.28], [0, -6.6], [.65, -8.28], [1.85, -8.2],
      [1.4, -7.25], [0, -6.35], [-1.4, -7.25]]), { wash: KONATA.collar, ink: PAL.ink, sw: sw * .45 });
    inkLine(pts([[-1.5, -8.05], [-1.12, -7.4], [0, -6.58], [1.12, -7.4], [1.5, -8.05]]), sw * .32, KONATA.uniform, 'inkfine', 0);
    paint(pts([[0, -6.85], [-.48, -5.75], [-.1, -5.2], [.12, -5.8], [.4, -5.45], [.48, -5.8]]), { wash: scarf, ink: PAL.ink, sw: sw * .4 });
    paint(ellPts(0, -6.75 * s, .3 * s, .27 * s, 10), { wash: scarf, ink: PAL.ink, sw: sw * .4 });
    if (o.bowtie) {
      paint(pts([[-.05, -6.8], [-.65, -7.12], [-.65, -6.55]]), { wash: scarf, ink: PAL.ink, sw: sw * .35 });
      paint(pts([[.05, -6.8], [.65, -7.12], [.65, -6.55]]), { wash: scarf, ink: PAL.ink, sw: sw * .35 });
    }
  } else {
    paint(pts([[-1.75, -8.2], [1.75, -8.2], [1.35, -6.65], [-1.35, -6.65]]), { wash: KONATA.collar, ink: PAL.ink, sw: sw * .5 });
    backHair();
  }

  if (!o.back) {
    paint(rectPts(-.45 * s, -8.95 * s, .9 * s, .95 * s), { wash: SKIN, ink: null });
    // A soft anime jaw with generous cheeks, at the original head centre.
    paint(pts([[-2.25, -11.55], [-2.32, -10.25], [-1.8, -9.25], [-.7, -8.7],
      [0, -8.58], [.7, -8.7], [1.8, -9.25], [2.32, -10.25], [2.25, -11.55], [0, -12.6]]),
      { wash: SKIN, ink: PAL.ink, sw: sw * .8, curv: .35 });
    if (o.blush) for (const bx of [-1.65, 1.65]) paint(ellPts(bx * s, -9.65 * s, .48 * s, .22 * s, 12), { fill: PAL.rose, fillOp: 140, bleed: .12, ink: null });
    rFace(s, sw, o);
  }

  // Rounded blue crown, pointed fringe and two cheek-length locks.
  const crown = [];
  for (let i = 0; i <= 14; i++) {
    const a = Math.PI + i / 14 * Math.PI;
    crown.push([Math.cos(a) * 2.65, -10.65 + Math.sin(a) * 2.7]);
  }
  if (o.back) crown.push([2.45, -9.3], [0, -8.9], [-2.45, -9.3]);
  else crown.push([2.55, -9.3], [1.94, -9.75], [1.87, -11.28], [1.24, -10.92],
    [1.36, -11.85], [.5, -10.94], [.53, -11.85], [-.38, -10.99], [-.12, -12.02],
    [-1.2, -10.98], [-1.0, -11.83], [-1.85, -11.3], [-1.94, -9.65], [-2.55, -9.18]);
  paint(pts(crown), { wash: HAIR, ink: o.back ? null : PAL.ink, sw: sw * .6, curv: .12 });
  if (o.back) inkLine(pts(crown.slice(0, 15)), sw * .75, PAL.ink, 'ink', .25);
  inkLine(pts([[-1.98, -12.03], [-1.05, -12.65], [.3, -12.88], [1.3, -12.5]]), sw * 1.1, KONATA.hairLight, 'ink', .55);
  if (o.back) inkLine(pts([[.35, -12.75], [.85, -11.5], [.65, -9.35]]), sw * .45, KONATA.hairDark, 'inkfine', .5);

  // Konata's long curved ahoge; hairUp makes it spring upright in surprise.
  inkLine(pts([[-.25, -13.17], [.15 + sway * .15, -14.28 - up * .55],
    [1.3 + sway * .25, -14.48 - up * .45], [1.85 + sway * .3, -13.9 - up * .65]]), sw * .9, HAIR, 'ink', .65);
  if (o.draw) o.draw(s, sw);
  pop();
  if (o.emote) emote(o.emote, x + (o.flip ? -1 : 1) * 3.2 * s, y + (o.dy || 0) * s - 13.4 * s, s * 1.1, o.emoteK ?? 1);
}

function rFace(s, sw, o) {
  const e = (o.squint || 0) > .5 ? 'closed' : (o.eyes || 'dot');
  const blink = (e === 'dot' || e === 'look') && ((T * .8 + 1.3) % 3.7) < .12;
  const gy = -10.48 * s, lx = clamp(o.lookX || 0, -1.5, 1.5) * .21 * s, ly = clamp(o.lookY || 0, -1.5, 1.5) * .13 * s;
  for (const side of [-1, 1]) {
    const cx = side * 1.02 * s, cy = gy;
    if (e === 'closed' || blink) {
      inkLine([[cx - .61 * s, cy + .04 * s], [cx, cy + (e === 'closed' ? -.19 : .08) * s], [cx + .61 * s, cy + .04 * s]], sw * .9, PAL.ink, 'ink', .4);
    } else if (e === 'x') {
      inkLine([[cx - .4 * s, cy - .4 * s], [cx + .4 * s, cy + .4 * s]], sw * .9, PAL.ink, 'ink', 0);
      inkLine([[cx + .4 * s, cy - .4 * s], [cx - .4 * s, cy + .4 * s]], sw * .9, PAL.ink, 'ink', 0);
    } else if (e === 'heart') {
      paint(heartPts(cx, cy, .53 * s), { wash: '#E2476E', ink: PAL.ink, sw: sw * .4 });
    } else if (e === 'star') {
      paint(starPts(cx, cy, .68 * s, .42, 4), { wash: PAL.ochre, ink: PAL.ink, sw: sw * .45 });
    } else if (e === 'swirl') {
      paint(ellPts(cx, cy, .63 * s, .64 * s, 14), { wash: KONATA.uniform, ink: null });
      const sp = []; for (let k = 0; k < 15; k++) { const a = k * .8 + T * 7 * side, r = k * .039 * s; sp.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
      inkLine(sp, sw * .65, PAL.ink, 'inkfine', .6);
    } else {
      // Half-lidded green eyes give her the familiar deadpan expression. Wide
      // and sad poses open the same eye shape, without the former round frames.
      const wide = e === 'wide', top = (wide ? -.68 : e === 'sad' ? -.36 : -.12) * s;
      const bottom = .58 * s, ew = .7 * s, lidY = cy + top;
      const eye = [[cx - ew, lidY], [cx + ew, lidY - (wide ? .03 : .04) * s],
        [cx + ew * .86, cy + bottom * .72], [cx + ew * .42, cy + bottom],
        [cx - ew * .55, cy + bottom], [cx - ew, cy + bottom * .65]];
      paint(eye, { wash: '#FFFCF2', ink: null, curv: .25 });
      inkLine([[cx - ew * .63, cy + bottom * .96], [cx, cy + bottom * 1.03], [cx + ew * .61, cy + bottom * .93]], sw * .27, '#8C6261', 'inkfine', .45);
      const iy = lidY + .07 * s + ly * .35, ih = bottom - top - .13 * s;
      paint(rrPts(cx + lx - .34 * s, iy, .68 * s, ih, .18 * s), { wash: KONATA.iris, ink: null });
      paint(ellPts(cx + lx, iy + ih * .46, (wide ? .15 : .12) * s, ih * .34, 10), { wash: '#1E4C49', ink: null });
      paint(ellPts(cx + lx - .13 * s, iy + ih * .19, .105 * s, .1 * s, 8), { wash: KONATA.uniform, ink: null });
      inkLine([[cx - ew - .05 * s, lidY], [cx, lidY - .035 * s], [cx + ew + .07 * s, lidY - .035 * s]], sw * 1.05, PAL.ink, 'ink', .15);
      inkLine([[cx + side * ew, lidY], [cx + side * (ew + .13 * s), lidY - .17 * s]], sw * .65, PAL.ink, 'ink', 0);
    }
  }
  const b = o.brows || (e === 'sad' ? 'worried' : null);
  if (b) for (const side of [-1, 1]) {
    const bx = side * 1.02 * s, by = -11.28 * s;
    const tilt = b === 'worried' ? -side * .3 : b === 'angry' ? side * .35 : 0, lift = b === 'up' ? -.2 * s : 0;
    inkLine([[bx - .4 * s, by + lift + tilt * s * .6], [bx + .4 * s, by + lift - tilt * s * .6]], sw * .55, KONATA.hairDark, 'inkfine', 0);
  }
  // Beauty mark below her left eye (screen right before mirroring).
  paint(ellPts(1.79 * s, -9.63 * s, .075 * s, .075 * s, 8), { wash: PAL.ink, ink: null });
  const m = o.mouth || 'smile', my = -9.2 * s;
  if (m === 'smile') inkLine([[-.5 * s, my], [-.26 * s, my + .17 * s], [0, my], [.26 * s, my + .17 * s], [.5 * s, my]], sw * .65, PAL.ink, 'ink', .65);
  else if (m === 'o') paint(ellPts(0, my + .08 * s, .24 * s, .3 * s, 10), { wash: '#813B4C', ink: PAL.ink, sw: sw * .4 });
  else if (m === 'O') paint(ellPts(0, my + .16 * s, .46 * s, .53 * s, 14), { wash: '#813B4C', ink: PAL.ink, sw: sw * .5 });
  else if (m === 'flat') inkLine([[-.4 * s, my], [.4 * s, my]], sw * .65, PAL.ink, 'ink', 0);
  else if (m === 'wobble') inkLine([[-.6 * s, my], [-.3 * s, my - .15 * s], [0, my], [.3 * s, my - .15 * s], [.6 * s, my]], sw * .6, PAL.ink, 'ink', .3);
  else if (m === 'grin') {
    paint([[-.65 * s, my - .12 * s], [.65 * s, my - .12 * s], [.4 * s, my + .42 * s], [-.4 * s, my + .42 * s]], { wash: '#813B4C', ink: PAL.ink, sw: sw * .5, curv: .4 });
    inkLine([[-.4 * s, my - .02 * s], [.4 * s, my - .02 * s]], sw * .7, KONATA.uniform, 'inkfine', 0);
  }
}

function researcherDancer(x, y, s, style, t, extra = {}) { const m = move(style, t, extra.seed || 0); researcher(x + m.dx * s, y, s, { ...m, walk: undefined, ...extra }); }
