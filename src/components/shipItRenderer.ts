import {
  GROUND,
  HEIGHT,
  PLAYER_SIZE,
  PLAYER_X,
  WIDTH,
  type Entity,
  type GameState,
} from "./shipItEngine";

function box(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number | number[] = 8,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
}

function entity(ctx: CanvasRenderingContext2D, item: Entity, time: number) {
  if (item.collected) return;
  const { x, y, w, h, kind } = item;
  const pickup = kind === "commit" || kind === "coffee";
  const bob = pickup ? Math.sin(time * 5 + item.id) * 4 : 0;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.lineWidth = 2;
  if (pickup) {
    ctx.shadowColor = kind === "commit" ? "#d9ff66" : "#ffc783";
    ctx.shadowBlur = 16;
    ctx.fillStyle = kind === "commit" ? "#d9ff66" : "#ffc783";
    box(ctx, 0, 0, w, h, 9);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#252039";
    if (kind === "commit") {
      ctx.beginPath();
      ctx.moveTo(4, 15);
      ctx.lineTo(10, 15);
      ctx.moveTo(20, 15);
      ctx.lineTo(26, 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(15, 15, 5, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      box(ctx, 6, 10, 14, 13, 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(21, 15, 4, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(11, 4);
      ctx.lineTo(11, 7);
      ctx.moveTo(16, 4);
      ctx.lineTo(16, 7);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = "#321c3b";
    ctx.strokeStyle = "#ff7a9a";
    ctx.shadowColor = "#ff527a";
    ctx.shadowBlur = 10;
    box(ctx, 0, 0, w, h, 7);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    if (kind === "bug") {
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2 + 2, 8, 11, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      for (const side of [-1, 1]) {
        for (const offset of [-5, 3, 10]) {
          ctx.moveTo(w / 2 + side * 7, h / 2 + offset);
          ctx.lineTo(w / 2 + side * 15, h / 2 + offset - 4);
        }
      }
      ctx.moveTo(w / 2, 13);
      ctx.lineTo(w / 2, 32);
      ctx.stroke();
    } else if (kind === "outage") {
      for (let row = 0; row < 3; row++) {
        box(ctx, 8, 9 + row * 18, w - 16, 12, 3);
        ctx.stroke();
        ctx.fillStyle = row === 1 ? "#ff7a9a" : "#926180";
        ctx.fillRect(13, 13 + row * 18, 4, 4);
      }
    } else {
      ctx.font = "bold 25px monospace";
      ctx.fillStyle = "#ff9cb4";
      ctx.fillText("+ +", 12, 31);
    }
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffb0c5";
    ctx.fillText(
      kind === "bug" ? "BUG" : kind === "scope" ? "SCOPE CREEP" : "OUTAGE",
      w / 2,
      -12,
    );
  }
  ctx.restore();
}

function courier(
  ctx: CanvasRenderingContext2D,
  game: GameState,
  reducedMotion: boolean,
) {
  const { time, jumps, velocity, status } = game;
  const crashed = status === "over";
  // Pausing must retain the exact running pose, including its exhaust and scarf.
  const active = status === "running" || status === "paused";
  const airborne = jumps > 0;
  const phase = time * 22;
  const stride = active && !airborne ? Math.sin(phase) : 0;
  const lift = active && !airborne ? Math.abs(Math.cos(phase)) : 0;
  const flutter = reducedMotion || !active ? 0 : Math.sin(time * 15) * 2;
  const boost = active && jumps === 2 && velocity < 0;
  const air = Math.max(0, GROUND - PLAYER_SIZE - game.playerY);

  ctx.save();
  ctx.fillStyle = `rgba(0,0,0,${Math.max(0.12, 0.35 - air / 800)})`;
  ctx.beginPath();
  ctx.ellipse(
    PLAYER_X + PLAYER_SIZE / 2,
    GROUND - 2,
    Math.max(11, 25 - air / 15),
    4,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.translate(PLAYER_X, game.playerY);
  ctx.scale(PLAYER_SIZE / 54, PLAYER_SIZE / 54);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const plate = (
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    radius = 3,
  ) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = "#19172d";
    ctx.lineWidth = 1.5;
    box(ctx, x, y, w, h, radius);
    ctx.fill();
    ctx.stroke();
  };
  const limb = (
    x: number,
    y: number,
    kneeX: number,
    kneeY: number,
    endX: number,
    endY: number,
    color: string,
  ) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(kneeX, kneeY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "#19172d";
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = "#635080";
    ctx.beginPath();
    ctx.arc(kneeX, kneeY, 2.5, 0, Math.PI * 2);
    ctx.fill();
  };

  if (boost) {
    // The solid exhaust is a jump cue; only its decorative motes are optional.
    for (const x of [11, 18]) {
      ctx.fillStyle = "#ac8aff";
      ctx.beginPath();
      ctx.moveTo(x - 3, 36);
      ctx.lineTo(x + 3, 36);
      ctx.lineTo(x + 1, 47 + Math.sin(time * 28) * 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#e7ff9b";
      box(ctx, x - 1, 37, 2, 7, 1);
      ctx.fill();
    }
  }
  if (!reducedMotion && active) {
    for (let i = 0; i < 3; i++) {
      const travel = (time * (boost ? 7 : 4) + i / 3) % 1;
      ctx.fillStyle = `rgba(${boost ? "217,255,102" : "184,143,255"},${(1 - travel) * 0.45})`;
      if (boost) {
        ctx.fillRect(9 + i * 4, 43 + travel * 19, 2, 3);
      } else if (!airborne) {
        ctx.fillRect(-3 - travel * 22, 49 - i * 3, 5, 2);
      }
    }
  }

  // All solid parts live inside the 54px player box, even in the crash pose.
  if (crashed) {
    ctx.translate(27, 29);
    ctx.rotate(0.28);
    ctx.scale(0.82, 0.82);
    ctx.translate(-27, -27);
  } else {
    ctx.translate(0, -lift);
  }

  // Far limbs, parcel pack and scarf sit behind the bright foreground shell.
  limb(
    25,
    36,
    airborne ? 19 : 24 - stride * 5,
    airborne ? 40 : 43,
    airborne ? 26 : 23 - stride * 7,
    airborne ? 44 : 50 - Math.max(0, stride) * 3,
    "#82729f",
  );
  plate(
    airborne ? 22 : 18 - stride * 7,
    airborne ? 42 : 48 - Math.max(0, stride) * 3,
    11,
    5,
    "#9280b9",
    2,
  );
  limb(
    24,
    28,
    crashed ? 12 : 17 + stride * 4,
    crashed ? 25 : 32,
    crashed ? 8 : 16 + stride * 7,
    crashed ? 18 : 38,
    "#9280b9",
  );
  plate(7, 25, 14, 15, "#9674d9", 4);
  plate(9, 28, 8, 7, "#d8cff3", 2);
  ctx.fillStyle = "#d9ff66";
  ctx.fillRect(11, 30, 4, 2);
  plate(9, 37, 5, 4, "#4c405f", 1);

  ctx.fillStyle = "#bd9aff";
  ctx.strokeStyle = "#19172d";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(23, 24);
  ctx.lineTo(10, 22 + flutter);
  ctx.lineTo(2, 25 + flutter);
  ctx.lineTo(5, 28 + flutter);
  ctx.lineTo(1, 31 + flutter);
  ctx.lineTo(13, 29 + flutter);
  ctx.lineTo(25, 29);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  limb(
    33,
    37,
    airborne ? 40 : 33 + stride * 5,
    airborne ? 39 : 44,
    airborne ? 34 : 34 + stride * 7,
    airborne ? 46 : 50 - Math.max(0, -stride) * 3,
    "#eeeafa",
  );
  plate(
    airborne ? 30 : 30 + stride * 7,
    airborne ? 44 : 48 - Math.max(0, -stride) * 3,
    12,
    5,
    "#f5f2ff",
    2,
  );
  ctx.fillStyle = "#d9ff66";
  ctx.fillRect(
    airborne ? 33 : 33 + stride * 7,
    airborne ? 47 : 51 - Math.max(0, -stride) * 3,
    7,
    2,
  );

  plate(21, 25, 17, 15, "#f0ecff", 5);
  plate(22, 35, 15, 5, "#6f52a5", 2);
  ctx.fillStyle = "#635080";
  ctx.fillRect(27, 29, 7, 2);
  ctx.fillStyle = "#d9ff66";
  ctx.fillRect(29, 29, 3, 4);
  limb(
    36,
    28,
    crashed ? 44 : 43 - stride * 4,
    crashed ? 23 : airborne ? 32 : 34,
    crashed ? 46 : airborne ? 44 : 41 - stride * 7,
    crashed ? 17 : airborne ? 27 : 40,
    "#f5f2ff",
  );
  plate(
    crashed ? 43 : airborne ? 41 : 38 - stride * 7,
    crashed ? 14 : airborne ? 24 : 37,
    7,
    7,
    "#b69ae8",
    3,
  );

  // Oversized helmet and separated lime eyes stay legible at phone scale.
  plate(15, 2, 32, 25, "#f5f2ff", 10);
  ctx.fillStyle = "#ac87ec";
  box(ctx, 16, 3, 12, 23, [9, 2, 3, 8]);
  ctx.fill();
  plate(21, 9, 26, 14, "#171c30", 6);
  ctx.strokeStyle = "#53617c";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(28, 11);
  ctx.lineTo(40, 11);
  ctx.stroke();
  ctx.strokeStyle = "#d9ff66";
  ctx.lineWidth = 2;
  ctx.shadowColor = "#d9ff66";
  ctx.shadowBlur = reducedMotion ? 0 : 5;
  if (crashed) {
    for (const x of [29, 39]) {
      ctx.beginPath();
      ctx.moveTo(x - 2, 14);
      ctx.lineTo(x + 2, 18);
      ctx.moveTo(x + 2, 14);
      ctx.lineTo(x - 2, 18);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = "#d9ff66";
    box(ctx, 28, 14, 4, 5, 1.5);
    ctx.fill();
    box(ctx, 38, 14, 4, 5, 1.5);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  plate(12, 12, 7, 9, "#8c67c9", 3);
  ctx.fillStyle = "#d9ff66";
  ctx.fillRect(14, 14, 2, 4);
  plate(23, 24, 17, 5, "#b493ed", 2);
  ctx.restore();
}

export function drawGame(
  ctx: CanvasRenderingContext2D,
  game: GameState,
  reducedMotion: boolean,
) {
  const { distance, time, playerY } = game;
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, "#121125");
  sky.addColorStop(0.65, "#292044");
  sky.addColorStop(1, "#191426");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Fixed stars and layered skyline move at different depths, not the UI.
  for (let i = 0; i < 35; i++) {
    ctx.fillStyle = i % 4 === 0 ? "#bea9ff" : "#77718c";
    const x =
      (((i * 173 + 29 - (reducedMotion ? 0 : distance * 0.025)) % WIDTH) +
        WIDTH) %
      WIDTH;
    ctx.fillRect(x, 18 + ((i * 47) % 185), i % 4 === 0 ? 3 : 2, 2);
  }
  const halo = ctx.createRadialGradient(747, 112, 4, 747, 112, 140);
  halo.addColorStop(0, "#9571e859");
  halo.addColorStop(1, "#9571e800");
  ctx.fillStyle = halo;
  ctx.fillRect(600, 0, 300, 270);
  ctx.strokeStyle = "#ac8ce657";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(747, 112, 57, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(747, 112, 89, 18, -0.35, 0, Math.PI * 2);
  ctx.stroke();

  for (let layer = 0; layer < 2; layer++) {
    const offset = reducedMotion ? 0 : distance * (layer ? 0.2 : 0.07);
    for (let i = -1; i < 14; i++) {
      const x = i * 88 - (offset % 88);
      const height = 45 + (((i + Math.floor(offset / 88) + 1000) * 31) % 125);
      const bottom = layer ? GROUND : GROUND - 25;
      ctx.fillStyle = layer ? "#19152c" : "#33264c";
      box(ctx, x, bottom - height, 66, height, [4, 4, 0, 0]);
      ctx.fill();
      if (layer) {
        for (let row = 0; row < Math.floor(height / 21) - 1; row++) {
          ctx.fillStyle = row % 3 === 0 ? "#c4a0ff38" : "#6e5e8a38";
          ctx.fillRect(x + 12, bottom - height + 13 + row * 21, 13, 5);
          ctx.fillRect(x + 39, bottom - height + 13 + row * 21, 13, 5);
        }
      }
    }
  }
  ctx.strokeStyle = "#b08aff15";
  ctx.lineWidth = 1;
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, GROUND);
    ctx.lineTo(i * 130 - 260, HEIGHT);
    ctx.stroke();
  }
  for (let i = 0; i < 5; i++) {
    const y = GROUND + 12 + i * 22;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
  ctx.shadowBlur = 14;
  ctx.shadowColor = "#b28aff";
  ctx.fillStyle = "#a78bfa";
  ctx.fillRect(0, GROUND, WIDTH, 2);
  ctx.shadowBlur = 0;
  for (let i = 0; i < 17; i++) {
    ctx.fillStyle = "#d9ff6655";
    ctx.fillRect(i * 70 - (distance % 70), GROUND + 11, 22, 2);
  }
  ctx.fillStyle = "#b7a8d4";
  ctx.font = "11px monospace";
  ctx.fillText("BYTE / RELEASE COURIER", 25, 29);
  ctx.fillStyle = "#d9ff66";
  ctx.fillText(
    `${game.speed.toFixed(0)} PX/S  //  ${game.milestone.toUpperCase()}`,
    25,
    48,
  );

  for (const item of game.entities) entity(ctx, item, time);

  courier(ctx, game, reducedMotion);
  if (game.combo > 1) {
    ctx.fillStyle = "#d9ff66";
    ctx.font = "bold 13px monospace";
    ctx.fillText(`COMBO ×${game.combo}`, PLAYER_X - 8, playerY - 17);
  }
}
