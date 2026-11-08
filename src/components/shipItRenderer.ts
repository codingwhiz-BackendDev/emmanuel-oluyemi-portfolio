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

export function drawGame(
  ctx: CanvasRenderingContext2D,
  game: GameState,
  photo: HTMLImageElement | null,
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
  ctx.fillText("EMMANUEL / RELEASE RUNNER", 25, 29);
  ctx.fillStyle = "#d9ff66";
  ctx.fillText(
    `${game.speed.toFixed(0)} PX/S  //  ${game.milestone.toUpperCase()}`,
    25,
    48,
  );

  for (const item of game.entities) entity(ctx, item, time);

  const air = Math.max(0, GROUND - PLAYER_SIZE - playerY);
  ctx.fillStyle = `rgba(0,0,0,${Math.max(0.12, 0.35 - air / 800)})`;
  ctx.beginPath();
  ctx.ellipse(
    PLAYER_X + 27,
    GROUND - 2,
    Math.max(11, 25 - air / 15),
    5,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.save();
  ctx.translate(PLAYER_X + PLAYER_SIZE / 2, playerY + PLAYER_SIZE / 2);
  ctx.rotate(game.jumps ? -0.12 : 0);
  if (!reducedMotion && game.status === "running") {
    for (let i = 1; i < 5; i++) {
      ctx.fillStyle = `rgba(184,143,255,${0.23 / i})`;
      box(ctx, -27 - i * 15, -19 + Math.sin(time * 12 + i) * 4, 24, 38, 9);
      ctx.fill();
    }
  }
  ctx.shadowColor = game.jumps === 2 ? "#d9ff66" : "#aa80ff";
  ctx.shadowBlur = 16;
  ctx.fillStyle = game.jumps === 2 ? "#d9ff66" : "#ad89ff";
  box(ctx, -28, -28, 56, 56, 17);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.save();
  box(ctx, -23, -23, 46, 46, 12);
  ctx.clip();
  if (photo?.complete && photo.naturalWidth) {
    // Crop the source portrait around the face rather than squeezing the photo.
    const side = Math.min(photo.naturalWidth, photo.naturalHeight) * 0.55;
    ctx.drawImage(
      photo,
      (photo.naturalWidth - side) / 2,
      photo.naturalHeight * 0.32,
      side,
      side,
      -23,
      -23,
      46,
      46,
    );
  } else {
    ctx.fillStyle = "#292039";
    ctx.fillRect(-23, -23, 46, 46);
    ctx.fillStyle = "#d9ff66";
    ctx.font = "bold 19px monospace";
    ctx.fillText("EO", -13, 7);
  }
  ctx.restore();
  const stride =
    game.jumps || game.status !== "running" ? 0 : Math.sin(time * 22) * 5;
  ctx.fillStyle = "#d9ff66";
  box(ctx, -21, 27, 19, 7 + stride, 3);
  ctx.fill();
  box(ctx, 7, 27, 19, 7 - stride, 3);
  ctx.fill();
  ctx.restore();
  if (game.combo > 1) {
    ctx.fillStyle = "#d9ff66";
    ctx.font = "bold 13px monospace";
    ctx.fillText(`COMBO ×${game.combo}`, PLAYER_X - 8, playerY - 17);
  }
}
