export interface Member {
  avatar: string;
  name: string;
  id: string;
}

export interface BasicListItemDataType {
  id: string;
  owner: string;
  title: string;
  avatar: string;
  cover: string;
  status: 'normal' | 'exception' | 'active' | 'success';
  percent: number;
  logo: string;
  href: string;
  body?: any;
  updatedAt: number;
  createdAt: number;
  subDescription: string;
  description: string;
  activeUser: number;
  newUser: number;
  star: number;
  like: number;
  message: number;
  content: string;
  members: Member[];
}

export interface BooksListItemDataType {
  _id: string;
  title: string;
  cover: string;
  logo: string;
  author: string;
  first_name: string;
  family_name: string;
  date_of_birth: string;
  available: number;
  status: string;
  href:string;
  summary: string;
}

// export interface BooksList {
//   id: string;
//   name?: string;
//   barcode?: string;
//   price?: string;
//   num?: string | number;
//   amount?: string | number;
// }

export interface BookAvalibale {
  key: string;
  time: string;
  rate: string;
  status: string;
  operator: string;
  cost: string;
}

export interface BooksListDataType {
  booksListItemDataType: BooksListItemDataType[];
  bookAvalibale: BookAvalibale[];
}

// {
//   "_id": "5feb1a5163e28321e0935926",
//   "title": "金瓶梅",
//   "author": {
//       "_id": "5feb1a5163e28321e0935923",
//       "first_name": "言",
//       "family_name": "莫",
//       "date_of_birth": "1955-02-16T16:00:00.000Z",
//       "__v": 0
//   }
// },