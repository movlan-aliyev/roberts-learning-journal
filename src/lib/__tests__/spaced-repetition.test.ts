/**
 * Spaced repetition interval logic tests.
 * Run with: npx tsx src/lib/__tests__/spaced-repetition.test.ts
 */

const INTERVALS = [1, 3, 7, 14, 30, 60];

function nextInterval(
  current: number,
  rating: "again" | "hard" | "good" | "easy",
): number {
  const idx = INTERVALS.indexOf(current);
  switch (rating) {
    case "again": return INTERVALS[0];
    case "hard": return idx >= 0 ? INTERVALS[Math.min(idx, INTERVALS.length - 1)] : INTERVALS[0];
    case "good": return idx >= 0 ? INTERVALS[Math.min(idx + 1, INTERVALS.length - 1)] : INTERVALS[1];
    case "easy": return idx >= 0 ? INTERVALS[Math.min(idx + 2, INTERVALS.length - 1)] : INTERVALS[2];
  }
}

let passed = 0;
let failed = 0;

function assert(name: string, condition: boolean) {
  if (condition) { console.log(`  PASS: ${name}`); passed++; }
  else { console.error(`  FAIL: ${name}`); failed++; }
}

console.log("Spaced repetition tests\n");

assert("again from 7 ? 1", nextInterval(7, "again") === 1);
assert("hard from 7 ? 7 (same)", nextInterval(7, "hard") === 7);
assert("good from 7 ? 14", nextInterval(7, "good") === 14);
assert("easy from 7 ? 30", nextInterval(7, "easy") === 30);
assert("good from 60 ? 60 (cap)", nextInterval(60, "good") === 60);
assert("easy from 60 ? 60 (cap)", nextInterval(60, "easy") === 60);
assert("again from 1 ? 1", nextInterval(1, "again") === 1);
assert("good from 1 ? 3", nextInterval(1, "good") === 3);
assert("easy from 1 ? 7", nextInterval(1, "easy") === 7);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
