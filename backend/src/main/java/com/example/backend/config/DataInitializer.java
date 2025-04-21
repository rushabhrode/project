package com.example.backend.config;

import java.time.LocalDate;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.backend.entity.Book;
import com.example.backend.entity.BorrowRecord;
import com.example.backend.entity.User;
import com.example.backend.repository.BookRepository;
import com.example.backend.repository.BorrowRecordRepository;
import com.example.backend.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {
    private final BookRepository bookRepo;
    private final UserRepository userRepo;
    private final BorrowRecordRepository borrowRepo;

    public DataInitializer(BookRepository bookRepo,
                           UserRepository userRepo,
                           BorrowRecordRepository borrowRepo) {
        this.bookRepo = bookRepo;
        this.userRepo = userRepo;
        this.borrowRepo = borrowRepo;
    }

    @Override
    public void run(String... args) {
        // 1. wipe
        borrowRepo.deleteAll();
        bookRepo.deleteAll();
        userRepo.deleteAll();

        // 2. create books
        List<Book> books = List.of(
            new Book("1", "To Kill a Mockingbird", "Harper Lee",
                     "978-0446310789", 1960, "Fiction", "English",
                     true,
                     "https://images.pexels.com/photos/762687/pexels-photo-762687.jpeg?auto=compress&cs=tinysrgb&w=600",
                     "The unforgettable novel of a childhood..."),

            new Book("2", "मैला आंचल", "फणीश्वरनाथ रेणु",
                     "978-8126703814", 1954, "Fiction", "Hindi",
                     false,
                     "https://images.pexels.com/photos/3747163/pexels-photo-3747163.jpeg?auto=compress&cs=tinysrgb&w=600",
                     "मैला आंचल फणीश्वरनाथ रेणु का एक प्रसिद्ध उपन्यास..."),

            new Book("3", "नटसम्राट", "वि. वा. शिरवाडकर",
                     "978-8171315864", 1970, "Drama", "Marathi",
                     true,
                     "https://images.pexels.com/photos/2846814/pexels-photo-2846814.jpeg?auto=compress&cs=tinysrgb&w=600",
                     "नटसम्राट ही वि. वा. शिरवाडकर यांची प्रसिद्ध नाटक आहे..."),

            new Book("4", "1984", "George Orwell",
                     "978-0451524935", 1949, "Science Fiction", "English",
                     true,
                     "https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg?auto=compress&cs=tinysrgb&w=600",
                     "Among the seminal texts of the 20th century..."),

            new Book("5", "गोदान", "प्रेमचंद",
                     "978-8170288886", 1936, "Fiction", "Hindi",
                     true,
                     "https://images.pexels.com/photos/2846814/pexels-photo-2846814.jpeg?auto=compress&cs=tinysrgb&w=600",
                     "गोदान प्रेमचंद का अंतिम और सबसे महत्वपूर्ण उपन्यास है..."),

            new Book("6", "श्यामची आई", "साने गुरुजी",
                     "978-8177667332", 1933, "Biography", "Marathi",
                     false,
                     "https://images.pexels.com/photos/1926988/pexels-photo-1926988.jpeg?auto=compress&cs=tinysrgb&w=600",
                     "श्यामची आई ही साने गुरुजी यांची आत्मचरित्रात्मक कादंबरी आहे..."),

            new Book("7", "Pride and Prejudice", "Jane Austen",
                     "978-0141439518", 1813, "Fiction", "English",
                     true,
                     "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=600",
                     "Since its immediate success in 1813..."),

            new Book("8", "रश्मिरथी", "रामधारी सिंह दिनकर",
                     "978-8126703599", 1952, "Poetry", "Hindi",
                     true,
                     "https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg?auto=compress&cs=tinysrgb&w=600",
                     "रश्मिरथी महाभारत के कर्ण के जीवन पर आधारित एक खंडकाव्य है...")
        );
        bookRepo.saveAll(books);

        // 3. create users
        List<User> users = List.of(
            new User("1", "John Doe", "john@example.com", "user"),
            new User("2", "Jane Smith", "jane@example.com", "user"),
            new User("3", "Admin User", "admin@example.com", "admin")
        );
        userRepo.saveAll(users);

        // 4. create borrow records
        borrowRepo.saveAll(List.of(
            new BorrowRecord("1",
                             books.get(1),   // book id="2"
                             users.get(0),   // user id="1"
                             LocalDate.parse("2023-11-01"),
                             LocalDate.parse("2023-11-15"),
                             null),

            new BorrowRecord("2",
                             books.get(5),   // book id="6"
                             users.get(1),   // user id="2"
                             LocalDate.parse("2023-10-15"),
                             LocalDate.parse("2023-10-29"),
                             null),

            new BorrowRecord("3",
                             books.get(3),   // book id="4"
                             users.get(0),   // user id="1"
                             LocalDate.parse("2023-09-20"),
                             LocalDate.parse("2023-10-04"),
                             LocalDate.parse("2023-10-03"))
        ));
    }
}
