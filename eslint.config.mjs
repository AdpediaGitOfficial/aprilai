import next from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...next,
  ...nextTs,
  {
    ignores: [".next/**", "node_modules/**"],
  },
  {
    // shadcn/ui primitives and hooks are treated as vendored code. Next 16's
    // new experimental react-hooks rules flag patterns the upstream registry
    // has not yet adapted to; relax them here only, keeping app code strict.
    files: ["components/ui/**", "hooks/**"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
    },
  },
];

export default eslintConfig;
