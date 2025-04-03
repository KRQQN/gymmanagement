import {
  Loader2,
  LucideProps,
  Moon,
  SunMedium,
  Laptop,
  Facebook,
} from "lucide-react";
import { Google } from "lucide-react";

export type Icon = LucideProps;

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  spinner: Loader2,
  google: Google,
  facebook: Facebook,
  loader: Loader2,
} as const;

export type IconKeys = keyof typeof Icons; 