import rootConfig from "../../tailwind.config";

export default {
  ...rootConfig,
  content: ["./app/**/*.{ts,tsx}", "../../packages/**/*.{ts,tsx}"],
};
