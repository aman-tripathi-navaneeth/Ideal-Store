// localStorage-based data service for the bookstore app

// Hardcoded users
const USERS = {
  '226K1A0545': { roll_number: '226K1A0545', password: 'aman123', name: 'Aman' },
  '216K1A0503': { roll_number: '216K1A0503', password: 'aman123', name: 'Abhishek' }
};

// Initialize localStorage with default data if not exists
export const initializeData = () => {
  if (!localStorage.getItem('bookstore_books')) {
    localStorage.setItem('bookstore_books', JSON.stringify([]));
  }
  // Always reset users to ensure they're properly stored
  localStorage.setItem('bookstore_users', JSON.stringify(USERS));
  console.log('Initialized users in localStorage:', USERS);
};

// Authentication functions
export const authenticateUser = (rollNumber, password) => {
  console.log('Authenticating user:', rollNumber, 'with password:', password);
  
  const usersString = localStorage.getItem('bookstore_users');
  console.log('Users from localStorage:', usersString);
  
  const users = JSON.parse(usersString || '{}');
  console.log('Parsed users:', users);
  
  const user = users[rollNumber];
  console.log('Found user:', user);
  
  if (user && user.password === password) {
    console.log('Authentication successful');
    return { success: true, user: user };
  }
  console.log('Authentication failed');
  return { success: false, message: 'Invalid roll number or password' };
};

// Book management functions
export const getAllBooks = () => {
  return JSON.parse(localStorage.getItem('bookstore_books') || '[]');
};

export const addBook = (bookData, imageFiles = []) => {
  try {
    const books = getAllBooks();
    const newBook = {
      id: Date.now().toString(),
      ...bookData,
      created_at: new Date().toISOString(),
      images: []
    };

    // Handle image files - convert to base64 and store
    if (imageFiles && imageFiles.length > 0) {
      const imagePromises = imageFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              name: file.name,
              data: e.target.result,
              type: file.type
            });
          };
          reader.readAsDataURL(file);
        });
      });

      return Promise.all(imagePromises).then(images => {
        newBook.images = images;
        books.push(newBook);
        localStorage.setItem('bookstore_books', JSON.stringify(books));
        return { success: true, book: newBook };
      });
    } else {
      books.push(newBook);
      localStorage.setItem('bookstore_books', JSON.stringify(books));
      return Promise.resolve({ success: true, book: newBook });
    }
  } catch (error) {
    return Promise.resolve({ success: false, message: error.message });
  }
};

export const deleteBook = (bookId, userRollNumber) => {
  try {
    const books = getAllBooks();
    const bookIndex = books.findIndex(book => 
      book.id === bookId && book.seller_roll_no === userRollNumber
    );
    
    if (bookIndex === -1) {
      return { success: false, message: 'Book not found or unauthorized' };
    }
    
    books.splice(bookIndex, 1);
    localStorage.setItem('bookstore_books', JSON.stringify(books));
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getUserBooks = (rollNumber) => {
  const books = getAllBooks();
  return books.filter(book => book.seller_roll_no === rollNumber);
};

export const getBooksExceptUser = (rollNumber) => {
  const books = getAllBooks();
  return books.filter(book => book.seller_roll_no !== rollNumber);
};

// User profile functions
export const getUserProfile = (rollNumber) => {
  const users = JSON.parse(localStorage.getItem('bookstore_users') || '{}');
  const user = users[rollNumber];
  
  if (user) {
    const userBooks = getUserBooks(rollNumber);
    return {
      success: true,
      user: {
        ...user,
        member_since: '2024-01-01', // Default member since date
        total_books: userBooks.length
      }
    };
  }
  
  return { success: false, message: 'User not found' };
};

// Initialize data on import
initializeData();