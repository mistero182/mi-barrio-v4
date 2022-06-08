declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.json" {
  const content: string;
  export default content;
}

declare module '*.ttf' {
  const value: import("expo-font").FontSource;
  export default value;
}
declare module '*.woff2' {
  const value: import("expo-font").FontSource;
  export default value;
}