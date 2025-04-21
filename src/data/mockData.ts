import { Book, User, BorrowRecord } from '../types';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0446310789',
    publishedYear: 1960,
    genre: 'Fiction',
    language: 'English',
    available: true,
    coverImage: 'https://images.pexels.com/photos/762687/pexels-photo-762687.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. "To Kill A Mockingbird" became both an instant bestseller and a critical success when it was first published in 1960.'
  },
  {
    id: '2',
    title: 'मैला आंचल',
    author: 'फणीश्वरनाथ रेणु',
    isbn: '978-8126703814',
    publishedYear: 1954,
    genre: 'Fiction',
    language: 'Hindi',
    available: false,
    coverImage: 'https://images.pexels.com/photos/3747163/pexels-photo-3747163.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'मैला आंचल फणीश्वरनाथ रेणु का एक प्रसिद्ध उपन्यास है। इस उपन्यास में भारतीय गांव की परिस्थिति और स्वतंत्रता पश्चात के संघर्षों का वर्णन है।'
  },
  {
    id: '3',
    title: 'नटसम्राट',
    author: 'वि. वा. शिरवाडकर',
    isbn: '978-8171315864',
    publishedYear: 1970,
    genre: 'Drama',
    language: 'Marathi',
    available: true,
    coverImage: 'https://images.pexels.com/photos/2846814/pexels-photo-2846814.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'नटसम्राट ही वि. वा. शिरवाडकर यांची प्रसिद्ध नाटक आहे. या नाटकात घराला मुकलेल्या वृद्ध कलाकाराची कहाणी आहे.'
  },
  {
    id: '4',
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    publishedYear: 1949,
    genre: 'Science Fiction',
    language: 'English',
    available: true,
    coverImage: 'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.'
  },
  {
    id: '5',
    title: 'गोदान',
    author: 'प्रेमचंद',
    isbn: '978-8170288886',
    publishedYear: 1936,
    genre: 'Fiction',
    language: 'Hindi',
    available: true,
    coverImage: 'https://images.pexels.com/photos/2846814/pexels-photo-2846814.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'गोदान प्रेमचंद का अंतिम और सबसे महत्वपूर्ण उपन्यास है। यह भारतीय किसानों के जीवन और उनके संघर्षों का वर्णन करता है।'
  },
  {
    id: '6',
    title: 'श्यामची आई',
    author: 'साने गुरुजी',
    isbn: '978-8177667332',
    publishedYear: 1933,
    genre: 'Biography',
    language: 'Marathi',
    available: false,
    coverImage: 'https://images.pexels.com/photos/1926988/pexels-photo-1926988.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'श्यामची आई ही साने गुरुजी यांची आत्मचरित्रात्मक कादंबरी आहे. या कादंबरीत लेखकाने आपल्या आईबद्दलच्या आठवणी लिहिल्या आहेत.'
  },
  {
    id: '7',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '978-0141439518',
    publishedYear: 1813,
    genre: 'Fiction',
    language: 'English',
    available: true,
    coverImage: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language.'
  },
  {
    id: '8',
    title: 'रश्मिरथी',
    author: 'रामधारी सिंह दिनकर',
    isbn: '978-8126703599',
    publishedYear: 1952,
    genre: 'Poetry',
    language: 'Hindi',
    available: true,
    coverImage: 'https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'रश्मिरथी महाभारत के कर्ण के जीवन पर आधारित एक खंडकाव्य है। इसमें कर्ण के त्याग, वीरता और उदारता का वर्णन है।'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  }
];

export const mockBorrowings: BorrowRecord[] = [
  {
    id: '1',
    bookId: '2',
    userId: '1',
    borrowDate: '2023-11-01',
    dueDate: '2023-11-15',
    returnDate: null
  },
  {
    id: '2',
    bookId: '6',
    userId: '2',
    borrowDate: '2023-10-15',
    dueDate: '2023-10-29',
    returnDate: null
  },
  {
    id: '3',
    bookId: '4',
    userId: '1',
    borrowDate: '2023-09-20',
    dueDate: '2023-10-04',
    returnDate: '2023-10-03'
  }
];

// Helper function to convert array to map for easier access
export const getBookMap = (): Record<string, Book> => {
  return mockBooks.reduce((acc, book) => {
    acc[book.id] = book;
    return acc;
  }, {} as Record<string, Book>);
};

export const getUserMap = (): Record<string, User> => {
  return mockUsers.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as Record<string, User>);
};