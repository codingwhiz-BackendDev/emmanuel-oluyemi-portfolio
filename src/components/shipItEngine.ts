export const WIDTH = 960;
export const HEIGHT = 440;
export const GROUND = 352;
export const PLAYER_X = 145;
export const PLAYER_SIZE = 54;

export type GameStatus = 'ready' | 'running' | 'paused' | 'over';

export type Entity = {
  kind: 'bug' | 'outage' | 'scope' | 'coffee' | 'commit';
  x: number;
  y: number;
  w: number;
  h: number;
  id: number;
  collected?: boolean;
};

export type GameState = {
  status: GameStatus;
  score: number;
  distance: number;
  time: number;
  speed: number;
  playerY: number;
  velocity: number;
  jumps: number;
  entities: Entity[];
  /** Logical pixels until the next spawn, not seconds. */
  spawnIn: number;
  nextId: number;
  combo: number;
  commits: number;
  coffees: number;
  bonus: number;
  reason: string;
  milestone: string;
};

const REST_Y = GROUND - PLAYER_SIZE;
const GRAVITY = 1900;
const JUMP_VELOCITY = -700;
const BASE_SPEED = 320;
const MAX_SPEED = 620;

export function milestoneFor(score: number): string {
  if (score >= 2500) return 'Production legend';
  if (score >= 1000) return 'Release captain';
  if (score >= 500) return 'Shipping streak';
  if (score >= 200) return 'First deploy';
  return 'Ready to ship';
}

export function createGame(): GameState {
  return {
    status: 'ready',
    score: 0,
    distance: 0,
    time: 0,
    speed: BASE_SPEED,
    playerY: REST_Y,
    velocity: 0,
    jumps: 0,
    entities: [],
    spawnIn: 420,
    nextId: 1,
    combo: 0,
    commits: 0,
    coffees: 0,
    bonus: 0,
    reason: '',
    milestone: milestoneFor(0),
  };
}

export function startGame(): GameState {
  return { ...createGame(), status: 'running' };
}

export function jump(state: GameState): boolean {
  if (state.status !== 'running' || state.jumps >= 2) return false;
  state.velocity = JUMP_VELOCITY;
  state.jumps += 1;
  return true;
}

export function togglePause(state: GameState): void {
  if (state.status === 'running') state.status = 'paused';
  else if (state.status === 'paused') state.status = 'running';
}

function spawn(state: GameState, random: () => number): void {
  const roll = random();
  const kind: Entity['kind'] = roll < 0.22 ? 'commit'
    : roll < 0.36 ? 'coffee'
    : roll < 0.6 ? 'bug'
    : roll < 0.82 ? 'scope' : 'outage';
  const collectible = kind === 'commit' || kind === 'coffee';
  const w = collectible ? 30 : kind === 'bug' ? 44 : kind === 'scope' ? 74 : 60;
  const h = collectible ? 30 : kind === 'bug' ? 42 : kind === 'scope' ? 48 : 70;
  const y = collectible ? REST_Y - 30 - random() * 115 : GROUND - h;

  state.entities.push({
    id: state.nextId++,
    kind,
    // Carry overshoot into the new entity's position for frame-independent spacing.
    x: WIDTH + 32 + state.spawnIn,
    y,
    w,
    h,
  });
  // Even at maximum speed, leave time for two jumps and a grounded recovery.
  state.spawnIn += w + 90 + state.speed * (1.6 + random() * 0.5);
}

function touchesPlayer(state: GameState, entity: Entity): boolean {
  const collectible = entity.kind === 'commit' || entity.kind === 'coffee';
  const inset = collectible ? 0 : 5;
  return PLAYER_X + 10 < entity.x + entity.w - inset
    && PLAYER_X + PLAYER_SIZE - 10 > entity.x + inset
    && state.playerY + 6 < entity.y + entity.h - inset
    && state.playerY + PLAYER_SIZE - 4 > entity.y + inset;
}

/** Mutates only state; random is the only external input and should return [0, 1). */
export function stepGame(
  state: GameState,
  dtSeconds: number,
  random: () => number = Math.random,
): void {
  if (state.status !== 'running' || !Number.isFinite(dtSeconds)) return;
  const dt = Math.max(0, Math.min(0.04, dtSeconds));
  if (dt === 0) return;

  state.time += dt;
  const previousSpeed = state.speed;
  state.speed = Math.min(MAX_SPEED, BASE_SPEED + state.time * 3);
  const travel = (previousSpeed + state.speed) * 0.5 * dt;
  state.distance += travel;

  state.playerY += state.velocity * dt + 0.5 * GRAVITY * dt * dt;
  state.velocity += GRAVITY * dt;
  if (state.playerY >= REST_Y) {
    state.playerY = REST_Y;
    state.velocity = 0;
    state.jumps = 0;
  }

  for (const entity of state.entities) entity.x -= travel;
  state.spawnIn -= travel;
  if (state.spawnIn <= 0) spawn(state, random);

  for (const entity of state.entities) {
    if (entity.collected || !touchesPlayer(state, entity)) continue;
    if (entity.kind === 'commit' || entity.kind === 'coffee') {
      entity.collected = true;
      state.combo = Math.min(5, state.combo + 1);
      if (entity.kind === 'commit') state.commits += 1;
      else state.coffees += 1;
      state.bonus += (entity.kind === 'commit' ? 75 : 40) + (state.combo - 1) * 10;
    } else {
      state.status = 'over';
      state.reason = entity.kind === 'bug' ? 'A bug slipped into production.'
        : entity.kind === 'outage' ? 'An outage stopped the release.'
        : 'Scope creep blocked the launch.';
      state.combo = 0;
      break;
    }
  }

  state.entities = state.entities.filter(entity => entity.x + entity.w >= 0);
  state.score = Math.floor(state.distance / 10) + state.bonus;
  state.milestone = milestoneFor(state.score);
}
