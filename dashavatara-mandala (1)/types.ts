export interface Avatar {
  id: number;
  name: string;
  sanskritName: string;
  title: string;
  color: string;
  description: string;
  symbol: string;
  mantra: string;
  mantraTransliteration: string;
  yuga: string;
  lesson: string;
  particlesColor: string;
}

export interface AvatarOrbProps {
  avatar: Avatar;
  position: [number, number, number];
  angle: number;
  isSelected: boolean;
  onSelect: (avatar: Avatar) => void;
}
