import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { transform } from 'esbuild';

const source = await readFile(new URL('../src/components/shipItEngine.ts', import.meta.url), 'utf8');
const { code } = await transform(source, { loader: 'ts', format: 'esm', target: 'es2020' });
const engine = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const {
  WIDTH, HEIGHT, GROUND, PLAYER_X, PLAYER_SIZE,
  createGame, startGame, jump, togglePause, stepGame, milestoneFor,
} = engine;
const REST_Y = GROUND - PLAYER_SIZE;

function seededRandom(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function entity(kind, overrides = {}) {
  return {
    id: 100,
    kind,
    x: PLAYER_X + 8,
    y: GROUND - 42,
    w: 44,
    h: 42,
    ...overrides,
  };
}

await test('constants, fresh state, and independent resets', () => {
  assert.deepEqual([WIDTH, HEIGHT, GROUND, PLAYER_X, PLAYER_SIZE], [960, 440, 352, 145, 54]);
  const ready = createGame();
  assert.equal(ready.status, 'ready');
  assert.equal(ready.playerY, REST_Y);
  assert.equal(ready.velocity, 0);
  assert.equal(ready.score, 0);
  assert.equal(ready.milestone, milestoneFor(0));
  const running = startGame();
  assert.deepEqual(running, { ...ready, status: 'running' });
  running.entities.push(entity('bug'));
  running.bonus = 500;
  running.commits = 3;
  running.coffees = 2;
  running.reason = 'Old run';
  assert.equal(ready.entities.length, 0);
  assert.deepEqual(startGame(), { ...createGame(), status: 'running' });
});

await test('jump limits, negative velocity, and landing reset', () => {
  assert.equal(jump(createGame()), false);
  const state = startGame();
  state.spawnIn = 100000;
  assert.equal(jump(state), true);
  assert.ok(state.velocity < 0);
  stepGame(state, 0.04);
  assert.ok(state.playerY < REST_Y);
  assert.equal(jump(state), true);
  const before = structuredClone(state);
  assert.equal(jump(state), false);
  assert.deepEqual(state, before);
  for (let i = 0; i < 100; i += 1) stepGame(state, 0.02);
  assert.equal(state.playerY, REST_Y);
  assert.equal(state.velocity, 0);
  assert.equal(state.jumps, 0);
  assert.equal(jump(state), true);
});

await test('ready, paused, and over states freeze completely', () => {
  for (const status of ['ready', 'paused', 'over']) {
    const state = { ...startGame(), status, spawnIn: 0 };
    const before = structuredClone(state);
    stepGame(state, 0.04, () => assert.fail('Frozen state consumed randomness'));
    assert.equal(jump(state), false);
    assert.deepEqual(state, before);
  }
  const state = startGame();
  togglePause(state);
  assert.equal(state.status, 'paused');
  togglePause(state);
  assert.equal(state.status, 'running');
  for (const status of ['ready', 'over']) {
    state.status = status;
    togglePause(state);
    assert.equal(state.status, status);
  }
});

await test('each obstacle ends the run, with forgiving edge hitboxes', () => {
  for (const kind of ['bug', 'outage', 'scope']) {
    const state = startGame();
    state.entities = [entity(kind)];
    stepGame(state, 0.001);
    assert.equal(state.status, 'over');
    assert.ok(state.reason.length > 0);
    const before = structuredClone(state);
    stepGame(state, 0.04);
    assert.deepEqual(state, before);
  }
  const grazing = startGame();
  grazing.entities = [entity('bug', { x: PLAYER_X + PLAYER_SIZE - 2 })];
  stepGame(grazing, 0.001);
  assert.equal(grazing.status, 'running');
  const airborne = startGame();
  airborne.playerY = REST_Y - 120;
  airborne.entities = [entity('outage', { y: GROUND - 70, h: 70 })];
  stepGame(airborne, 0.001);
  assert.equal(airborne.status, 'running');
});

await test('collections award integer bonuses and update counters only once', () => {
  const state = startGame();
  state.entities = [entity('commit'), entity('coffee', { id: 101 })];
  stepGame(state, 0.001);
  assert.equal(state.status, 'running');
  assert.equal(state.commits, 1);
  assert.equal(state.coffees, 1);
  assert.equal(state.combo, 2);
  assert.equal(state.bonus, 125);
  assert.ok(state.entities.every(item => item.collected));
  stepGame(state, 0.001);
  assert.equal(state.bonus, 125);
  assert.equal(state.commits, 1);
  assert.equal(state.coffees, 1);
  assert.equal(state.score, Math.floor(state.distance / 10) + state.bonus);
  assert.ok(Number.isInteger(state.score));
});

await test('progression increases speed, caps it, updates milestones, and cleans entities', () => {
  const state = startGame();
  state.spawnIn = 1000000;
  state.entities = [entity('bug', { x: -100 })];
  for (let i = 0; i < 3000; i += 1) stepGame(state, 0.04);
  assert.ok(state.time > 119);
  assert.ok(state.distance > 320 * state.time);
  assert.equal(state.speed, 620);
  assert.equal(state.entities.length, 0);
  assert.equal(state.score, Math.floor(state.distance / 10));
  assert.equal(state.milestone, milestoneFor(state.score));
  for (const threshold of [200, 500, 1000, 2500]) {
    assert.notEqual(milestoneFor(threshold - 1), milestoneFor(threshold));
  }
  assert.deepEqual(startGame(), { ...createGame(), status: 'running' });
});

await test('spawn geometry, IDs, reachable pickups, and speed-scaled spacing', () => {
  for (const time of [0, 100]) {
    const state = startGame();
    state.time = time;
    state.speed = time === 0 ? 320 : 620;
    for (const roll of [0, 0.3, 0.5, 0.7, 0.9]) {
      state.spawnIn = 0;
      const rolls = [roll, 0.99, 0.5];
      let index = 0;
      stepGame(state, 0.001, () => rolls[index++]);
      const item = state.entities.at(-1);
      assert.equal(item.id, state.nextId - 1);
      assert.ok(item.x > WIDTH);
      if (item.kind === 'commit' || item.kind === 'coffee') {
        assert.ok(item.y >= REST_Y - 145);
        assert.ok(item.y + item.h <= REST_Y);
      } else {
        assert.equal(item.y + item.h, GROUND);
      }
      assert.ok(state.spawnIn > state.speed * 1.6 + item.w);
    }
    assert.equal(new Set(state.entities.map(item => item.id)).size, 5);
  }
});

await test('seeded runs reproduce exactly for the same timestep and input sequence', () => {
  const first = startGame();
  const second = startGame();
  const randomA = seededRandom(42);
  const randomB = seededRandom(42);
  for (let i = 0; i < 2400; i += 1) {
    if (i % 27 === 0) {
      jump(first);
      jump(second);
    }
    const dt = [0.01, 0.02, 0.04][i % 3];
    stepGame(first, dt, randomA);
    stepGame(second, dt, randomB);
    assert.deepEqual(first, second);
    // Keep the seeded simulation running long enough to exercise many spawns.
    first.entities = first.entities.filter(item => item.x > PLAYER_X + 100);
    second.entities = second.entities.filter(item => item.x > PLAYER_X + 100);
  }
  assert.equal(first.status, 'running');
  assert.ok(first.nextId > 10);
});

await test('dt clamps at 40ms and invalid/nonpositive dt is a no-op', () => {
  const clamped = startGame();
  const normal = startGame();
  stepGame(clamped, 10);
  stepGame(normal, 0.04);
  assert.deepEqual(clamped, normal);
  for (const dt of [0, -1, NaN, Infinity, -Infinity]) {
    const state = startGame();
    state.spawnIn = 0;
    const before = structuredClone(state);
    stepGame(state, dt, () => assert.fail('Invalid dt consumed randomness'));
    assert.deepEqual(state, before);
  }
  const whole = startGame();
  const split = startGame();
  jump(whole);
  jump(split);
  stepGame(whole, 0.04);
  stepGame(split, 0.02);
  stepGame(split, 0.02);
  for (const key of ['time', 'distance', 'speed', 'playerY', 'velocity', 'spawnIn']) {
    assert.ok(Math.abs(whole[key] - split[key]) < 1e-9, `${key} differs across dt partitions`);
  }
});
