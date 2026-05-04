export const LANGUAGES = [
  // Web
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "PHP",

  // Systems
  "C",
  "C++",
  "C#",
  "Rust",
  "Go",
  "Zig",

  // JVM
  "Java",
  "Kotlin",
  "Scala",
  "Groovy",
  "Clojure",

  // Scripting
  "Python",
  "Ruby",
  "Perl",
  "Lua",

  // Mobile
  "Swift",
  "Dart",
  "Objective-C",

  // Functional
  "Haskell",
  "Elixir",
  "Erlang",
  "F#",
  "OCaml",

  // Data / ML
  "R",
  "Julia",
  "MATLAB",
  "Jupyter Notebook",

  // Shell / Infra
  "Shell",
  "PowerShell",
  "Dockerfile",
  "HCL",

  // Other
  "Solidity",
  "VHDL",
  "Assembly",
  "Nix",
] as const

export type Language = typeof LANGUAGES[number]