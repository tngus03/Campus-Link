// leo-profanity.d.ts
declare module "leo-profanity" {
  const leoProfanity: {
    clean: (text: string) => string;
    isProfane: (text: string) => boolean;
    add: (words: string[]) => void;
    getDictionary: (lang: "en" | "ko") => string[];
  };
  export default leoProfanity;
}
