export interface Member {
  avatar: string;
  name: string;
  id: string;
}

export interface ListItemDataType {
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


export interface SearchListItemDataType {
  _id:string;
  name:string;
  title:string;
  summary:string;
  author:string;
  isbn:string;
  genre:string;
  book: string;
  status: string;
  first_name:string;
  last_name:string;
  imprint: string;
  due_back: string;
  href:string;
}



// bookinstances": [
//   {
//   "status": "可供借阅",
//   "_id": "5feb1a5163e28321e093592d",
//   "book": "5feb1a5163e28321e093592a",
//   "imprint": "人民文学出版社 汉法对照 2017年版",
//   "due_back": "2020-12-29T12:00:17.769Z",
//   "__v": 0
//   },

// "authors": [
//   {
//   "_id": "5feb1a5163e28321e0935920",
//   "first_name": "迁",
//   "family_name": "司马",
//   "__v": 0
//   }
//   ]

// "genre": [
//   {
//   "_id": "5feb1a5163e28321e093591e",
//   "name": "历史",
//   "__v": 0
//   }
//   ],

// "books": [
//   {
//   "genre": [
//   "5feb1a5163e28321e093591f"
//   ],
//   "_id": "5feb1a5163e28321e0935927",
//   "title": "狂人日记",
//   "summary": "本书收录了鲁迅的小说集《呐喊》和《彷徨》的全部篇幅。鲁迅的小说数量不多，却篇篇经典，其内容多取材于病态的现实社会，对国民灵魂、知识分子的命运进行了深刻思考，同时善于从国家、民族生死存亡的高度，来认识、发掘问题的内在本质，铸造典型的艺术形象，因而具有极高的艺术价值。鲁迅的作品，不愧为中国社会从辛亥革命到第1次国内革命战争时期的一面镜子，堪称现代文学的典范。",
//   "author": "5feb1a5163e28321e0935924",
//   "isbn": "9787544369480",
//   "__v": 0
//   }
//   ],
