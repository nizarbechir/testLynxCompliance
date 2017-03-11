package models;

import javax.persistence.*;

@Entity
public class Book {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	public Long id;
    public String title;
    public String author;
    public String description;
    public String page;
    public String cover;

    @Override
    public String toString() {
        return "Book{" +
                "title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", page='" + page + '\'' +
                '}';
    }
}
