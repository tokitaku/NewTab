const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = process.cwd();
const indexSource = fs.readFileSync(path.join(root, "src/pages/index.tsx"), "utf8");
const stylesSource = fs.readFileSync(path.join(root, "src/styles/Home.module.css"), "utf8");

assert(
  indexSource.includes("className={styles.timerAnchor}"),
  "Expected index.tsx to render Clock inside styles.timerAnchor.",
);

assert(
  indexSource.includes("<Clock />"),
  "Expected index.tsx to render Clock.",
);

assert(
  indexSource.includes("<PomodoroTimer />"),
  "Expected index.tsx to render PomodoroTimer.",
);

assert(
  indexSource.indexOf("<Clock />") < indexSource.indexOf("</div>", indexSource.indexOf("className={styles.timerAnchor}")),
  "Expected Clock to be rendered inside styles.timerAnchor.",
);

assert(
  stylesSource.includes(".timerAnchor") && stylesSource.includes("position: absolute;"),
  "Expected .timerAnchor to use absolute positioning.",
);

assert(
  stylesSource.includes(".timerAnchor") && stylesSource.includes("top: 24px;"),
  "Expected .timerAnchor to define a top offset.",
);

assert(
  stylesSource.includes(".timerAnchor") && stylesSource.includes("right: 24px;"),
  "Expected .timerAnchor to define a right offset.",
);

console.log("Timer position contract passed.");
