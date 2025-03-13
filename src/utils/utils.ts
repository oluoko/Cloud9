import { string } from "zod";

export function getInitials(firstName: string, secondName: string): string {
  return `${firstName[0]}.${secondName[0]}`;
}

export function getImageKey(src: string) {
  return src.substring(src.lastIndexOf("/") + 1);
}

export function generateRandomSixDigitNumber(): string {
  const randomNum = Math.floor(100000 + Math.random());
  const randomSixDigitString = randomNum.toString().padStart(6, "0");
  return randomSixDigitString;
}

// to delete and image maker a request to this route:
//  await axios.post("/api/uploadthing/delete", { imageKey });
