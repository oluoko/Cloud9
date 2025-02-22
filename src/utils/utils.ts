export function getInitials(firstName: string, secondName: string): string {
  return `${firstName[0]}.${secondName[0]}`;
}

export function getImageKey(src: string) {
  src.substring(src.lastIndexOf("/") + 1);
}
