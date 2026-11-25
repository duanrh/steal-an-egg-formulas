import { pathToFileURL } from 'node:url';

// Zero-dependency reference formulas for Roblox "Steal an Egg".
// Full interactive calculators: https://calcdenhq.com/steal-an-egg-calculator/

export const SOFT_CAP = 125;
const LOW = 37 / 60;
const HIGH = 2 / 5;
const JOIN = Math.pow(SOFT_CAP, 13 / 60);
const CAP_MULT = Math.pow(SOFT_CAP, LOW);

export function sizeMultiplier(ratio) {
  if (!(ratio > 0)) return 0;
  return ratio <= SOFT_CAP ? Math.pow(ratio, LOW) : Math.pow(ratio, HIGH) * JOIN;
}

export function ratioForMultiplier(mult) {
  if (!(mult > 0)) return 0;
  return mult <= CAP_MULT ? Math.pow(mult, 1 / LOW) : Math.pow(mult / JOIN, 1 / HIGH);
}

export function stackedMutation(mults) {
  let bonus = 0;
  for (const m of mults) if (Number.isFinite(m) && m > 1) bonus += m - 1;
  return 1 + bonus;
}

export function income({ base, weight, baseWeight, ratio, mutation = 1 }) {
  const r = ratio ?? (baseWeight > 0 ? weight / baseWeight : 0);
  const size = sizeMultiplier(r);
  return { ratio: r, size, total: size * mutation, perSecond: base * size * mutation };
}

export function baseWeightFrom({ base, weight, shownIncome, mutation = 1 }) {
  const ratio = ratioForMultiplier(shownIncome / (base * mutation));
  return ratio > 0 ? weight / ratio : null;
}

export function perStep(treadmillPerStep, trailMult = 1, boostMult = 1) {
  return treadmillPerStep * trailMult * boostMult;
}

export function stepsTo(currentSpeed, targetSpeed, speedPerStep) {
  if (currentSpeed >= targetSpeed) return 0;
  if (!(speedPerStep > 0)) return Infinity;
  return Math.ceil((targetSpeed - currentSpeed) / speedPerStep);
}

// Run `node formulas.mjs` to print worked checks.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log('100x size multiplier:', sizeMultiplier(100).toFixed(2));
  console.log('1000x size multiplier:', sizeMultiplier(1000).toFixed(2));
  console.log('Rainbow + Enchanted + Spectral:', stackedMutation([3.5, 2.75, 2.75]));
  console.log('Giant Sloth 100x Golden $/s:', Math.round(income({ base: 4e6, ratio: 100, mutation: 2.5 }).perSecond));
  console.log('Angelic x Divine speed/step:', perStep(2000, 14, 1));
}
