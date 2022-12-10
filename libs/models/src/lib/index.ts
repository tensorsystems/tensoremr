export * from './payloads';
export interface Lookup {
  value: string;
  label: string;
}

export interface Tab {
  title: string;
  route: string;
  icon: JSX.Element;
  selectedIcon: JSX.Element;
}

export type Id = string;

export interface DraggableLocation {
  droppableId: Id;
  index: number;
}

export type AuthorColors = {
  soft: string;
  hard: string;
};

export type Author = {
  id: Id;
  name: string;
  avatarUrl: string;
  url: string;
  colors: AuthorColors;
};

export type Quote = {
  id: Id;
  content: string;
  author: Author;
};

export type Dragging = {
  id: Id;
  location: DraggableLocation;
};

export type QuoteMap = {
  [key: string]: Quote[];
};

export type Task = {
  id: Id;
  content: string;
};

export interface Page {
  title: string;
  cancellable: boolean | true;
  route: string;
  icon: string;
  match?: Array<string>;
  notifs?: number;
}
